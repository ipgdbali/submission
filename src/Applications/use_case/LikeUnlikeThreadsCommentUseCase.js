const LikeUnlike = require('../../Domains/thread/entities/LikeUnlike');

class LikeUnlikeThreadCommentUseCase {
  constructor(repoThread) {
    this._repoThread = repoThread;
  }

  async execute(threadId, commentId, credential) {

    if(!await this._repoThread.getThreadById(threadId)) {
      throw new Error('THREAD_NOT_FOUND');
    }

    if(!await this._repoThread.getCommentById(commentId)) {
      throw new Error('COMMENT_NOT_FOUND');
    }

    const domLikeUnlike = new LikeUnlike({
      threadId,
      commentId,
      user : credential
    });

    if(!(await this._repoThread.isExistLikeUnlike(domLikeUnlike))) {
      await this._repoThread.addLikeUnlike(domLikeUnlike);
    } else {
      await this._repoThread.rmLikeUnlike(domLikeUnlike);
    }

  }
}

module.exports = LikeUnlikeThreadCommentUseCase;