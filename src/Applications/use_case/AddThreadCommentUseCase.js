const Comment = require("../../Domains/thread/entities/Comment");

class AddThreadCommentUseCase 
{

    constructor (repoThread,nanoid) {
        this._repoThread = repoThread
        this._nanoid = nanoid;
    }

    async execute(threadId,payload,credential) {

        if(! await this._repoThread.getThreadById(threadId)) {
            throw new Error('THREAD_NOT_FOUND');
        }
            
        const domComment = new Comment({
            id:`comment-${  this._nanoid(20)}`,
            dt:Date.now(),
            threadId,
            bodyreq : payload,
            user : credential,
            is_delete : false
        });

        await this._repoThread.addComment(domComment);
        return {
            addedComment : {
                id:domComment.id,
                content:domComment.content,
                owner:domComment.owner
            }
        };

    }
}

module.exports = AddThreadCommentUseCase;