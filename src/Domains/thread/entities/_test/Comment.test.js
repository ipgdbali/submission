const Comment = require('../Comment');

describe('An Comment Entity', () => {
  it('should throw error when payload did not contain needed property', () => {

    // Arrange
    let payload = {
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    payload = 0;

    payload = {
      id : 'MyId',
      dt : Date.now(),
      threadId : 'MyThreadId',
      bodyreq : {
      },
      user : {
        id : 'userid',
        username : 'username'
      },
      is_delete : false
    };
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

  });


  it('should throw error when payload did not meet data type specification', () => {

    // Arrange
    let payload = {
      id : 'MyId',
      dt : '123',
      threadId : 'MyThreadId',
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
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');

    payload = {
      id : 'MyId',
      dt : Date.now(),
      threadId : 'MyThreadId',
      bodyreq : {
        content : 'My Content'
      },
      user : {
        id : 12,
        username : 'username'
      },
      is_delete : false
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');

  });

  it('should create Comment object correctly', () => {

    // Arrange
    const payload = {
      id : 'MyId',
      dt : Date.now(),
      threadId : 'MyThreadId',
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
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.dt).toEqual(payload.dt);
    expect(comment.threadId).toEqual(payload.threadId);
    expect(comment.content).toEqual(payload.bodyreq.content);
    expect(comment.owner).toEqual(payload.user.id);
    expect(comment.username).toEqual(payload.user.username);
    expect(comment.is_delete).toEqual(payload.is_delete);

  });

});
