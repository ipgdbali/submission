const routes = (handler) => ([
  {
    /*
        Kriteria 1
    */
    method : 'POST',
    path : '/threads',
    handler : handler.postThreadsHandler,
    options : {
      auth : 'jwt'
    }
  },
  {
    /*
        Kriteria 2
    */
    method : 'POST',
    path : '/threads/{threadId}/comments',
    handler : handler.postThreadsCommentsHandler,
    options : {
      auth : 'jwt'
    }
  },
  {
    /*
        Kriteria 3
    */
    method : 'DELETE',
    path : '/threads/{threadId}/comments/{commentId}',
    handler : handler.deleteThreadsCommentsHandler,
    options : {
      auth : 'jwt'
    }

  },
  {
    /*
        Kriteria 4
    */
    method : 'GET',
    path : '/threads/{threadId}',
    handler : handler.getThreadsHandler,
  },
  {
    /*
            Menambah balasan pada komentar Thread
        */
    method : 'POST',
    path : '/threads/{threadId}/comments/{commentId}/replies',
    handler : handler.postThreadsCommentsRepliesHandler,
    options : {
      auth : 'jwt'
    }
        
  },
  {
    /*
      Menghapus balasan pada koemtar Thread
    */
    method : 'DELETE',
    path : '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler : handler.deleteThreadsCommentsRepliesHandler,
    options : {
      auth : 'jwt'
    }
  },
  {
    /*
      Like and Unlike Comment Feature
    */

    method : 'PUT',
    path : '/threads/{threadId}/comments/{commentId}/likes',
    handler : handler.likeUnlikeThreadsComment,
    options : {
      auth : 'jwt'
    }
    
  },

]);
  
module.exports = routes;