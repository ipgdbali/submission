const Thread = require('../../Domains/thread/entities/Thread');
const Comment = require('../../Domains/thread/entities/Comment');
const Reply = require('../../Domains/thread/entities/Reply');

class ThreadRepositoryPostgres extends require('./../../Domains/thread/ThreadRepository') {

  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addThread(domThread) {
    await this._pool.query('INSERT INTO thread (id,dt,title,body,owner) VALUES ($1,$2,$3,$4,$5)', [domThread.id, domThread.dt, domThread.title, domThread.body, domThread.owner]);
  }

  async addComment(domComment) {
    await this._pool.query('INSERT INTO comment (id,dt,threadid,content,owner,is_delete) VALUES ($1,$2,$3,$4,$5,false)', [domComment.id, domComment.dt, domComment.threadId, domComment.content, domComment.owner]);
  }

  async delCommentById(id) {
    await this._pool.query('UPDATE comment SET is_delete = true WHERE id = $1', [id]);
  }

  async getThreadById(id) {
    const res = await this._pool.query('SELECT t.id,t.dt,t.title,t.body,t.owner,u.username FROM thread t INNER JOIN users u ON (t.owner = u.id) WHERE t.id = $1', [id]);
    if(res.rowCount === 0) {
      return null;
    } else 
      return new Thread({
        id : res.rows[0].id,
        dt : Number(res.rows[0].dt),
        bodyreq : {
          title : res.rows[0].title,
          body : res.rows[0].body
        },
        user : {
          id : res.rows[0].owner,
          username : res.rows[0].username
        }
      });
  }

  async getCommentById(id) {
        
    const res = await this._pool.query('SELECT c.id,c.dt,c.threadid,c.content,c.owner,u.username,c.is_delete FROM comment c INNER JOIN users u ON (c.owner = u.id) WHERE c.id = $1', [id]);
    if(res.rowCount === 0) {
      return null;
    } else 
      return new Comment({
        id : res.rows[0].id,
        dt : Number(res.rows[0].dt),
        threadId : res.rows[0].threadid,
        bodyreq : {
          content : res.rows[0].content
        },
        user : {
          id : res.rows[0].owner,
          username : res.rows[0].username
        },
        is_delete : Boolean(res.rows[0].is_delete)
      });
        
  }

  async getCommentsByThreadId(id) {
    const res = await this._pool.query('SELECT c.id,c.dt,c.threadid,c.content,c.owner,u.username,c.is_delete FROM comment c INNER JOIN users u ON (c.owner = u.id) WHERE c.threadid = $1 ORDER BY c.dt ASC', [id]);
    const ret = res.rows.map( (x) => new Comment({
      id : x.id,
      dt : Number(x.dt),
      threadId : x.threadid,
      bodyreq : {
        content : x.content
      },
      user : {
        id : x.owner,
        username : x.username
      },
      is_delete : x.is_delete
    }));
    return ret;
  }

  async addReply(domReply) {
    await this._pool.query('INSERT INTO reply (id,dt,commentid,content,owner,is_delete) VALUES ($1,$2,$3,$4,$5,false)', [domReply.id, domReply.dt, domReply.commentId, domReply.content, domReply.owner]);
  }

  async delReplyById(id) {
    await this._pool.query('UPDATE reply SET is_delete = true WHERE id = $1', [id]);
  }

  async getReplyById(id) {

    const res = await this._pool.query('SELECT r.id,r.dt,r.commentid,r.content,r.owner,u.username,r.is_delete FROM reply r INNER JOIN users u ON (r.owner = u.id) WHERE r.id = $1', [id]);
    if(res.rowCount === 0) {
      return null;
    } else {
      return new Reply({
        id : res.rows[0].id,
        dt : Number(res.rows[0].dt),
        commentId : res.rows[0].commentid,
        bodyreq : {
          content : res.rows[0].content
        },
        user : {
          id : res.rows[0].owner,
          username : res.rows[0].username
        },
        is_delete : res.rows[0].is_delete
      });
    }
  }

  async getRepliesByCommentId(id) {
    const res = await this._pool.query('SELECT r.id,r.dt,r.commentid,r.content,r.owner,u.username,r.is_delete FROM reply r INNER JOIN users u ON (r.owner = u.id) WHERE r.commentid = $1 ORDER BY r.dt ASC', [id]);
    return res.rows.map( (x) => new Reply({
      id : x.id,
      dt : Number(x.dt),
      commentId : x.commentid,
      bodyreq : {
        content : x.content
      },
      user : {
        id : x.owner,
        username : x.username
      },
      is_delete : Boolean(x.is_delete)
    }));        
  }

}
  
module.exports = ThreadRepositoryPostgres;