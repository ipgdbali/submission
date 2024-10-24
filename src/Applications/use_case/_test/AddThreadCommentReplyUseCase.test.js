const AddThreadCommentReplyUseCase = require("../AddThreadCommentReplyUseCase");
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('AddThreadCommentReplyUseCase', () => {
    const mockRepoThread = new ThreadRepository();
    const mockNanoId = jest.fn( (len) => '1234' );

    it('should throw Error when Thread is not found',async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve(null));
        const usecase = new AddThreadCommentReplyUseCase(mockRepoThread,mockNanoId);

        await expect(() => usecase.execute() ).rejects.toThrowError('Thread tidak ada')
        
    });

    it('should throw Error when Comment is not found',async () => {

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve('something'))
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve(null) );

        const usecase = new AddThreadCommentReplyUseCase(mockRepoThread,mockNanoId);
        await expect( () => usecase.execute() ).rejects.toThrowError('Comment tidak ada');

    })

    
    it('should return correct value',async () => {
        
        const thread_payload = {
            id: 'threadId',
            dt: Date.now(),
            bodyreq:{
              title: 'thread-title',
              body:'thread-body'
            },
            user:{
              id:'userid',
              username: 'username'
            }
        };
    
        const commentId = 'commentId';

        const payload = {
            content:'reply'
        };

        const credential = {
            id:'userid',
            username:'username'
        }

        mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve((threadId === thread_payload.id)?thread_payload:null) )
        mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve('something') );
        mockRepoThread.addReply = jest.fn ( (dom) => Promise.resolve())

        const usecase = new AddThreadCommentReplyUseCase(mockRepoThread,mockNanoId);
        const ret = await usecase.execute(thread_payload.id,commentId,payload,credential);

        expect(mockRepoThread.getThreadById).toBeCalledTimes(1)
        expect(mockRepoThread.getThreadById).toBeCalledWith(thread_payload.id)

        expect(mockRepoThread.getCommentById).toBeCalledTimes(1)
        expect(mockRepoThread.getCommentById).toBeCalledWith(commentId)

        expect(mockRepoThread.addReply).toBeCalledTimes(1)
        expect(mockRepoThread.addReply.mock.calls[0][0].id).toBe('reply-1234');
        expect(mockRepoThread.addReply.mock.calls[0][0].dt).toBeLessThanOrEqual(Date.now());
        expect(mockRepoThread.addReply.mock.calls[0][0].dt).toBeGreaterThan(Date.now() - 2000);
        expect(mockRepoThread.addReply.mock.calls[0][0].commentId).toBe(commentId)
        expect(mockRepoThread.addReply.mock.calls[0][0].content).toBe(payload.content)
        expect(mockRepoThread.addReply.mock.calls[0][0].owner).toBe(credential.id)
        expect(mockRepoThread.addReply.mock.calls[0][0].username).toBe(credential.username)        

        expect(ret.id).toBe('reply-1234')
        expect(ret.dt).toBeLessThanOrEqual(Date.now());
        expect(ret.dt).toBeGreaterThan(Date.now() - 2000);
        expect(ret.commentId).toBe(commentId)
        expect(ret.content).toBe(payload.content)
        expect(ret.owner).toBe(credential.id)
        expect(ret.username).toBe(credential.username)

    })

})