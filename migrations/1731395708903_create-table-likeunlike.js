/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {

  pgm.createTable('likeunlike', {
    commentid : {
      type : 'varchar(30)',
      notnull : true
    },
    userid : {
      type : 'varchar(30)',
      notNull : true
    },

  });

};

exports.down = (pgm) => {
  pgm.dropTable('likeunlike');
};
