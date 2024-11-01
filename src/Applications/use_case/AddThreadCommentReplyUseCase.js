const Reply = require("../../Domains/thread/entities/Reply")

/**
 *
 */
class AddThreadCommentReplyUseCase
{
    constructor(repoThread,nanoid) {
        this._repoThread = repoThread;
        this._nanoid = nanoid;
    }

    async execute(threadId,commentId,payload,credential) {
        
        if(!await this._repoThread.getThreadById(threadId)) {
            throw new Error('THREAD_NOT_FOUND');
        }

        if(!await this._repoThread.getCommentById(commentId)){
            throw new Error('COMMENT_NOT_FOUND');
        }
        
        const domReply = new Reply({
            id:`reply-${  this._nanoid(20)}`,
            dt: Date.now(),
            commentId,
            bodyreq:payload,
            user:credential,
            is_delete:false
        })
        
        await this._repoThread.addReply(domReply);

        return {
            addedReply : {
                id: domReply.id,
                content:domReply.content,
                owner:domReply.owner
            }
        };

    }

};

module.exports = AddThreadCommentReplyUseCase;