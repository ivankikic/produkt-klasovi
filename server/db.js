import pg from "pg";

/*const pool = new pg.Pool({
  user: "raider",
  host: "localhost",
  database: "produktklasovidb",
  password: "05111974Vk!",
  port: 5432,
});*/

const pool = new pg.Pool({
  user: "postgres",
  host: "srv-captain--postgresql-obrtbak",
  database: "produktklasovidb",
  password: "e318f77de44c1335",
  port: 5432,
});

export default pool;
