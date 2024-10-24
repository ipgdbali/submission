/**
 *
 */
class Reply {

    constructor(payload) {

        this._verifyPayload(payload);

        this.id = payload.id;
        this.dt = payload.dt;
        this.commentId = payload.commentId;
        this.content = payload.bodyreq.content;
        this.owner = payload.user.id;
        this.username = payload.user.username;
        this.is_delete = payload.is_delete;
    }

    _verifyPayload({id,dt,commentId,bodyreq,user,is_delete}) {
        
        if(!id || !dt || !commentId || !bodyreq || !user || is_delete === 'undefined') {
            throw new Error("REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
        }
        
        if(typeof id !== 'string' || typeof dt !== 'number' || typeof bodyreq !== 'object' || typeof user !== 'object' || typeof is_delete !== 'boolean') {
            throw new Error("REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION")
        }
        
        if(!bodyreq.content || !user.id || !user.username) {
            throw new Error("REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
        }
        
        if(typeof bodyreq.content !== 'string' || typeof user.id !== 'string' || typeof user.username !== 'string') {
            throw new Error("REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION")
        }

    }


}

module.exports = Reply