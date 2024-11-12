class LikeUnlike {

  constructor(payload) {

    this._verifyPayload(payload);

    this.commentId = payload.commentId;
    this.owner = payload.user.id;
    this.username = payload.user.username;

  }

  _verifyPayload({commentId, user}) {

    if(!commentId || !user) {
      throw new Error('LIKE_UNLIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof commentId !== 'string' || typeof user !== 'object') {
      throw new Error('LIKE_UNLIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if(!user.id || !user.username) {
      throw new Error('LIKE_UNLIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof user.id !== 'string' || typeof user.username !== 'string') {
      throw new Error('LIKE_UNLIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

  }

};

module.exports = LikeUnlike;