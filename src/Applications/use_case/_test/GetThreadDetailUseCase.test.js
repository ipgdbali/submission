const GetThreadDetailUseCase = require('../GetThreadDetailUseCase')
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const Thread = require('../../../Domains/thread/entities/Thread');
const Comment = require('../../../Domains/thread/entities/Comment');
const Reply = require('../../../Domains/thread/entities/Reply');

describe('GetThreadDetailUseCase',() => {
  
  const mockRepoThread = new ThreadRepository();

    it('should throw NotFoundError if ThreadId is not found',async () =>{


        mockRepoThread.getThreadById = jest.fn((id) => Promise.resolve(null));

        const usecase = new GetThreadDetailUseCase(mockRepoThread);
        await expect(() => usecase.execute({})).rejects.toThrow(new Error('NOT_FOUND_ERROR'));

    })

    it('should return correct payload', async () => {

        const threadId = 'threadId';
        const thread = new Thread({
            id: threadId,
            dt: Date.now(),
            bodyreq:{
              title: 'title',
              body:'body'
            },
            user:{
              id:'userid-thread',
              username: 'username-thread'
            }
        });

        const comments = [
            new Comment({
                id:'commentId_1',
                dt:Date.now(),
                threadId:thread.id,
                bodyreq:{
                  content:'comment 1'
                },
                user:{
                  id: 'userid-comment_1',
                  username: 'username-comment_1'
                },
                is_delete:false
        
            }),
            new Comment({
                id:'commentId_2',
                dt:Date.now(),
                threadId:thread.id,
                bodyreq:{
                  content:'comment 2'
                },
                user:{
                  id: 'userid-comment_2',
                  username: 'username-comment_2'
                },
                is_delete:true
            })
        ];
        const replies = [
            new Reply({
                id: 'replyId_1',
                dt: Date.now(),
                commentId: comments[0].id,
                bodyreq:{
                  content: 'Reply 1'
                },
                user:{
                  id: 'userid-reply1',
                  username: 'username-reply1'
                },
                is_delete : false            
            }),
            new Reply({
                id: 'replyId_2',
                dt: Date.now(),
                commentId: comments[0].id,
                bodyreq:{
                  content: 'Reply 2'
                },
                user:{
                  id: 'userid-reply2',
                  username: 'username-reply2'
                },
                is_delete : true
            }),
        ]

        mockRepoThread.getThreadById = jest.fn( (id) => Promise.resolve( (id === threadId)?thread:null))
        mockRepoThread.getCommentsByThreadId = jest.fn( (id) => Promise.resolve( (id === threadId)? comments : [] ))
        mockRepoThread.getRepliesByCommentId = jest.fn( (id) => Promise.resolve( (id === comments[0].id)?replies: [] ));

        const usecase = new GetThreadDetailUseCase(mockRepoThread);

        const ret = await usecase.execute(threadId);

        expect(mockRepoThread.getThreadById).toBeCalledTimes(1)
        expect(mockRepoThread.getThreadById).toBeCalledWith(threadId)

        expect(mockRepoThread.getCommentsByThreadId).toBeCalledTimes(1)
        expect(mockRepoThread.getCommentsByThreadId).toBeCalledWith(threadId)

        expect(mockRepoThread.getRepliesByCommentId).toBeCalledTimes(2)
        expect(mockRepoThread.getRepliesByCommentId).toBeCalledWith(comments[0].id)

        expect(ret.thread.id).toBe(thread.id)
        expect(ret.thread.title).toBe(thread.title)
        expect(ret.thread.body).toBe(thread.body)
        expect(ret.thread.date).toBe(new Date(thread.dt).toISOString())
        expect(ret.thread.username).toBe(thread.username)

        expect(ret.thread.comments).toHaveLength(2)
        expect(ret.thread.comments[0].id).toBe(comments[0].id)
        expect(ret.thread.comments[0].username).toBe(comments[0].username)
        expect(ret.thread.comments[0].date).toBe(new Date(comments[0].dt).toISOString())
        expect(ret.thread.comments[0].content).toBe(comments[0].content)

        expect(ret.thread.comments[0].replies).toHaveLength(2)
        expect(ret.thread.comments[0].replies[0].id).toBe(replies[0].id)
        expect(ret.thread.comments[0].replies[0].content).toBe(replies[0].content)
        expect(ret.thread.comments[0].replies[0].date).toBe(new Date(replies[0].dt).toISOString())
        expect(ret.thread.comments[0].replies[0].username).toBe(replies[0].username)

        expect(ret.thread.comments[0].replies[1].id).toBe(replies[1].id)
        expect(ret.thread.comments[0].replies[1].content).toBe('**balasan telah dihapus**')
        expect(ret.thread.comments[0].replies[1].date).toBe(new Date(replies[1].dt).toISOString())
        expect(ret.thread.comments[0].replies[1].username).toBe(replies[1].username)

        expect(ret.thread.comments[1].id).toBe(comments[1].id)
        expect(ret.thread.comments[1].username).toBe(comments[1].username)
        expect(ret.thread.comments[1].date).toBe(new Date(comments[1].dt).toISOString())
        expect(ret.thread.comments[1].content).toBe('**komentar telah dihapus**')


    })
})