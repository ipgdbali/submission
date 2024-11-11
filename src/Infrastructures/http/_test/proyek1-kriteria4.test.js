const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadRepoTestHelper = require('../../../../tests/ThreadRepoTestHelper');

const container = require('../../container');
const createServer = require('../createServer');

describe('Proyek 1 - Kriteria 4', () => {

  describe('Thread Detail', () => {

    let accessToken;
    let server;
    let threadId;
    let commentId1, commentId2;
    let replyId1, replyId2;
  
    const user_payload = {
      username : 'dicoding',
      password : 'secret',
      fullname : 'Dicoding Indonesia'
    };
  
    beforeAll( async () => {
  
      server = await createServer(container);
  
      // create user
      await server.inject({
        method : 'POST',
        url : '/users',
        payload : user_payload,
      });
  
      // login user
      let response = await server.inject({
        method : 'POST',
        url : '/authentications',
        payload : {
          username : user_payload.username,
          password : user_payload.password,
        },
      });
  
      // Save token 
      let responseJson = JSON.parse(response.payload);
      accessToken = responseJson.data.accessToken;
      //refreshToken = responseJson.data.refreshToken;
  
      // Add Thread
      let payload = {
        title : 'title',
        body : 'body',
      };
        
      response = await server.inject({
        method : 'POST',
        url : '/threads',
        headers : {
          'Authorization' : `Bearer ${ accessToken }`
        },
        payload
      });
  
      responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread.title).toBe(payload.title);
      expect(responseJson.data.addedThread.id).toBeDefined();
      threadId = responseJson.data.addedThread.id;
      expect(responseJson.data.addedThread.owner).toBeDefined();
  
      // add Comment 1
      payload = {
        content : 'My Comment 1'
      };
  
      response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments`,
        headers : {
          'Authorization' : `Bearer ${ accessToken }`
        },
        payload
      });
  
      // Assert
      responseJson = JSON.parse(response.payload);
    
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.content).toBe(payload.content);
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
  
      commentId1 = responseJson.data.addedComment.id;
  
      // add Comment 2
      payload = {
        content : 'My Comment 2'
      };
  
      response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments`,
        headers : {
          'Authorization' : `Bearer ${ accessToken }`
        },
        payload
      });
  
      // Assert
      responseJson = JSON.parse(response.payload);
    
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.content).toBe(payload.content);
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
  
      commentId2 = responseJson.data.addedComment.id;

      // Delete Comment 2

      response = await server.inject({
        method : 'DELETE',
        url : `/threads/${threadId}/comments/${commentId2}`,
        headers : {
          'Authorization' : `Bearer ${ accessToken }`
        },
        payload
      });


      // add reply 1 on comment 1
  
      payload = {
        content : 'My Reply 1'
      };
  
      response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments/${commentId1}/replies`,
        headers : {
          'Authorization' : `Bearer ${ accessToken }`
        },              
        payload
      });
  
      expect(response.statusCode).toEqual(201);
  
      responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply.content).toBe(payload.content);
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
  
      replyId1 = responseJson.data.addedReply.id;

      // Add Replay 2 on Comment 1
  
      payload = {
        content : 'My Reply 2'
      };
  
      response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments/${commentId1}/replies`,
        headers : {
          'Authorization' : `Bearer ${ accessToken }`
        },              
        payload
      });
  
      expect(response.statusCode).toEqual(201);
  
      responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply.content).toBe(payload.content);
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
  
      replyId2 = responseJson.data.addedReply.id;

      // Delete Reply2
      response = await server.inject({
        method : 'DELETE',
        url : `/threads/${threadId}/comments/${commentId1}/replies/${replyId2}`,
        headers : {
          'Authorization' : `Bearer ${ accessToken }`
        }
      });

    });
  
    afterAll( async () => {
      await UsersTableTestHelper.cleanTable();
      await AuthenticationsTableTestHelper.cleanTable();
      await ThreadRepoTestHelper.cleanTable();
    });
  
    it('should work correctly', async () => {

      const response = await server.inject({
        method : 'GET',
        url : `/threads/${threadId}`,
        headers : {
          'Authorization' : `Bearer ${ accessToken }`
        }
      });
  
      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBeDefined();
      expect(responseJson.data.thread.title).toBe('title');
      expect(responseJson.data.thread.body).toBe('body');
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.username).toBe('dicoding');
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);

      expect(responseJson.data.thread.comments[0]).toBeDefined();
      expect(responseJson.data.thread.comments[0].id).toBeDefined();
      expect(responseJson.data.thread.comments[0].username).toBe('dicoding');
      expect(responseJson.data.thread.comments[0].date).toBeDefined();
      expect(responseJson.data.thread.comments[0].content).toBe('My Comment 1');
      expect(responseJson.data.thread.comments[0].replies).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(2);

      expect(responseJson.data.thread.comments[0].replies[0].id).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies[0].content).toBe('My Reply 1');
      expect(responseJson.data.thread.comments[0].replies[0].date).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies[0].username).toBe('dicoding');

      expect(responseJson.data.thread.comments[0].replies[1].id).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies[1].content).toBe('**balasan telah dihapus**');
      expect(responseJson.data.thread.comments[0].replies[1].date).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies[1].username).toBe('dicoding');

      expect(responseJson.data.thread.comments[1]).toBeDefined();
      expect(responseJson.data.thread.comments[1].id).toBeDefined();
      expect(responseJson.data.thread.comments[1].username).toBe('dicoding');
      expect(responseJson.data.thread.comments[1].date).toBeDefined();
      expect(responseJson.data.thread.comments[1].content).toBe('**komentar telah dihapus**');
      expect(responseJson.data.thread.comments[1].replies).toBeDefined();
      expect(responseJson.data.thread.comments[1].replies).toHaveLength(0);


    });

  });

});