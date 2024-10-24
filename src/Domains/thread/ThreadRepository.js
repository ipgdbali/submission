/**
 *
 */
class ThreadRepository {

    async addThread(domThread) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }

    async addComment(domComment) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }

    async delCommentById(id) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }

    async getThreadById(id) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }

    async getCommentById(id) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }

    async getCommentsByThreadId(id) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }

    async getReplyById(id) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }
    async getRepliesByCommentId(id) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }

    async addReply(domReply) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }

    async delReplyById(id) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }

};
  
module.exports = ThreadRepository;