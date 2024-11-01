const AddThreadCommentReplyUseCase = require("../AddThreadCommentReplyUseCase");
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('AddThreadCommentReplyUseCase', () => {
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

    const reply = {
        id : 'reply-' + id,
        dt : 1234,
        commentId : comment.id,
        bodyreq : {
            content : 'comment'
        },
        user:thread.user,
        is_delete : false
    }

    it('should throw Error when Thread is not found', () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve(null) );
        const usecase = new AddThreadCommentReplyUseCase(mockRepoThread,mockNanoId);
        
        expect( () => usecase.execute(thread.id,reply.commentId,reply.bodyreq,reply.user) ).rejects.toThrowError('THREAD_NOT_FOUND')
        expect(mockRepoThread.getThreadById).toBeCalledTimes(1);
        expect(mockRepoThread.getThreadById).toBeCalledWith(thread.id);
    });

    it('should throw Error when Comment is not found', async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve(thread) );
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve(null) );

        const usecase = new AddThreadCommentReplyUseCase(mockRepoThread,mockNanoId);
        expect(() => usecase.execute(thread.id,reply.commentId,reply.bodyreq,reply.user) ).rejects.toThrow('COMMENT_NOT_FOUND');
        expect(await mockRepoThread.getCommentById).toBeCalledTimes(1);
        expect(await mockRepoThread.getCommentById).toBeCalledWith(comment.id);

    })

    it('should return correct value',async () => {
        
        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve(thread) )
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve(comment) );
        mockRepoThread.addReply = jest.fn ( (dom) => Promise.resolve() )

        const usecase = new AddThreadCommentReplyUseCase(mockRepoThread,mockNanoId);
        const ret = await usecase.execute(thread.id,reply.commentId,reply.bodyreq,reply.user);

        expect(mockNanoId).toBeCalledTimes(1);

        expect(mockRepoThread.addReply).toBeCalledTimes(1)
        expect(mockRepoThread.addReply.mock.calls[0][0].id).toBe(reply.id);
        expect(mockRepoThread.addReply.mock.calls[0][0].dt).toBeLessThanOrEqual(Date.now());
        expect(mockRepoThread.addReply.mock.calls[0][0].dt).toBeGreaterThan(Date.now() - 2000);
        expect(mockRepoThread.addReply.mock.calls[0][0].commentId).toBe(reply.commentId)
        expect(mockRepoThread.addReply.mock.calls[0][0].content).toBe(reply.bodyreq.content)
        expect(mockRepoThread.addReply.mock.calls[0][0].owner).toBe(reply.user.id)
        expect(mockRepoThread.addReply.mock.calls[0][0].username).toBe(reply.user.username)

        expect(ret.addedReply.id).toBe(reply.id)
        expect(ret.addedReply.content).toBe(reply.bodyreq.content)
        expect(ret.addedReply.owner).toBe(reply.user.id)

    })

})