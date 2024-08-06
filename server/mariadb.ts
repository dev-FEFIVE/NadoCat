import { createConnection, Connection } from "mysql2";
import * as dotenv from "dotenv";

dotenv.config();

interface ConnectionConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  dateStrings: boolean;
};

const config: ConnectionConfig = {
  host: process.env.HOST as string,
  user: process.env.USER as string,
  password: process.env.PASSWORD as string,
  database: process.env.DATABASE as string,
  dateStrings: true
};

const connection: Connection = createConnection(config);

export default connection;
