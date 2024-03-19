CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Path: db.sql
CREATE TABLE IF NOT EXISTS "Users" (
  "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "Username" VARCHAR(255) NOT NULL,
  "Email" VARCHAR(255) NOT NULL,
  "Password" VARCHAR(255) NOT NULL,
  "Created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM "Users";

INSERT INTO "Users" ("Username", "Email", "Password") VALUES ('admin', 'ivankikic49@gmail.com', '05111974');
