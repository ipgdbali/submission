const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError")

/**
 *
 */
class DeleteThreadCommentReplyUseCase
{
    constructor(repoThread) {
        this._repoThread = repoThread;
    }

    async execute(threadId,commentId,replyId,credential) {

        if(! (await this._repoThread.getThreadById(threadId)) )
            {throw new NotFoundError('Thread tidak ditemukan');}
        
        if(! (await this._repoThread.getCommentById(commentId)) )
            {throw new NotFoundError('Komentar tidak ditemukan');}

        const reply = await this._repoThread.getReplyById(replyId);
        if(reply == null)
            {throw new NotFoundError('Balasan tidak ditemukan');}
        
        if(reply.owner != credential.id){
            throw new AuthorizationError('Bukan commentar anda')
        }

        return await this._repoThread.delReplyById(replyId,credential);
    }

};


module.exports = DeleteThreadCommentReplyUseCase;