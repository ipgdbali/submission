const Reply = require('../Reply');

describe('An Reply Entity', () => {
    
  it('should throw error when payload did not contain needed property', () => {

    // Arrange
    let payload = {
    };

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');

    payload = {
      id : 'id',
      dt : Date.now(),
      commentId : 'commentId',
      bodyreq : {
      },
      user : {
        id : 'userid',
        username : 'username'
      },
      is_delete : false
    };
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');

  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    let payload = {
      id : 'id',
      dt : '123',
      commentId : 'commentId',
      bodyreq : {
        content : 'My Content'
      },
      user : {
        id : 'userid',
        username : 'username'
      },
      is_delete : false
    };

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');

    payload = {
      id : 'id',
      dt : Date.now(),
      commentId : 'commentId',
      bodyreq : {
        content : 'My Content'
      },
      user : {
        id : 123,
        username : 'username'
      },
      is_delete : false
    };

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');

  });

  it('should create Reply object correctly', () => {
    // Arrange
    const payload = {
      id : 'id',
      dt : Date.now(),
      commentId : 'commentId',
      bodyreq : {
        content : 'My Content'
      },
      user : {
        id : 'userid',
        username : 'username'
      },
      is_delete : false
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.dt).toEqual(payload.dt);
    expect(reply.commentId).toEqual(payload.commentId);
    expect(reply.content).toEqual(payload.bodyreq.content);
    expect(reply.owner).toEqual(payload.user.id);
    expect(reply.username).toEqual(payload.user.username);
    expect(reply.is_delete).toEqual(payload.is_delete);

  });

});
