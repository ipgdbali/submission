const AddThreadUseCase = require("../AddThreadUseCase");
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('AddThreadUseCase', () => {

    const mockRepoThread = new ThreadRepository();
    const mockNanoId = jest.fn( (len) => '1234' );

    it('should return correct value',async () => {

        mockRepoThread.addThread = jest.fn( (thread) => {
            Promise.resolve()
        })

        const usecase = new AddThreadUseCase(mockRepoThread,mockNanoId);

        const payload = {
              title: 'thread-title',
              body:'thread-body'
        }

        const credential = {
          id:'userid',
          username: 'username'
        }

        const ret = await usecase.execute(payload,credential);

        expect(mockRepoThread.addThread).toBeCalledTimes(1)
        expect(mockNanoId).toBeCalledTimes(1)

        expect(mockRepoThread.addThread.mock.calls[0][0].id).toBe('thread-1234');
        expect(mockRepoThread.addThread.mock.calls[0][0].dt).toBeLessThanOrEqual(Date.now());
        expect(mockRepoThread.addThread.mock.calls[0][0].dt).toBeGreaterThan(Date.now() - 3000);
        expect(mockRepoThread.addThread.mock.calls[0][0].title).toBe(payload.title)
        expect(mockRepoThread.addThread.mock.calls[0][0].body).toBe(payload.body)
        expect(mockRepoThread.addThread.mock.calls[0][0].owner).toBe(credential.id)
        expect(mockRepoThread.addThread.mock.calls[0][0].username).toBe(credential.username)

        expect(ret.id).toBe('thread-1234');
        expect(ret.title).toBe(payload.title)
        expect(ret.dt).toBeLessThanOrEqual(Date.now())
        expect(ret.body).toBe(payload.body)
        expect(ret.owner).toBe(credential.id)
        expect(ret.username).toBe(credential.username)

    })
})