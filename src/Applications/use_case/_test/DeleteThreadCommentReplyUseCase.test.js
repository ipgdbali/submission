const DeleteThreadCommentReplyUseCase = require("../DeleteThreadCommentReplyUseCase");
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('DeleteThreadCommentReplyUseCase', () => {

    
    let mockRepoThread;

    beforeEach( () => {
        mockRepoThread = new ThreadRepository();
    })

    it('should throw Error when Thread is not found',async () => {

        // Arrange
        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve(null));

        // Action
        const usecase = new DeleteThreadCommentReplyUseCase(mockRepoThread);

        //Assert
        await expect(() => usecase.execute({},{},{},{}) ).rejects.toThrowError('THREAD_NOT_FOUND')
        
    });

    it('should throw Error when Comment is not found',async () => {

        // Arrange
        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something'))
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve(null) );
        
        // Action
        const usecase = new DeleteThreadCommentReplyUseCase(mockRepoThread);

        // Assert
        await expect( () => usecase.execute({},{},{},{}) ).rejects.toThrowError('COMMENT_NOT_FOUND');

    })

    it('should throw Error when Reply is not found',async () => {

        // Arrange
        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something'))
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve('something') );
        mockRepoThread.getReplyById = jest.fn( (commentId) => Promise.resolve() );

        // Action
        const usecase = new DeleteThreadCommentReplyUseCase(mockRepoThread);

        // Assert
        await expect( () => usecase.execute({},{},{},{}) ).rejects.toThrowError('REPLY_NOT_FOUND');

    })

    it('should throw Error when Reply is not made by deleter',async () => {

        // Arrange
        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something'))
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve('something') );

        const reply_ret = {
            owner: 'userid'
        }

        mockRepoThread.getReplyById = jest.fn( (commentId) => Promise.resolve(reply_ret) );

        const usecase = new DeleteThreadCommentReplyUseCase(mockRepoThread);
        await expect( () => usecase.execute({},{},{},{}) ).rejects.toThrowError('NOT_YOUR_REPLY');

    })

    it('should run correctly',async () => {

        // Arrange
        const threadId = 'threadId';
        const commentId = 'commentId';
        const replyId = 'replyId'

        const credential = {
            id : 'userid'
        }
        const reply_ret = {
            owner: credential.id
        }

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something') );
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve('something') );
        mockRepoThread.getReplyById = jest.fn( (commentId) => Promise.resolve(reply_ret) );
        mockRepoThread.delReplyById = jest.fn ( (dom,credential) => Promise.resolve(1) );

        // Action 
        const usecase = new DeleteThreadCommentReplyUseCase(mockRepoThread);
        await usecase.execute(threadId,commentId,replyId,credential)

        // Assert
        expect(mockRepoThread.getThreadById).toBeCalledTimes(1);
        expect(mockRepoThread.getThreadById).toBeCalledWith(threadId)
        
        expect(mockRepoThread.getCommentById).toBeCalledTimes(1);
        expect(mockRepoThread.getCommentById).toBeCalledWith(commentId)

        expect(mockRepoThread.getReplyById).toBeCalledTimes(1);
        expect(mockRepoThread.getReplyById).toBeCalledWith(replyId);

        expect(mockRepoThread.delReplyById).toBeCalledTimes(1);

    })

})