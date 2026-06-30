import mongoose from "mongoose";

/**
 * Mongoose connection is cached on the global object so that hot-reload
 * in Next.js dev mode doesn't open a new connection on every request.
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null };
}

const cache = global._mongooseCache;

export async function connectDB(): Promise<typeof mongoose> {
  // Guard here (not at module level) so Next.js build-time evaluation
  // doesn't throw when env vars haven't been injected yet.
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI environment variable is not set. Add it to .env.local."
    );
  }

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { bufferCommands: false }).catch((err) => {
      // Don't cache a rejected promise — let the next call retry the connection.
      cache.promise = null;
      throw err;
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
