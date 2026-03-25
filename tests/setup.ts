import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.mock("../src/lib/winston", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

let mongo: MongoMemoryServer;

beforeAll(async () => {
  // stop printing
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  //
  process.env.JWT_SECRET = "test";
  process.env.NODE_ENV = "test";
  process.env.MONGOMS_DISABLE_PROGRESS_BAR = "1";
  process.env.MONGOMS_DOWNLOAD_DIR = "./.mongo-binaries";
  //
  mongo = await MongoMemoryServer.create({
    binary: {
      version: "7.0.14",
    },
  });
  //
  await mongoose.connect(mongo.getUri());
  //
});

afterEach(async () => {
  //
  jest.clearAllMocks();
  //
  const collections = mongoose.connection.collections;
  //
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  //
});

afterAll(async () => {
  //
  await mongoose.disconnect();
  //
  if (mongo) {
    await mongo.stop();
  }
});
