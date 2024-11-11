/**
 *
 */
class Comment {

  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.dt = payload.dt;
    this.threadId = payload.threadId;
    this.content = payload.bodyreq.content;
    this.owner = payload.user.id;
    this.username = payload.user.username;
    this.is_delete = payload.is_delete;
        
  }

  _verifyPayload({id, dt, threadId, bodyreq, user, is_delete}) {

    if(!id || !dt || !threadId || !bodyreq || !user || (is_delete === undefined)) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof id !== 'string' || typeof dt !== 'number' || typeof bodyreq !== 'object' || typeof user !== 'object' || typeof is_delete !== 'boolean') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
        
    if(!bodyreq.content || !user.id || !user.username ) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof bodyreq.content !== 'string' || typeof user.id !== 'string' || typeof user.username !== 'string') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

}

module.exports = Comment;