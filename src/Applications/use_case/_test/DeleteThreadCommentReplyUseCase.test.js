const DeleteThreadCommentReplyUseCase = require("../DeleteThreadCommentReplyUseCase");
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('DeleteThreadCommentReplyUseCase', () => {

    
    let mockRepoThread;

    beforeEach( () => {
        mockRepoThread = new ThreadRepository();
    })

    it('should throw Error when Thread is not found',async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve(null));
        const usecase = new DeleteThreadCommentReplyUseCase(mockRepoThread);

        await expect(() => usecase.execute({},{},{},{}) ).rejects.toThrowError('Thread tidak ditemukan')
        
    });

    it('should throw Error when Comment is not found',async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something'))
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve(null) );

        const usecase = new DeleteThreadCommentReplyUseCase(mockRepoThread);
        await expect( () => usecase.execute({},{},{},{}) ).rejects.toThrowError('Komentar tidak ditemukan');

    })

    it('should throw Error when Reply is not found',async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something'))
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve('something') );
        mockRepoThread.getReplyById = jest.fn( (commentId) => Promise.resolve() );
        const usecase = new DeleteThreadCommentReplyUseCase(mockRepoThread);
        await expect( () => usecase.execute({},{},{},{}) ).rejects.toThrowError('Balasan tidak ditemukan');

    })

    it('should throw Error when Comment is not made by deleter',async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something'))
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve('something') );

        const reply_ret = {
            owner: 'userid'
        }
        mockRepoThread.getReplyById = jest.fn( (commentId) => Promise.resolve(reply_ret) );

        const usecase = new DeleteThreadCommentReplyUseCase(mockRepoThread);
        await expect( () => usecase.execute({},{},{},{}) ).rejects.toThrowError('Bukan commentar anda');

    })

    it('should run correctly',async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something') );
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve('something') );

        const threadId = 'threadId';
        const commentId = 'commentId';
        const replyId = 'replyId'

        const credential = {
            id : 'userid'
        }
        const reply_ret = {
            owner: credential.id
        }
        mockRepoThread.getReplyById = jest.fn( (commentId) => Promise.resolve(reply_ret) );
        mockRepoThread.delReplyById = jest.fn ( (dom,credential) => Promise.resolve(1) );

        const usecase = new DeleteThreadCommentReplyUseCase(mockRepoThread);

        await usecase.execute(threadId,commentId,replyId,credential)

        expect(mockRepoThread.getThreadById).toBeCalledTimes(1);
        expect(mockRepoThread.getThreadById).toBeCalledWith(threadId)
        
        expect(mockRepoThread.getCommentById).toBeCalledTimes(1);
        expect(mockRepoThread.getCommentById).toBeCalledWith(commentId)

        expect(mockRepoThread.getReplyById).toBeCalledTimes(1);
        expect(mockRepoThread.getReplyById).toBeCalledWith(replyId);

        expect(mockRepoThread.delReplyById).toBeCalledTimes(1);

    })

})