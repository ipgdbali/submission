const Thread = require('../Thread');

describe('An Thread Entity', () => {
  it('should throw error when payload did not contain needed property', () => {

    // Arrange
    let payload = {
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

    payload = {
      id: 'threadid',
      dt: Date.now(),
      bodyreq:{
        body:'thread-body'
      },
      user:{
        id:'userid',
        username: 'username'
      }      
    };
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

  });

  it('should throw error when payload did not meet data type specification', () => {

    let payload = {
      id: 'threadid',
      dt: '12323123',
      bodyreq:{
        title: 'thread-title',
        body:'thread-body'
      },
      user:{
        id:'userid',
        username: 'username'
      }
    };
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');

    payload = {
      id: 'threadid',
      dt: Date.now(),
      bodyreq:{
        title: 'thread-title',
        body: 12
      },
      user:{
        id:'userid',
        username: 'username'
      }
    };
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'threadid',
      dt: Date.now(),
      bodyreq:{
        title: 'thread-title',
        body:'thread-body'
      },
      user:{
        id:'userid',
        username: 'username'
      }
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(thread.id).toEqual(payload.id);
    expect(thread.dt).toEqual(payload.dt);
    expect(thread.title).toEqual(payload.bodyreq.title);
    expect(thread.body).toEqual(payload.bodyreq.body);
    expect(thread.owner).toEqual(payload.user.id);
    expect(thread.username).toEqual(payload.user.username);
  });

});
