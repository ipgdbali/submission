const LikeUnlike = require('../LikeUnlike');

describe('A LikeUnlike Entity', () => {

  it('should throw error when payload did not containt property', () => {

    const payload = {
    };

    expect(() => new LikeUnlike(payload)).toThrow('LIKE_UNLIKE.NOT_CONTAIN_NEEDED_PROPERTY');

  });

  it('should throw error payload did not meet data type specification', () => {

    const payload = {
      commentId : 1234,
      user : {
        id : 'userId',
        username : 'userName'
      }
    };

    expect(() => new LikeUnlike(payload)).toThrow('LIKE_UNLIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');

  });

  it('should work correctly', () => {

    const payload = {
      commentId : 'commentId',
      user : {
        id : 'userId',
        username : 'userName'
      }
    };

    const likeUnlike = new LikeUnlike(payload);

    expect(likeUnlike.commentId).toBeDefined();
    expect(likeUnlike.commentId).toBe(payload.commentId);

    expect(likeUnlike.owner).toBeDefined();
    expect(likeUnlike.owner).toBe(payload.user.id);

    expect(likeUnlike.username).toBeDefined();
    expect(likeUnlike.username).toBe(payload.user.username);

  });

});