const Reply = require("../../Domains/thread/entities/Reply")
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

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
            throw new NotFoundError('Thread tidak ada')
        }

        if(!await this._repoThread.getCommentById(commentId)){
            throw new NotFoundError('Comment tidak ada')
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
        return domReply;

    }

};

module.exports = AddThreadCommentReplyUseCase;