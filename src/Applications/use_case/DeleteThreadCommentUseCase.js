const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

/**
 *
 */
class DeleteThreadCommentUseCase {

    constructor(repoThread) {
        this._repoThread = repoThread;
    }

    async execute(threadId,commentId,credential) {

        const thread = await this._repoThread.getThreadById(threadId);
        if(thread == null)
            {throw new NotFoundError('Thread tidak ditemukan');}

        const comment = await this._repoThread.getCommentById(commentId);

        if(comment == null)
            {throw new NotFoundError('Komentar tidak ditemukan');}
        
        if(comment.owner != credential.id){
            throw new AuthorizationError('Bukan commentar anda')
        }

        return await this._repoThread.delCommentById(commentId);
    }

}

module.exports = DeleteThreadCommentUseCase;