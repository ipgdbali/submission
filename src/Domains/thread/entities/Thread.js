/**
 *
 */
class Thread {

  constructor(payload) {
    this._verifyPayload(payload);
    this.id = payload.id;
    this.dt = payload.dt;
    this.title = payload.bodyreq.title;
    this.body = payload.bodyreq.body;
    this.owner = payload.user.id;
    this.username = payload.user.username;
  }

  _verifyPayload({id, dt, bodyreq, user}) {
        
        
    if(!id || !dt || !bodyreq || !user) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
        
    if(typeof id !== 'string' || typeof dt !== 'number' || typeof bodyreq !== 'object' || typeof user !== 'object') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
        
    if(!bodyreq.title || !bodyreq.body || !user.id || !user.username) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
        
    if(typeof bodyreq.title !== 'string' || typeof bodyreq.body !== 'string' || typeof user.id !== 'string' || typeof user.username !== 'string') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

  }


}

module.exports = Thread;