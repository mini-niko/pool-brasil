/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("addresses", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    state: {
      type: "char(2)",
      notNull: true,
    },
    city: {
      type: "varchar(25)",
      notNull: true,
    },
    street: {
      type: "varchar(100)",
      notNull: true,
    },
    number: {
      type: "integer",
      notNull: true,
    },
    complement: {
      type: "varchar(20)",
    },
    reference: {
      type: "varchar(40)",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("addresses");
};
