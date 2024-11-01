const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase')
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase')
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase')
const AddThreadCommentReplyUseCase = require('../../../../Applications/use_case/AddThreadCommentReplyUseCase')
const DeleteThreadCommentReplyUseCase = require('../../../../Applications/use_case/DeleteThreadCommentReplyUseCase')

/**
 *
 */
class ThreadsHandler {

  constructor(container) {
    this._container = container;

    this.postThreadsHandler = this.postThreadsHandler.bind(this);
    this.postThreadsCommentsHandler = this.postThreadsCommentsHandler.bind(this)
    this.deleteThreadsCommentsHandler = this.deleteThreadsCommentsHandler.bind(this)
    this.getThreadsHandler = this.getThreadsHandler.bind(this)
    this.postThreadsCommentsRepliesHandler = this.postThreadsCommentsRepliesHandler.bind(this)
    this.deleteThreadsCommentsRepliesHandler = this.deleteThreadsCommentsRepliesHandler.bind(this)

  }

  async postThreadsHandler(req,h) {
    const ret = await this._container.getInstance(AddThreadUseCase.name).execute(req.payload,req.auth.credentials);
    return h.response({
        status: "success",
        data: ret
    }).code(201);
  }

  async postThreadsCommentsHandler(req,h) {

    const ret = await this._container.getInstance(AddThreadCommentUseCase.name).execute(req.params.threadId,req.payload,req.auth.credentials);
    return h.response({
        status: "success",
        data: ret
    }).code(201);

  }

  async deleteThreadsCommentsHandler(req,h) {

    await this._container.getInstance(DeleteThreadCommentUseCase.name).execute(req.params.threadId,req.params.commentId,req.auth.credentials);
    return h.response({
        status: "success",
    }).code(200);

  }

  async getThreadsHandler(req,h) {

    const ret = await this._container.getInstance(GetThreadDetailUseCase.name).execute(req.params.threadId);
    return h.response({
        status: "success",
        data: ret
    }).code(200);

  }

  async postThreadsCommentsRepliesHandler(req,h) {

    const ret = await this._container.getInstance(AddThreadCommentReplyUseCase.name).execute(req.params.threadId,req.params.commentId,req.payload,req.auth.credentials);
    return h.response({
          status: "success",
          data: ret
    }).code(201);

  }

  async deleteThreadsCommentsRepliesHandler(req,h) {
    await this._container.getInstance(DeleteThreadCommentReplyUseCase.name).execute(req.params.threadId,req.params.commentId,req.params.replyId,req.auth.credentials);
    
    return h.response({
        status: "success",
    }).code(200);

  }
}

module.exports = ThreadsHandler;