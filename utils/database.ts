/* eslint-disable no-multi-assign */
import mongoose, {ConnectOptions} from 'mongoose';

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const defaultDatabase = process.env.DB_DEFAULT_DATABASE;
const MONGODB_URI = `mongodb+srv://${user}:${password}@${defaultDatabase}.cam78.mongodb.net/\
${defaultDatabase}?retryWrites=true&w=majority`;

if (!user || !password || !defaultDatabase) {
  throw new Error(`Datbase configuration invalid.
  user: ${user}
  defaultDatabase: ${defaultDatabase}
  mongoURI: ${MONGODB_URI}
  `);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = {conn: null, promise: null};
}

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoReconnect: false,
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // and MongoDB driver buffering
  autoCreate: true,
  useFindAndModify: false,
};

/**
 * Connects to the MongoDB database and caches the connection to re-use.
 *
 * @returns mongoose connection to the database
 */
export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  cached.conn = await mongoose.connect(MONGODB_URI, opts).then(m => m.connection);
  mongoose.set('returnOriginal', false);
  mongoose.set('useFindAndModify', false);
  return cached.conn;
}
