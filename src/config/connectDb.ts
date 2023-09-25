import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const connectDb = () => {
  const adapter = new FileSync("src/database/db.json");
  const db = low(adapter);
  db.defaults({
    users: [],
  });
  return db;
};

const db = connectDb();

export default db;
