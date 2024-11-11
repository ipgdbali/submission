const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadRepoTestHelper = require('../../../../tests/ThreadRepoTestHelper');

const container = require('../../container');
const createServer = require('../createServer');


describe('Proyek 1 - Kriteria 3', () => {

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
    //refreshToken = responseJson.data.refreshToken;

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
    //refreshToken = responseJson.data.refreshToken;

    // Add Thread with user1
    let payload = {
      title : 'title',
      body : 'body',
    };
      
    response = await server.inject({
      method : 'POST',
      url : '/threads',
      headers : {
        'Authorization' : `Bearer ${accessTokenUser1}`
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

    // add Comment with user1
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

  describe('Delete Comment', () => {

    it('should return 401 if no auth', async () => {

      const response = await server.inject({
        method : 'DELETE',
        url : `/threads/${threadId}/comments/${commentId}`
      });

      expect(response.statusCode).toEqual(401);
      
    });

    it('should return 403 if delete not his/her comment', async () => {

      const response = await server.inject({
        method : 'DELETE',
        url : `/threads/${threadId}/comments/${commentId}`,
        headers : {
          'Authorization' : `Bearer ${accessTokenUser2}`
        },        
      });

      expect(response.statusCode).toEqual(403);
    });

    it('should return 404 if thread is not found/valid', async () => {

      const response = await server.inject({
        method : 'DELETE',
        url : `/threads/xxx/comments/${commentId}`,
        headers : {
          'Authorization' : `Bearer ${accessTokenUser1}`
        },        
      });

      expect(response.statusCode).toEqual(404);

    });

    it('should return 404 if comment is not found/valid', async () => {

      const response = await server.inject({
        method : 'DELETE',
        url : `/threads/${threadId}/comments/xxx`,
        headers : {
          'Authorization' : `Bearer ${accessTokenUser1}`
        },        
      });

      expect(response.statusCode).toEqual(404);

    });

    it('should return 200 if work correctly', async () => {

      const response = await server.inject({
        method : 'DELETE',
        url : `/threads/${threadId}/comments/${commentId}`,
        headers : {
          'Authorization' : `Bearer ${accessTokenUser1}`
        }
      });
  
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
  
    });

  });
});