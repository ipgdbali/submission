class DeleteThreadCommentReplyUseCase
{
    constructor(repoThread) {
        this._repoThread = repoThread;
    }

    async execute(threadId,commentId,replyId,credential) {

        if(! (await this._repoThread.getThreadById(threadId)) )
            {throw new Error('THREAD_NOT_FOUND');}
        
        if(! (await this._repoThread.getCommentById(commentId)) )
            {throw new Error('COMMENT_NOT_FOUND');}

        const reply = await this._repoThread.getReplyById(replyId);
        if(reply == null)
            {throw new Error('REPLY_NOT_FOUND');}
        
        if(reply.owner != credential.id)
            {throw new Error('NOT_YOUR_REPLY');}

        return await this._repoThread.delReplyById(replyId,credential);
    }

};

module.exports = DeleteThreadCommentReplyUseCase;