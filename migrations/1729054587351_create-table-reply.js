exports.shorthands = undefined;

exports.up = (pgm) => {

  pgm.createTable('reply', {
    id : {
      type : 'varchar(30)',
      primaryKey : true
    },
    dt : {
      type : 'bigint',
      notNull : true
    },
    commentid : {
      type : 'varchar(30)',
      notnull : true
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

  pgm.dropTable('reply', {
  });
    
};
