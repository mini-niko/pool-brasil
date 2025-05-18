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
  pgm.createType("status_enum", ["pending", "confirmed", "cancelled", "done"]);

  pgm.createTable("appointment_location", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    latitude: {
      type: "numeric(9,6)",
      notNull: true,
    },
    longitude: {
      type: "numeric(9,6)",
      notNull: true,
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

  pgm.createTable("appointments", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    client_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    professional_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    date_time: {
      type: "timestamp with time zone",
      notNull: true,
    },
    status: {
      type: "status_enum",
      notNull: true,
      default: "pending",
    },
    appointment_location_id: {
      type: "integer",
      notNull: true,
      references: "appointment_location",
      onDelete: "CASCADE",
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
  });

  pgm.createTable("services", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    type: {
      type: "varchar(64)",
      notNull: true,
    },
  });

  pgm.createTable(
    "appointments_services",
    {
      appointment_id: {
        type: "integer",
        notNull: true,
        references: "appointments",
        onDelete: "CASCADE",
      },
      service_id: {
        type: "integer",
        notNull: true,
        references: "services",
        onDelete: "CASCADE",
      },
    },
    {
      primaryKey: ["appointment_id", "service_id"],
    },
  );

  pgm.sql(`
    INSERT INTO services (type)
    VALUES ('Limpeza');
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
