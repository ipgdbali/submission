const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadRepoTestHelper = require('../../../../tests/ThreadRepoTestHelper');

const container = require('../../container');
const createServer = require('../createServer');


describe('Proyek 2 - Optional', () => {

  let accessTokenUser1;
  let accessTokenUser2;
  let server;
  let threadId;
  let commentId;

  const user1_payload = {
    username : 'dicoding',
    password : 'secret',
    fullname : 'Dicoding Indonesia'
  };

  const user2_payload = {
    username : 'johndoe',
    password : 'secret',
    fullname : 'John Doe'
  };

  beforeAll( async () => {

    server = await createServer(container);

    // create user 1
    await server.inject({
      method : 'POST',
      url : '/users',
      payload : user1_payload,
    });

    // create user 2
    await server.inject({
      method : 'POST',
      url : '/users',
      payload : user2_payload,
    });

    // login user 1
    let response = await server.inject({
      method : 'POST',
      url : '/authentications',
      payload : {
        username : user1_payload.username,
        password : user1_payload.password,
      },
    });

    // Save token 
    let responseJson = JSON.parse(response.payload);
    accessTokenUser1 = responseJson.data.accessToken;

    // login user 2
    response = await server.inject({
      method : 'POST',
      url : '/authentications',
      payload : {
        username : user2_payload.username,
        password : user2_payload.password,
      },
    });

    // Save token 
    responseJson = JSON.parse(response.payload);
    accessTokenUser2 = responseJson.data.accessToken;


    // Add Thread with user 1
    let payload = {
      title : 'title',
      body : 'body',
    };
      
    response = await server.inject({
      method : 'POST',
      url : '/threads',
      headers : {
        'Authorization' : `Bearer ${ accessTokenUser1 }`
      },
      payload
    });

    responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    threadId = responseJson.data.addedThread.id;

    // add Comment user 1
    payload = {
      content : 'My Comment'
    };

    response = await server.inject({
      method : 'POST',
      url : `/threads/${threadId}/comments`,
      headers : {
        'Authorization' : `Bearer ${accessTokenUser1}`
      },
      payload
    });

    // Assert
    responseJson = JSON.parse(response.payload);
  
    expect(response.statusCode).toEqual(201);
    expect(responseJson.data.addedComment.id).toBeDefined();
    commentId = responseJson.data.addedComment.id;


  });

  afterAll( async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadRepoTestHelper.cleanTable();
  });



  describe('Fitur Menyukai dan Batal Menyukai', () => {

    it('should return 401 if no auth', async () => {

      const response = await server.inject({
        method : 'PUT',
        url : '/threads/{threadId}/comments/{commentId}/likes'
      });

      expect(response.statusCode).toEqual(401);

    });

    it('should return 404 if thread is notfound/invalid', async () => {

      const response = await server.inject({
        method : 'PUT',
        url : '/threads/xxx/comments/{commentId}/likes',
        headers : {
          'Authorization' : `Bearer ${accessTokenUser1}`
        },        
      });

      expect(response.statusCode).toEqual(404);

    });

    it('should return 404 if comment is notfound/invalid', async () => {

      const response = await server.inject({
        method : 'PUT',
        url : '/threads/{threadId}/comments/xxx/likes',
        headers : {
          'Authorization' : `Bearer ${accessTokenUser1}`
        },        
      });

      expect(response.statusCode).toEqual(401);

    });

    it('should show like count correctly 0', async () => {

      const response = await server.inject({
        method : 'GET',
        url : `/threads/${threadId}`,
        headers : {
          'Authorization' : `Bearer ${ accessTokenUser1 }`
        }
      });

      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBe(threadId);
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].id).toBe(commentId);
      expect(responseJson.data.thread.comments[0].likeCount).toBe(0);

    });


    it('should like if never liked before - user 1', async () => {

      const response = await server.inject({
        method : 'PUT',
        url : '/threads/{threadId}/comments/{commentId}/likes',
        headers : {
          'Authorization' : `Bearer ${accessTokenUser1}`
        },          
      });

      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toBe('success');

    });

    it('should show like count correctly 1', async () => {

      const response = await server.inject({
        method : 'GET',
        url : `/threads/${threadId}`,
        headers : {
          'Authorization' : `Bearer ${ accessTokenUser1 }`
        }
      });

      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBe(threadId);
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].id).toBe(commentId);
      expect(responseJson.data.thread.comments[0].likeCount).toBe(1);

    });

    it('should like if never liked before - user 2 ', async () => {

      const response = await server.inject({
        method : 'PUT',
        url : '/threads/{threadId}/comments/{commentId}/likes',
        headers : {
          'Authorization' : `Bearer ${accessTokenUser2}`
        },          
      });

      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toBe('success');


    });

    it('should show like count correctly 2', async () => {
      
      const response = await server.inject({
        method : 'GET',
        url : `/threads/${threadId}`,
        headers : {
          'Authorization' : `Bearer ${ accessTokenUser1 }`
        }
      });

      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBe(threadId);
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].id).toBe(commentId);
      expect(responseJson.data.thread.comments[0].likeCount).toBe(2);

    });

    it('should unlike if liked before - user 1', async() => {

      const response = await server.inject({
        method : 'PUT',
        url : '/threads/{threadId}/comments/{commentId}/likes',
        headers : {
          'Authorization' : `Bearer ${accessTokenUser1}`
        },          
      });

      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toBe('success');

    });

    it('should show like count correctly 3', async () => {
      
      const response = await server.inject({
        method : 'GET',
        url : `/threads/${threadId}`,
        headers : {
          'Authorization' : `Bearer ${ accessTokenUser1 }`
        }
      });

      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBe(threadId);
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].id).toBe(commentId);
      expect(responseJson.data.thread.comments[0].likeCount).toBe(1);

    });

    it('should unlike if liked before - user 2', async() => {

      const response = await server.inject({
        method : 'PUT',
        url : '/threads/{threadId}/comments/{commentId}/likes',
        headers : {
          'Authorization' : `Bearer ${accessTokenUser1}`
        },          
      });

      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toBe('success');

    });

    it('should show like count correctly 4', async () => {
      
      const response = await server.inject({
        method : 'GET',
        url : `/threads/${threadId}`,
        headers : {
          'Authorization' : `Bearer ${ accessTokenUser1 }`
        }
      });

      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBe(threadId);
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].id).toBe(commentId);
      expect(responseJson.data.thread.comments[0].likeCount).toBe(0);

    });

  });

});