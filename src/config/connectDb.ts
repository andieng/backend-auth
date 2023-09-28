import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const connectDb = (filename: string) => {
  const adapter = new FileSync(filename);
  const db = low(adapter);
  db.defaults({
    users: [],
  });
  return db;
};

export default connectDb;
