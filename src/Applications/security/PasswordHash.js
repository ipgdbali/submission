/**
 *
 */
class PasswordHash {
  // eslint-disable-next-line no-unused-vars
  async hash(password) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line no-unused-vars
  async comparePassword(plain, encrypted) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = PasswordHash;
