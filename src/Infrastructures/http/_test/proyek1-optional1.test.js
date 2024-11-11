const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadRepoTestHelper = require('../../../../tests/ThreadRepoTestHelper');

const container = require('../../container');
const createServer = require('../createServer');

describe('Proyek 1 - Kriteria Opsional 1', () => {

  let accessToken;
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
        username : 'dicoding',
        password : 'secret',
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
        'Authorization' : `Bearer ${ accessToken}`
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

    // add Comment 
    payload = {
      content : 'My Comment'
    };

    response = await server.inject({
      method : 'POST',
      url : `/threads/${threadId}/comments`,
      headers : {
        'Authorization' : `Bearer ${accessToken}`
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

    commentId = responseJson.data.addedComment.id;

  });

  afterAll( async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadRepoTestHelper.cleanTable();
  });


  const reply_payload = {
    content : 'My Reply'
  };

  describe('Add Reply', () => {

    it('should return 401 if no auth', async () => {

      const response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments/${commentId}/replies`,
        payload : reply_payload
      });

      expect(response.statusCode).toEqual(401);      
    });

    it('should return 404 if no thread', async () => {

      const response = await server.inject({
        method : 'POST',
        url : `/threads/xxx/comments/${commentId}/replies`,
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        },              
        payload : reply_payload
      });

      expect(response.statusCode).toEqual(404);

    });

    it('should return 404 if no comment', async () => {

      const response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments/xxx/replies`,
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        },              
        payload : reply_payload
      });

      expect(response.statusCode).toEqual(404);

    });

    it('should return 400 if payload is missing property', async () => {

      const response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments/${commentId}/replies`,
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        },              
        payload : {
        }
      });

      expect(response.statusCode).toEqual(400);

    });

    it('should return 400 if payload type is error', async () => {

      const response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments/${commentId}/replies`,
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        },              
        payload : {
          content : 1234
        }
      });

      expect(response.statusCode).toEqual(400);

    });

    it('should return 201 if work correctly', async () => {

      const response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments/${commentId}/replies`,
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        },              
        payload : reply_payload
      });

      expect(response.statusCode).toEqual(201);

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply.content).toBe(reply_payload.content);
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

  });

});