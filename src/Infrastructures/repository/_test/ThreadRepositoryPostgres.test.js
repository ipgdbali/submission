const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepoTestHelper = require('../../../../tests/ThreadRepoTestHelper');

const pool = require('../../database/postgres/pool');

describe ('ThreadRepositoryPostgres', () => {

    const repo = new ThreadRepositoryPostgres(pool);
    const user = {
        id: 'userid',
        username: 'username',
        password: 'password',
        fullname: 'usertest'
    }

    beforeAll(async () => {
        await UsersTableTestHelper.addUser(user)
    })

    afterEach(async () => {
        await ThreadRepoTestHelper.cleanTable();
    })

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadRepoTestHelper.cleanTable();
        await pool.end();
    });


    describe('addThread',() => {
        it('should work correctly',async () => {

            const thread = {
                id : 'thread',
                dt : 1234,
                title : 'title',
                body : 'body',
                owner : 'userid'
            }

            await repo.addThread(thread);
            const ret = await repo.getThreadById(thread.id);

            expect(ret.id).toBe(thread.id);
            expect(ret.dt).toBe(thread.dt);
            expect(ret.title).toBe(thread.title);
            expect(ret.body).toBe(thread.body);
            expect(ret.owner).toBe(thread.owner);
            
        })
    })

    describe('add Comment',() => {
        it('should work correctly',async () => {

            const comment = {
                id : 'comment',
                dt: 1234,
                threadId: 'threadId',
                content: 'content',
                owner: 'userid'
            }

            await repo.addComment(comment);
            const ret = await repo.getCommentById(comment.id);
    
            expect(ret.id).toBe(comment.id);
            expect(ret.dt).toBe(comment.dt);
            expect(ret.threadId).toBe(comment.threadId);
            expect(ret.content).toBe(comment.content);
            expect(ret.owner).toBe(comment.owner);
            expect(ret.is_delete).toBe(false);

        })
    })

    describe('delCommentById',() => {

        it('should work correctly',async () => {

            const comment = {
                id : 'comment',
                dt: 1234,
                threadId: 'threadId',
                content: 'content',
                owner: 'userid'
            }

            await repo.addComment(comment);
            await repo.delCommentById(comment.id)
            const ret = await repo.getCommentById(comment.id);
    
            expect(ret.id).toBe(comment.id);
            expect(ret.dt).toBe(comment.dt);
            expect(ret.threadId).toBe(comment.threadId);
            expect(ret.content).toBe(comment.content);
            expect(ret.owner).toBe(comment.owner);
            expect(ret.is_delete).toBe(true);
    
        })

    })

    describe('getThreadById',() => {

        it('should return null if nothing found',async() => {
            const ret = await repo.getThreadById('threadid');
            expect(ret).toBeNull();
        })

        it('should work correctly',async () => {

            const thread = {
                id : 'thread',
                dt : 1234,
                title : 'title',
                body : 'body',
                owner : 'userid'
            }


            await repo.addThread(thread);
            const ret = await repo.getThreadById(thread.id);

            expect(ret.id).toBe(thread.id);
            expect(ret.dt).toBe(thread.dt);
            expect(ret.title).toBe(thread.title);
            expect(ret.body).toBe(thread.body);
            expect(ret.owner).toBe(thread.owner);
        })

    })

    describe('getCommentById',() => {

        it('should return null if nothing is found',async () => {
            const ret = await repo.getCommentById('commentId');
            expect(ret).toBeNull();
        })

        it('should work correctly',async () => {

            const comment = {
                id : 'commentId',
                dt: 1234,
                threadId: 'threadId',
                content: 'content',
                owner: 'userid'
            }

            await repo.addComment(comment);
            const ret = await repo.getCommentById(comment.id);
    
            expect(ret.id).toBe(comment.id);
            expect(ret.dt).toBe(comment.dt);
            expect(ret.threadId).toBe(comment.threadId);
            expect(ret.content).toBe(comment.content);
            expect(ret.owner).toBe(comment.owner);
            expect(ret.is_delete).toBe(false);
    
        })
    })

    describe('getCommentsByThreadId',() => {

        it('shoud have zero length if nothing is found',async () => {
            const  ret = await repo.getCommentsByThreadId('threadId');
            expect(ret).toHaveLength(0);
        })

        it('should work correctly',async () => {

            const comment = {
                id : 'comment',
                dt: 1234,
                threadId: 'threadId',
                content: 'content',
                owner: 'userid'
            }

            await repo.addComment(comment);
            const ret = await repo.getCommentsByThreadId(comment.threadId);
    
            expect(ret).toHaveLength(1);
            expect(ret[0].id).toBe(comment.id);
            expect(ret[0].dt).toBe(comment.dt);
            expect(ret[0].threadId).toBe(comment.threadId);
            expect(ret[0].content).toBe(comment.content);
            expect(ret[0].owner).toBe(comment.owner);
            expect(ret[0].is_delete).toBe(false);

        })

    })

    describe('addReply',() => {

        it('should work correctly',async () => {

            const reply = {
                id: 'replyId',
                dt: 1234,
                commentId: 'commentId',
                content: 'my content',
                owner: 'userid'
            };

            await repo.addReply(reply);

            const ret = await repo.getReplyById(reply.id);
            expect(ret.id).toBe(reply.id)
            expect(ret.dt).toBe(reply.dt)
            expect(ret.commentId).toBe(reply.commentId)
            expect(ret.content).toBe(reply.content)
            expect(ret.owner).toBe(reply.owner)
            expect(ret.is_delete).toBe(false)

        })

    })

    describe('delReply',() => {

        it('should work correctly',async () => {

            const reply = {
                id: 'replyId',
                dt: 1234,
                commentId: 'commentId',
                content: 'my content',
                owner: 'userid'
            };

            await repo.addReply(reply);
            await repo.delReplyById(reply.id)

            const ret = await repo.getReplyById(reply.id);
            expect(ret.id).toBe(reply.id)
            expect(ret.dt).toBe(reply.dt)
            expect(ret.commentId).toBe(reply.commentId)
            expect(ret.content).toBe(reply.content)
            expect(ret.owner).toBe(reply.owner)
            expect(ret.is_delete).toBe(true)

        })

    })

    describe('getReplyById',() => {

        it('should return null of nothing found',async () => {
            const ret = await repo.getReplyById('replyId');
            expect(ret).toBeNull();
        })

        it('should work correctly',async () => {

            const reply = {
                id: 'replyId',
                dt: 1234,
                commentId: 'commentId',
                content: 'my content',
                owner: 'userid'
            };

            await repo.addReply(reply);
            await repo.delReplyById(reply.id)

            const ret = await repo.getReplyById(reply.id);
            expect(ret.id).toBe(reply.id)
            expect(ret.dt).toBe(reply.dt)
            expect(ret.commentId).toBe(reply.commentId)
            expect(ret.content).toBe(reply.content)
            expect(ret.owner).toBe(reply.owner)
            expect(ret.is_delete).toBe(true)

        })
    })

    describe('getRepliesByCommentId',() => {

        it('should have length 0 if nothing found',async () => {
            const ret = await repo.getRepliesByCommentId('commentId');
            expect(ret).toHaveLength(0);
        })

        it('should do correctly',async () => {

            const reply = {
                id: 'replyId',
                dt: 1234,
                commentId: 'commentId',
                content: 'my content',
                owner: 'userid'
            };

            await repo.addReply(reply);
            const ret = await repo.getRepliesByCommentId('commentId');
            expect(ret).toHaveLength(1);

            expect(ret[0].id).toBe(reply.id);
            expect(ret[0].dt).toBe(reply.dt);
            expect(ret[0].commentId).toBe(reply.commentId);
            expect(ret[0].content).toBe(reply.content);
            expect(ret[0].owner).toBe(reply.owner);
            expect(ret[0].is_delete).toBe(false);


        })
    })
    
})