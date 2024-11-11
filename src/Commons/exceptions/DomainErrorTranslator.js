const InvariantError = require('./InvariantError');
const NotFoundError = require('./NotFoundError');
const AuthorizationError = require('./AuthorizationError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY' : new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION' : new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR' : new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER' : new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY' : new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION' : new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN' : new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION' : new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN' : new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION' : new InvariantError('refresh token harus string'),

  // DOMAIN
  'THREAD.NOT_CONTAIN_NEEDED_PROPERTY' : new InvariantError('tidak dapat membuat domain thread karena properti yang dibutuhkan tidak ada'),
  'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION' : new InvariantError('tidak dapat membuat domain thread karena tidak data tidak sesuai'),
  'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY' : new InvariantError('tidak dapat membuat domain comment karena properti yang dibutuhkan tidak ada'),
  'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION' : new InvariantError('tidak dapat membuat domain comment karena tidak data tidak sesuai'),
  'REPLY.NOT_CONTAIN_NEEDED_PROPERTY' : new InvariantError('tidak dapat membuat domain reply karena properti yang dibutuhkan tidak ada'),
  'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION' : new InvariantError('tidak dapat membuat domain reply karena tidak data tidak sesuai'),

  // USE CASE
  'THREAD_NOT_FOUND' : new NotFoundError('Thread tidak ada'),
  'COMMENT_NOT_FOUND' : new NotFoundError('Komentar tidak ada'),
  'REPLY_NOT_FOUND' : new NotFoundError('Balasan tidak ada'),
  
  'NOT_YOUR_COMMENT' : new AuthorizationError('Bukan Komentar anda'),
  'NOT_YOUR_REPLY' : new AuthorizationError('Bukan Balasan anda')

};

module.exports = DomainErrorTranslator;
