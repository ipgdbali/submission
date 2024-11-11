const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('AddThreadUseCase', () => {

  const id = '1234';
  const mockRepoThread = new ThreadRepository();
  const mockNanoId = jest.fn( () => id );

  it('should return correct value', async () => {

    mockRepoThread.addThread = jest.fn( () => {
      Promise.resolve();
    });

    const usecase = new AddThreadUseCase(mockRepoThread, mockNanoId);

    const payload = {
      title : 'thread-title',
      body : 'thread-body'
    };

    const credential = {
      id : 'userid',
      username : 'username'
    };

    const ret = await usecase.execute(payload, credential);

    expect(mockRepoThread.addThread).toBeCalledTimes(1);
    expect(mockNanoId).toBeCalledTimes(1);

    expect(mockRepoThread.addThread.mock.calls[0][0].id).toBe('thread-' + id);
    expect(mockRepoThread.addThread.mock.calls[0][0].dt).toBeLessThanOrEqual(Date.now());
    expect(mockRepoThread.addThread.mock.calls[0][0].dt).toBeGreaterThan(Date.now() - 3000);
    expect(mockRepoThread.addThread.mock.calls[0][0].title).toBe(payload.title);
    expect(mockRepoThread.addThread.mock.calls[0][0].body).toBe(payload.body);
    expect(mockRepoThread.addThread.mock.calls[0][0].owner).toBe(credential.id);
    expect(mockRepoThread.addThread.mock.calls[0][0].username).toBe(credential.username);

    expect(ret.addedThread.id).toBe('thread-' + id);
    expect(ret.addedThread.title).toBe(payload.title);
    expect(ret.addedThread.owner).toBe(credential.id);

  });
});