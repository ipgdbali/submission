exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comment', {
    id : {
      type : 'varchar(30)',
      primaryKey : true,
    },
    dt : {
      type : 'bigint',
      notNull : true
    },
    threadid : {
      type : 'varchar(30)',
      notNull : true
    },
    content : {
      type : 'text',
      notNull : true
    },
    owner : {
      type : 'varchar(30)',
      notNull : true
    },
    is_delete : {
      type : 'boolean',
      notNull : true
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comment');
};
