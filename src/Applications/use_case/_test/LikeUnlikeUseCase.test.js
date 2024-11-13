const Thread = require('../../../Domains/thread/entities/Thread');
const Comment = require('../../../Domains/thread/entities/Comment');
const LikeUnlike = require('../../../Domains/thread/entities/LikeUnlike');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const LikeUnlikeThreadsCommentUseCase = require('../LikeUnlikeThreadsCommentUseCase');

describe('LikeUnlikeUseCase', () => {

  let user = {
    id : 'userId',
    username : 'userName'
  };

  let thread = new Thread({
    id : 'threadId',
    dt : Date.now(),
    bodyreq : {
      title : 'Thread Title',
      body : 'Thread Body'
    },
    user
  });

  let comment = new Comment({
    id : 'commentId',
    dt : Date.now(),
    threadId : thread.id,
    bodyreq : {
      content : 'My Comment',
    },
    user,
    is_delete : false
  });

  let likeUnlike = new LikeUnlike({
    threadId : thread.id,
    commentId : comment.id,
    user
  });

  let mockRepoThread;

  beforeEach( () => {
    mockRepoThread = new ThreadRepository();
  });

  it('should throw error if thread is notfound/invalid', async () => {

    mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve((threadId == thread.id)? thread : null) );
    
    const useCase = new LikeUnlikeThreadsCommentUseCase(mockRepoThread);

    await expect(() => useCase.execute('xxx', comment.id, user) ).rejects.toThrow('THREAD_NOT_FOUND');

    expect(mockRepoThread.getThreadById).toBeCalledTimes(1);
    expect(mockRepoThread.getThreadById).toBeCalledWith('xxx');

  });

  it('should throw error if comment is notfound/invalid', async () => {

    mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve((threadId == thread.id)? thread : null) );
    mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve((commentId == comment.id)? comment : null) );
    
    const useCase = new LikeUnlikeThreadsCommentUseCase(mockRepoThread);

    await expect(() => useCase.execute(thread.id, 'xxx', user) ).rejects.toThrow('COMMENT_NOT_FOUND');

    expect(mockRepoThread.getThreadById).toBeCalledTimes(1);
    expect(mockRepoThread.getThreadById).toBeCalledWith(thread.id);
    expect(mockRepoThread.getCommentById).toBeCalledTimes(1);
    expect(mockRepoThread.getCommentById).toBeCalledWith('xxx');

  });

  it('should like if not exist', async () => {
    mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve((threadId == thread.id)? thread : null) );
    mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve((commentId == comment.id)? comment : null) );
    mockRepoThread.isExistLikeUnlike = jest.fn( () => Promise.resolve(false) );
    mockRepoThread.rmLikeUnlike = jest.fn( () => Promise.resolve() );
    mockRepoThread.addLikeUnlike = jest.fn( () => Promise.resolve() );

    const useCase = new LikeUnlikeThreadsCommentUseCase(mockRepoThread);
    await useCase.execute(thread.id, comment.id, user);

    expect(mockRepoThread.isExistLikeUnlike).toBeCalledTimes(1);
    expect(mockRepoThread.isExistLikeUnlike).toBeCalledWith(likeUnlike);

    expect(mockRepoThread.rmLikeUnlike).toBeCalledTimes(0);
    expect(mockRepoThread.addLikeUnlike).toBeCalledTimes(1);
    expect(mockRepoThread.addLikeUnlike).toBeCalledWith(likeUnlike);
  });

  it('should unlike if exist', async () => {

    mockRepoThread.getThreadById = jest.fn( (threadId) => Promise.resolve((threadId == thread.id)? thread : null) );
    mockRepoThread.getCommentById = jest.fn( (commentId) => Promise.resolve((commentId == comment.id)? comment : null) );
    mockRepoThread.isExistLikeUnlike = jest.fn( () => Promise.resolve(true) );
    mockRepoThread.rmLikeUnlike = jest.fn( () => Promise.resolve() );
    mockRepoThread.addLikeUnlike = jest.fn( () => Promise.resolve() );

    const useCase = new LikeUnlikeThreadsCommentUseCase(mockRepoThread);
    await useCase.execute(thread.id, comment.id, user);

    expect(mockRepoThread.isExistLikeUnlike).toBeCalledTimes(1);
    expect(mockRepoThread.isExistLikeUnlike).toBeCalledWith(likeUnlike);

    expect(mockRepoThread.addLikeUnlike).toBeCalledTimes(0);
    expect(mockRepoThread.rmLikeUnlike).toBeCalledTimes(1);
    expect(mockRepoThread.rmLikeUnlike).toBeCalledWith(likeUnlike);

  });

});