const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepoTestHelper = require('../../../../tests/ThreadRepoTestHelper');

const pool = require('../../database/postgres/pool');
const Thread = require("../../../Domains/thread/entities/Thread");
const Comment = require("../../../Domains/thread/entities/Comment");
const Reply = require("../../../Domains/thread/entities/Reply");

describe ('ThreadRepositoryPostgres', () => {

    const repo = new ThreadRepositoryPostgres(pool);

    const user = {
        id : 'userid',
        username: 'username'
    }

    beforeAll(async () => {
        await ThreadRepoTestHelper.cleanTable();
        UsersTableTestHelper.addUser({
            id : user.id,
            username : user.username,
            password : 'password',
            fullname : 'Test User'
        })
    })

    afterEach(async () => {
        await ThreadRepoTestHelper.cleanTable();
    })

    afterAll(async () => {
        await ThreadRepoTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable()
        await pool.end();
    });

    it('should return null on getThreadById if no thread is found',async() => {
        const ret = await repo.getThreadById('threadId');
        expect(ret).toBe(null);
    });

    it('should run addThread,getThreadById Correctly',async () => {
        const thread = new Thread({
            id: 'threadid',
            dt: Date.now(),
            bodyreq:{
              title: 'thread-title',
              body:'thread-body'
            },
            user
          })
    
        await repo.addThread(thread)
        const ret = await repo.getThreadById(thread.id);
        expect(ret).toEqual(thread)
    })

    it('should return null on getCommentById if no comment is found',async() => {
        const ret = await repo.getCommentById('commentId');
        expect(ret).toBe(null);
    });


    it('should run addComment,getCommentById and delCommentById correctly',async () => {
        const comment = new Comment({
            id:'MyId',
            dt:Date.now(),
            threadId:'MyThreadId',
            bodyreq:{
              content:'My Content'
            },
            user,
            is_delete:false
        })

        await repo.addComment(comment)
        let ret = await repo.getCommentById(comment.id)
        expect(ret).toEqual(comment)

        await repo.delCommentById(comment.id)
        ret = await repo.getCommentById(comment.id)
        comment.is_delete = true;
        expect(ret).toEqual(comment)
    })

    it('should return null on getReplyById if no comment is found',async() => {
        const ret = await repo.getReplyById('commentId');
        expect(ret).toBe(null);
    });

    
    it('should run addReply,getReplyById and delReplyById correctly',async () => {

        const payload = {
            id: 'id',
            dt: Date.now(),
            commentId: 'commentId',
            bodyreq:{
              content: 'My Content'
            },
            user,
            is_delete : false
        };
    
        // Action
        const reply = new Reply(payload);

        await repo.addReply(reply)
        let ret = await repo.getReplyById(reply.id);
        expect(ret).toEqual(reply)

        await repo.delReplyById(reply.id)
        ret = await repo.getReplyById(reply.id)
        reply.is_delete = true;
        expect(ret).toEqual(reply)

    })

    it('should run getCommentsByThreadId correctly',async () => {
        const comment = new Comment({
            id:'id_1',
            dt:Date.now(),
            threadId:'MyThreadId',
            bodyreq:{
              content:'My Content'
            },
            user,
            is_delete:false
        })

        await repo.addComment(comment);

        comment.id = 'id_2';
        comment.dt += 1000;
        await repo.addComment(comment);

        const ret = await repo.getCommentsByThreadId(comment.threadId)
        expect(ret).toHaveLength(2)
        comment.id = 'id_2'
        expect(ret[1]).toEqual(comment)
        comment.id = 'id_1'
        comment.dt -= 1000
        expect(ret[0]).toEqual(comment)
    })

    it('should run getRepliesByCommentId correctly',async () => {
        const payload = {
            id: 'id_1',
            dt: Date.now(),
            commentId: 'commentId',
            bodyreq:{
              content: 'My Content'
            },
            user,
            is_delete : false
        };
    
        // Action
        const reply = new Reply(payload);

        await repo.addReply(reply)
        reply.id = 'id_2'
        reply.dt += 1000
        await repo.addReply(reply)

        const ret = await repo.getRepliesByCommentId(reply.commentId)
        expect(ret).toHaveLength(2);
        expect(ret[1]).toEqual(reply);
        reply.id = 'id_1'
        reply.dt -= 1000
        expect(ret[0]).toEqual(reply);

    })
    
})