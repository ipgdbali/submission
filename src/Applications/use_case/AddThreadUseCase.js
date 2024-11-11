const Thread = require('../../Domains/thread/entities/Thread');

/**
 *
 */
class AddThreadUseCase {

  constructor (repoThread, nanoId) {
    this._repoThread = repoThread;
    this._nanoId = nanoId;
  }

  async execute(payload, credential) {
        
    const domThread = new Thread({
      id : `thread-${ this._nanoId(20)}`,
      dt : Date.now(),
      bodyreq : payload,
      user : credential
    });
        
    await this._repoThread.addThread(domThread);

    return {
      addedThread : {
        id : domThread.id,
        title : domThread.title,
        owner : domThread.owner
      }
    };

  }

}

module.exports = AddThreadUseCase;