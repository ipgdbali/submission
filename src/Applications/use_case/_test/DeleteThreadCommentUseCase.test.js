const DeleteThreadCommentUseCase = require("../DeleteThreadCommentUseCase");
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('DeleteThreadCommentUseCase', () => {
    const mockRepoThread = new ThreadRepository();

    it('should throw Error when Thread is not found',async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve(null));
        const usecase = new DeleteThreadCommentUseCase(mockRepoThread);

        await expect(() => usecase.execute({},{},{}) ).rejects.toThrowError('Thread tidak ditemukan')
        
    });

    it('should throw Error when Comment is not found',async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something'))
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve(null) );

        const usecase = new DeleteThreadCommentUseCase(mockRepoThread);
        await expect( () => usecase.execute({},{},{}) ).rejects.toThrowError('Komentar tidak ditemukan');

    })

    it('should throw Error when Comment is not made by deleter',async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something'))
        const comment_ret = {
            owner: 'userid'
        }
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve(comment_ret) );

        const usecase = new DeleteThreadCommentUseCase(mockRepoThread);
        await expect( () => usecase.execute({},{},{}) ).rejects.toThrowError('Bukan commentar anda');

    })

    it('should return correct value',async () => {
        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something'))
        const comment_ret = {
            owner: 'userid'
        }
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve(comment_ret) );
        mockRepoThread.delCommentById = jest.fn( (commentId) => {})

        const usecase = new DeleteThreadCommentUseCase(mockRepoThread);
        const threadId = 'threadId';
        const commentId = 'commentId'
        const credential = {
            id : 'userid',
            username : 'username'
        }

        await usecase.execute(threadId,commentId,credential);

        expect(mockRepoThread.getThreadById).toBeCalledTimes(1);
        expect(mockRepoThread.getThreadById).toBeCalledWith(threadId);
        expect(mockRepoThread.getCommentById).toBeCalledTimes(1);
        expect(mockRepoThread.getCommentById).toBeCalledWith(commentId);
        expect(mockRepoThread.delCommentById).toBeCalledTimes(1);
        expect(mockRepoThread.delCommentById).toBeCalledWith(commentId);
    })

})