class GetThreadDetailUseCase {

  constructor(repoThread) {
    this._repoThread = repoThread;
  }

  async execute(threadId) {
        
    const thread = await this._repoThread.getThreadById(threadId);

    if(thread == null) {
      throw new Error('NOT_FOUND_ERROR');
    }
        
    const comments = (await this._repoThread.getCommentsByThreadId(threadId)).map( (x) => ({
      id : x.id,
      username : x.username,
      date : new Date(x.dt).toISOString(),
      content : (x.is_delete)? '**komentar telah dihapus**':x.content
    }));
        
        
    for(const comment of comments) {

      comment.likeCount = await this._repoThread.getLikeCountByCommentId(comment.id);
      const replies = await this._repoThread.getRepliesByCommentId(comment.id);
      comment.replies = replies.map( (x) => ({
        id : x.id,
        content : (x.is_delete)?'**balasan telah dihapus**':x.content,
        date : new Date(x.dt).toISOString(),
        username : x.username
      }));
      
    }
            
        
    return {
      thread : {
        id : thread.id,
        title : thread.title,
        body : thread.body,
        date : new Date(thread.dt).toISOString(),
        username : thread.username,
        comments
      }
    };
  }
}

module.exports = GetThreadDetailUseCase;