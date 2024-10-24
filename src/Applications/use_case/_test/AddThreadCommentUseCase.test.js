const AddThreadCommentUseCase = require("../AddThreadCommentUseCase");
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('AddThreadCommentUseCase', () => {

    const mockRepoThread = new ThreadRepository();
    const mockNanoId = jest.fn( (len) => '1234' );

    it('should throw error if no thread is found' ,async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve(null));

        const usecase = new AddThreadCommentUseCase(mockRepoThread,mockNanoId);

        await expect(() => usecase.execute({},{},{})).rejects.toThrow('Thread tidak ada')

    })

    it('should return correct value', async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something'));
        mockRepoThread.addComment = jest.fn( (domComment) => Promise.resolve(null))

        const usecase = new AddThreadCommentUseCase(mockRepoThread,mockNanoId);

        const threadId = 'thread-1234'
        const payload = {
            content : 'content'
        };

        const credential = {
            id : 'userid',
            username : 'username'
        };

        const ret = await usecase.execute(threadId,payload,credential);

        expect(mockRepoThread.getThreadById).toBeCalledTimes(1);
        expect(mockRepoThread.getThreadById).toBeCalledWith(threadId);
        
        expect(mockNanoId).toBeCalledTimes(1);

        expect(mockRepoThread.addComment).toBeCalledTimes(1);
        expect(mockRepoThread.addComment.mock.calls[0][0].id).toBe('comment-1234');
        expect(mockRepoThread.addComment.mock.calls[0][0].dt).toBeLessThanOrEqual(Date.now());
        expect(mockRepoThread.addComment.mock.calls[0][0].dt).toBeGreaterThan(Date.now() - 2000);
        expect(mockRepoThread.addComment.mock.calls[0][0].threadId).toBe(threadId)
        expect(mockRepoThread.addComment.mock.calls[0][0].content).toBe(payload.content)
        expect(mockRepoThread.addComment.mock.calls[0][0].owner).toBe(credential.id)
        expect(mockRepoThread.addComment.mock.calls[0][0].username).toBe(credential.username)        
        
        expect(ret.id).toBe('comment-1234');
        expect(ret.threadId).toBe(threadId);
        expect(ret.content).toBe(payload.content);
        expect(ret.owner).toBe(credential.id);
        expect(ret.username).toBe(credential.username);
        expect(ret.is_delete).toBe(false);

    })

})