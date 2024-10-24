const ThreadRepoTestHelper = require('../../../../tests/ThreadRepoTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

const container = require('../../container');
const createServer = require('../createServer');


describe('/threads endpoint', () => {

    let accessToken;
    let server;

    const user1_payload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
    };

    const user2_payload = {
            username: 'johndoe',
            password: 'secret',
            fullname: 'John Doe',
    }

    /**
     * Create user & login
     */
    beforeAll( async () => {
        server = await createServer(container);

        // create user 1
        await server.inject({
            method: 'POST',
            url: '/users',
            payload: user1_payload,
        });

        // create user 2
        await server.inject({
            method: 'POST',
            url: '/users',
            payload: user2_payload,
        });

        // login user 1
        const response = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: {
                username: 'dicoding',
                password: 'secret',
            },
        });

        // Save token 
        const responseJson = JSON.parse(response.payload);
        accessToken = responseJson.data.accessToken;
        //refreshToken = responseJson.data.refreshToken;

    })

    afterAll( async () => {
        UsersTableTestHelper.cleanTable();
        AuthenticationsTableTestHelper.cleanTable();
    })

    

    describe('Add Thread',() => {

        it('should return 401 if no auth',async () => {
            const payload = {
                title:"title",
                body:"body",
              };
            
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload
              });

            expect(response.statusCode).toEqual(401);
        })

        it('should error if payload has missing property',async () => {
            const payload = {
                title:"title",
              };
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                headers:{
                    "Authorization": `Bearer ${  accessToken}`
                },
                payload
              });
            expect(response.statusCode).toEqual(400);
            const responseJson = JSON.parse(response.payload);
            expect(responseJson.status).toEqual('fail');
        })

        it('should error if payload has error type',async () => {
            const payload = {
                title:12,
                body:"body",
              };

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                headers:{
                    "Authorization": `Bearer ${  accessToken}`
                },
                payload
              });

            expect(response.statusCode).toEqual(400);
            const responseJson = JSON.parse(response.payload);
            expect(responseJson.status).toEqual('fail');
        })

        it('should add thread correctly',async () => {
            const payload = {
                title:"title",
                body:"body",
              };
              
              const response = await server.inject({
                method: 'POST',
                url: '/threads',
                headers:{
                    "Authorization": `Bearer ${  accessToken}`
                },
                payload
              });
        
              const responseJson = JSON.parse(response.payload);
              expect(response.statusCode).toEqual(201);
              expect(responseJson.status).toEqual('success');
              expect(responseJson.data.addedThread.title).toBe(payload.title)
              expect(responseJson.data.addedThread.id).toBeDefined();
              expect(responseJson.data.addedThread.owner).toBeDefined();
        
        })
    })
  
    describe('add Comment',() => {

        it('should add comment correctly',async () => {

              // add Thread 
              const thread_payload = {
                title:"title",
                body:"body",
              };
              let response = await server.inject({
                method: 'POST',
                url: '/threads',
                headers:{
                    "Authorization": `Bearer ${  accessToken}`
                },
                payload:thread_payload
              });
              let responseJson = JSON.parse(response.payload);
              expect(response.statusCode).toEqual(201);
              expect(responseJson.status).toEqual('success');
              expect(responseJson.data.addedThread.title).toBe(thread_payload.title)
              expect(responseJson.data.addedThread.id).toBeDefined();

              // add Comment 
              const payload = {
                content : 'my content'
              };

              response = await server.inject({
                method: 'POST',
                url: `/threads/${  responseJson.data.addedThread.id  }/comments`,
                headers:{
                    "Authorization": `Bearer ${  accessToken}`
                },
                payload
              });
        
              // Assert
              responseJson = JSON.parse(response.payload);
              expect(response.statusCode).toEqual(201);
              expect(responseJson.status).toEqual('success');
              expect(responseJson.data.addedComment.content).toBe(payload.content)
              expect(responseJson.data.addedComment.id).toBeDefined();
              expect(responseJson.data.addedComment.owner).toBeDefined();

        })
    })

    describe('del Comment',() => {

        it('should delete comment correctly',async () => {
              
      
            // add Thread 
            const thread_payload = {
              title:"title",
              body:"body",
            };

            let response = await server.inject({
              method: 'POST',
              url: '/threads',
              headers:{
                  "Authorization": `Bearer ${  accessToken}`
              },
              payload:thread_payload
            });

            let responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread.title).toBe(thread_payload.title)
            expect(responseJson.data.addedThread.id).toBeDefined();

            const threadId = responseJson.data.addedThread.id;

            // add Comment 
            const payload = {
              content : 'my content'
            };

            response = await server.inject({
              method: 'POST',
              url: `/threads/${  threadId  }/comments`,
              headers:{
                  "Authorization": `Bearer ${  accessToken}`
              },
              payload
            });
      
            // Assert
            responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment.content).toBe(payload.content)
            expect(responseJson.data.addedComment.id).toBeDefined();
            expect(responseJson.data.addedComment.owner).toBeDefined();
            const commentId = responseJson.data.addedComment.id;

            response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers:{
                    "Authorization": `Bearer ${  accessToken}`
                },
                payload
            });

            responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');

        })

    });

    it('should do everything correctly',async () => {

        const headers = {
            "Authorization": `Bearer ${  accessToken}`
        }

        // Add Thread
        let response = await server.inject({
            method: 'POST',
            url: '/threads',
            headers,
            payload:{
                title:'title',
                body:'body'
            }
        });

        let responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(201);
        expect(responseJson.status).toEqual('success');
        expect(responseJson).toBeDefined();
        expect(responseJson.data).toBeDefined();
        expect(responseJson.data.addedThread).toBeDefined();
        expect(responseJson.data.addedThread.id).toBeDefined();
        expect(responseJson.data.addedThread.title).toBe('title');
        expect(responseJson.data.addedThread.owner).toBeDefined();
        const threadId = responseJson.data.addedThread.id;
        
        // Add Comment
        response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments`,
            headers:{
                "Authorization": `Bearer ${  accessToken}`
            },
            payload:{
                content:'comment 1'
            }
        });

        
        expect(response.statusCode).toEqual(201);

        responseJson = JSON.parse(response.payload);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.data).toBeDefined();
        expect(responseJson.data.addedComment).toBeDefined()
        expect(responseJson.data.addedComment).toBeDefined()
        expect(responseJson.data.addedComment.id).toBeDefined();
        expect(responseJson.data.addedComment.owner).toBeDefined();            
        expect(responseJson.data.addedComment.content).toBe('comment 1')
        const commentId1 = responseJson.data.addedComment.id;

        response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments`,
            headers:{
                "Authorization": `Bearer ${  accessToken}`
            },
            payload:{
                content:'comment 2'
            }
        });
        expect(response.statusCode).toEqual(201);

        responseJson = JSON.parse(response.payload);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.data).toBeDefined();
        expect(responseJson.data.addedComment).toBeDefined()
        expect(responseJson.data.addedComment.id).toBeDefined();
        expect(responseJson.data.addedComment.owner).toBeDefined();            
        expect(responseJson.data.addedComment.content).toBe('comment 2')
        const commentId2 = responseJson.data.addedComment.id;

        
        response = await server.inject({
            method: 'DELETE',
            url: `/threads/${threadId}/comments/${commentId2}`,
            headers
        });
        expect(response.statusCode).toEqual(200);

        // Add Reply
        response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments/${commentId1}/replies`,
            headers,
            payload:{
                content:'reply 1'
            }
        });
        expect(response.statusCode).toEqual(201);
        responseJson = JSON.parse(response.payload);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.data).toBeDefined();
        expect(responseJson.data.addedReply).toBeDefined();
        expect(responseJson.data.addedReply.id).toBeDefined();
        expect(responseJson.data.addedReply.content).toBeDefined();
        expect(responseJson.data.addedReply.owner).toBeDefined();
        const reply1 = responseJson.data.addedReply.id;

        response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments/${commentId1}/replies`,
            headers,
            payload:{
                content:'reply 2'
            }
        });

        expect(response.statusCode).toEqual(201);
        responseJson = JSON.parse(response.payload);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.data).toBeDefined();
        expect(responseJson.data.addedReply).toBeDefined();
        expect(responseJson.data.addedReply.id).toBeDefined();
        expect(responseJson.data.addedReply.content).toBeDefined();
        expect(responseJson.data.addedReply.owner).toBeDefined();
        const reply2 = responseJson.data.addedReply.id;

        response = await server.inject({
            method: 'DELETE',
            url: `/threads/${threadId}/comments/${commentId1}/replies/${reply2}`,
            headers
        });
        expect(response.statusCode).toEqual(200);


        response = await server.inject({
            method: 'GET',
            url: `/threads/${threadId}`,
            headers
        });

        expect(response.statusCode).toEqual(200)
        responseJson = JSON.parse(response.payload);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.data).toBeDefined();
        expect(responseJson.data.thread).toBeDefined();
        expect(responseJson.data.thread.id).toBeDefined();
        expect(responseJson.data.thread.title).toBeDefined();
        expect(responseJson.data.thread.body).toBeDefined();
        expect(responseJson.data.thread.username).toBeDefined();
        expect(responseJson.data.thread.comments).toHaveLength(2)
        expect(responseJson.data.thread.comments[0].replies).toBeDefined();
        expect(responseJson.data.thread.comments[0].replies[0].id).toBe(reply1)
        expect(responseJson.data.thread.comments[0].replies[1].content).toEqual('**balasan telah dihapus**');

    })        

})