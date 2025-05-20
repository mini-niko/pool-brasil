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

  pgm.sql(`
  -- Inserir usuários
  INSERT INTO users (name, cpf, email, password, features, birth_day, created_at, updated_at)
  VALUES
    -- Admin
    ('Mariana Souza', '12345678900', 'mariana.admin@exemplo.com', 'admin123', '{"admin"}', '1985-04-12', now(), now()),

    -- Profissionais
    ('Carlos Silva', '32165498700', 'carlos.silva@exemplo.com', 'prof123', '{"professional"}', '1990-07-22', now(), now()),
    ('Fernanda Lima', '65498732100', 'fernanda.lima@exemplo.com', 'prof123', '{"professional"}', '1992-01-15', now(), now()),
    ('João Oliveira', '78912345600', 'joao.oliveira@exemplo.com', 'prof123', '{"professional"}', '1988-11-05', now(), now()),

    -- Clientes
    ('Ana Clara', '11122233344', 'ana.clara@exemplo.com', 'cliente123', '{"client"}', '2000-03-10', now(), now()),
    ('Pedro Henrique', '22233344455', 'pedro.henrique@exemplo.com', 'cliente123', '{"client"}', '1999-06-18', now(), now()),
    ('Lucas Almeida', '33344455566', 'lucas.almeida@exemplo.com', 'cliente123', '{"client"}', '1998-08-25', now(), now()),
    ('Juliana Costa', '44455566677', 'juliana.costa@exemplo.com', 'cliente123', '{"client"}', '1997-12-01', now(), now()),
    ('Isabela Rocha', '55566677788', 'isabela.rocha@exemplo.com', 'cliente123', '{"client"}', '2001-10-20', now(), now()),
    ('Thiago Ramos', '66677788899', 'thiago.ramos@exemplo.com', 'cliente123', '{"client"}', '1996-02-03', now(), now());

  -- Inserir endereços para os usuários
  INSERT INTO addresses (user_id, state, city, street, number, complement, reference)
  VALUES
    ((SELECT id FROM users WHERE email = 'mariana.admin@exemplo.com'), 'SC', 'Xanxerê', 'Rua Rui Barbosa', 150, NULL, 'Próximo à praça central'),

    ((SELECT id FROM users WHERE email = 'carlos.silva@exemplo.com'), 'SC', 'Xanxerê', 'Avenida Brasil', 245, 'Bloco B', 'Ao lado do mercado'),
    ((SELECT id FROM users WHERE email = 'fernanda.lima@exemplo.com'), 'SC', 'Xanxerê', 'Rua Victor Konder', 88, NULL, 'Próximo ao posto de saúde'),
    ((SELECT id FROM users WHERE email = 'joao.oliveira@exemplo.com'), 'SC', 'Xanxerê', 'Rua Coronel Passos Maia', 430, NULL, NULL),

    ((SELECT id FROM users WHERE email = 'ana.clara@exemplo.com'), 'SC', 'Xanxerê', 'Rua São Paulo', 300, 'Apto 201', 'Próximo à padaria'),
    ((SELECT id FROM users WHERE email = 'pedro.henrique@exemplo.com'), 'SC', 'Xanxerê', 'Rua Maranhão', 120, NULL, 'Atrás da escola municipal'),
    ((SELECT id FROM users WHERE email = 'lucas.almeida@exemplo.com'), 'SC', 'Xanxerê', 'Rua Bahia', 510, NULL, NULL),
    ((SELECT id FROM users WHERE email = 'juliana.costa@exemplo.com'), 'SC', 'Xanxerê', 'Rua Sergipe', 98, NULL, 'Casa com muro azul'),
    ((SELECT id FROM users WHERE email = 'isabela.rocha@exemplo.com'), 'SC', 'Xanxerê', 'Rua Pernambuco', 176, 'Fundos', 'Ao lado do salão'),
    ((SELECT id FROM users WHERE email = 'thiago.ramos@exemplo.com'), 'SC', 'Xanxerê', 'Rua Pará', 60, NULL, 'Casa com portão branco');

  -- Garantir que o serviço "Limpeza" exista
  INSERT INTO services (type)
  SELECT 'Limpeza'
  WHERE NOT EXISTS (
    SELECT 1 FROM services WHERE type = 'Limpeza'
  );

  -- Inserir locais de atendimento em Xanxerê - SC
  INSERT INTO appointment_location (latitude, longitude, state, city, street, number, complement, reference)
  VALUES
    (-26.8762, -52.4036, 'SC', 'Xanxerê', 'Rua Rui Barbosa', 123, 'Casa', 'Próximo ao mercado Central'),
    (-26.8745, -52.4077, 'SC', 'Xanxerê', 'Av. Brasil', 456, 'Apto 203', 'Em frente à farmácia São João'),
    (-26.8778, -52.4011, 'SC', 'Xanxerê', 'Rua Victor Konder', 789, NULL, 'Ao lado do posto Ipiranga');

  -- Gerar agendamentos variados entre clientes e profissionais
  WITH
    clientes AS (
      SELECT id AS client_id FROM users WHERE features @> '{"client"}'
    ),
    profissionais AS (
      SELECT id AS pro_id FROM users WHERE features @> '{"professional"}'
    ),
    locais AS (
      SELECT id AS loc_id FROM appointment_location
    ),
    servico AS (
      SELECT id AS service_id FROM services WHERE type = 'Limpeza'
    ),
    dados AS (
      SELECT
        c.client_id,
        p.pro_id,
        l.loc_id,
        row_number() OVER () AS i
      FROM clientes c
      CROSS JOIN profissionais p
      CROSS JOIN locais l
    ),
    agendamentos AS (
      SELECT
        client_id,
        pro_id,
        loc_id,
        (now() + (interval '1 day' * (row_number() OVER (PARTITION BY client_id ORDER BY i))))::timestamptz AS date_time
      FROM dados
      WHERE (i % 3) = 0 -- apenas alguns cruzamentos para não explodir
      LIMIT 50 -- garantir entre 3-5 por cliente
    )
  INSERT INTO appointments (client_id, professional_id, date_time, status, appointment_location_id, created_at)
  SELECT
    client_id,
    pro_id,
    date_time,
    'pending',
    loc_id,
    now()
  FROM agendamentos;

  -- Associar os agendamentos recém-criados ao serviço de Limpeza
  INSERT INTO appointments_services (appointment_id, service_id)
  SELECT a.id, s.id
  FROM appointments a
  JOIN services s ON true
  WHERE a.created_at >= now() - interval '10 minutes';
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("appointments_services");
  pgm.dropTable("services");
  pgm.dropTable("appointments");
  pgm.dropTable("appointment_location");
  pgm.dropType("status_enum");
};
