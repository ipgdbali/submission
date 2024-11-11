exports.shorthands = undefined;

exports.up = (pgm) => {

  pgm.createTable('thread', {
    id : {
      type : 'varchar(30)',
      primaryKey : true,
    },
    dt : {
      type : 'bigint',
      notNull : true
    },
    title : {
      type : 'TEXT',
      notNull : true
    },
    body : {
      type : 'TEXT',
      notNull : true
    },
    owner : {
      type : 'varchar(30)',
      notNull : true
    }
  });

};

exports.down = (pgm) => {

  pgm.dropTable('thread');
};
