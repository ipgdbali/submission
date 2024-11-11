const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadRepoTestHelper = require('../../../../tests/ThreadRepoTestHelper');

const container = require('../../container');
const createServer = require('../createServer');

describe('Proyek 1 - Kriteria 2', () => {

  let accessToken;
  let server;
  let threadId;

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
    const payload = {
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

  });

  afterAll( async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadRepoTestHelper.cleanTable();
  });

  describe('Add Comment', () => {

    it('should return 401 if no auth', async () => {
      const payload = {
        content : 'My Comment'
      };
      
      const response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments`,
        payload
      });

      expect(response.statusCode).toEqual(401);
    });

    it('should return 404 if thread not found', async () => {

      const payload = {
        content : 'My Comment'
      };

      const response = await server.inject({
        method : 'POST',
        url : '/threads/thread-xyc/comments',
        headers : {
          'Authorization' : `Bearer ${ accessToken }`
        },
        payload
      });

      expect(response.statusCode).toEqual(404);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
    });

    it('should return 404 if thread is not valid', async () => {
      const payload = {
        content : 'My Comment'
      };

      const response = await server.inject({
        method : 'POST',
        url : '/threads/xxx/comments',
        headers : {
          'Authorization' : `Bearer ${ accessToken }`
        },
        payload
      });

      expect(response.statusCode).toEqual(404);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');

    });

    it('should return 400 if payload has missing property', async () => {
      const payload = {
      };

      const response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments`,
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        },
        payload
      });

      expect(response.statusCode).toEqual(400);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
    });

    it('should return 400 if payload has error type', async () => {
      const payload = {
        content : 1234
      };

      const response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments`,
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        },
        payload
      });

      expect(response.statusCode).toEqual(400);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
    });


    it('should return 201 if work correctly ', async () => {
    
      const payload = {
        content : 'My Comment'
      };

      const response = await server.inject({
        method : 'POST',
        url : `/threads/${threadId}/comments`,
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        },
        payload
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
    
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.content).toBe(payload.content);
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    
    });
  });

});
