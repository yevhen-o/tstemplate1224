const keys = {
  pgUser: process.env.PGUSER || "postgres",
  pgHost: process.env.PGHOST || "localhost",
  pgDatabase: process.env.PGDATABASE || "postgres",
  pgPassword: process.env.PGPASSWORD || "",
  pgPort: process.env.PGPORT || 5432,
  backendPort: process.env.BACKENDPORT || 5000,
};

export default keys;
