class DeleteThreadCommentUseCase {

  constructor(repoThread) {
    this._repoThread = repoThread;
  }

  async execute(threadId, commentId, credential) {

    const thread = await this._repoThread.getThreadById(threadId);
    if(thread == null) {
      throw new Error('THREAD_NOT_FOUND');
    }

    const comment = await this._repoThread.getCommentById(commentId);

    if(comment == null) {
      throw new Error('COMMENT_NOT_FOUND');
    }
        
    if(comment.owner != credential.id) {
      throw new Error('NOT_YOUR_COMMENT');
    }

    return await this._repoThread.delCommentById(commentId);
  }

}

module.exports = DeleteThreadCommentUseCase;