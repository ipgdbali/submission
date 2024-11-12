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

    });

    it('should like if never liked before - user 1', async () => {

    });

    it('should show like count correctly 1', async () => {

    });

    it('should like if never liked before - user 2 ', async () => {

    });

    it('should show like count correctly 2', async () => {
      
    });

    it('should unlike if liked before - user 1', async() => {

    });

    it('should show like count correctly 3', async () => {
      
    });

    it('should unlike if liked before - user 2', async() => {

    });

    it('should show like count correctly 4', async () => {
      
    });

  });

});