const AddThreadCommentUseCase = require("../AddThreadCommentUseCase");
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('AddThreadCommentUseCase', () => {

    const id = '1234'
    const mockRepoThread = new ThreadRepository();
    const mockNanoId = jest.fn( (len) => id );

    const thread = {
        id : 'thread-' + id,
        dt : 1234,
        bodyreq:{
            title: 'my thread title',
            body: 'my thread body'
        },
        user:{
            id:'userid',
            username:'username'
        }
    }

    const comment = {
        id : 'comment-' + id,
        dt : 1234,
        threadId : thread.id,
        bodyreq : {
            content : 'comment'
        },
        user:thread.user,
        is_delete : false
    }

    it('should throw error if no thread is found' ,async () => {
        // Arrange
        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve(null));

        // Action
        const usecase = new AddThreadCommentUseCase(mockRepoThread,mockNanoId);

        // Assert
        await expect( () => usecase.execute(comment.threadId,comment.bodyreq,comment.user) ).rejects.toThrow('THREAD_NOT_FOUND')
        
        expect(mockRepoThread.getThreadById).toBeCalledTimes(1);
        expect(mockRepoThread.getThreadById).toBeCalledWith(comment.threadId);
        
    })

    it('should return correct value', async () => {
        // Arrange
        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve(thread));
        mockRepoThread.addComment = jest.fn( (domComment) => Promise.resolve())
        
        // Action
        const usecase = new AddThreadCommentUseCase(mockRepoThread,mockNanoId);
        const ret = await usecase.execute(comment.threadId,comment.bodyreq,comment.user);

        // Assert
        expect(mockRepoThread.addComment).toBeCalledTimes(1);
        expect(mockRepoThread.addComment.mock.calls[0][0].id).toBe(comment.id);
        expect(mockRepoThread.addComment.mock.calls[0][0].dt).toBeLessThanOrEqual(Date.now());
        expect(mockRepoThread.addComment.mock.calls[0][0].dt).toBeGreaterThan(Date.now() - 2000);
        expect(mockRepoThread.addComment.mock.calls[0][0].threadId).toBe(comment.threadId)
        expect(mockRepoThread.addComment.mock.calls[0][0].content).toBe(comment.bodyreq.content)
        expect(mockRepoThread.addComment.mock.calls[0][0].owner).toBe(comment.user.id)
        expect(mockRepoThread.addComment.mock.calls[0][0].username).toBe(comment.user.username)
        
        expect(ret.addedComment.id).toBe(comment.id);
        expect(ret.addedComment.content).toBe(comment.bodyreq.content);
        expect(ret.addedComment.owner).toBe(comment.user.id);

    })

})