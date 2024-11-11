const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadRepoTestHelper = require('../../../../tests/ThreadRepoTestHelper');

const container = require('../../container');
const createServer = require('../createServer');

describe('Proyek 1 - Kriteria 1', () => {

  let accessToken;
  let server;

  const user1_payload = {
    username : 'dicoding',
    password : 'secret',
    fullname : 'Dicoding Indonesia',
  };

  const user2_payload = {
    username : 'johndoe',
    password : 'secret',
    fullname : 'John Doe',
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
    const response = await server.inject({
      method : 'POST',
      url : '/authentications',
      payload : {
        username : 'dicoding',
        password : 'secret',
      },
    });

    // Save token 
    const responseJson = JSON.parse(response.payload);
    accessToken = responseJson.data.accessToken;
    //refreshToken = responseJson.data.refreshToken;

  });

  afterAll( async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadRepoTestHelper.cleanTable();
  });

  describe('Add Thread', () => {

    it('should return 401 if no auth', async () => {
      const payload = {
        title : 'title',
        body : 'body',
      };
            
      const response = await server.inject({
        method : 'POST',
        url : '/threads',
        payload
      });

      expect(response.statusCode).toEqual(401);
    });

    it('should return 400 if payload is missing property', async () => {

      const payload = {
        title : 'title',
      };

      const response = await server.inject({
        method : 'POST',
        url : '/threads',
        headers : {
          'Authorization' : `Bearer ${ accessToken }`
        },
        payload
      });

      expect(response.statusCode).toEqual(400);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
    });

    it('should return 400 if payload has error type', async () => {
      const payload = {
        title : 12,
        body : 'body',
      };

      const response = await server.inject({
        method : 'POST',
        url : '/threads',
        headers : {
          'Authorization' : `Bearer ${ accessToken}`
        },
        payload
      });

      expect(response.statusCode).toEqual(400);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
    });

    it('should return 201 if work correctly', async () => {

      const payload = {
        title : 'title',
        body : 'body',
      };
              
      const response = await server.inject({
        method : 'POST',
        url : '/threads',
        headers : {
          'Authorization' : `Bearer ${ accessToken}`
        },
        payload
      });
        
      expect(response.statusCode).toEqual(201);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread.title).toBe(payload.title);
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
        
    });
  });

});