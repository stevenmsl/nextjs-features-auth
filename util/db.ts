import { ObjectId, OptionalId, WithId } from "mongodb";
import { MongoClient } from "mongodb";
import { User } from "../types";
export const mongdbUrl =
  "mongodb+srv://dbTraining:0gsuWQTY0g2kwkdy@cluster0.t0rrt.mongodb.net/auth?retryWrites=true&w=majority";

export type DocCollection = "users";

export interface DbResult<T> {
  result: T;
  hasError: boolean;
  message: string;
}

export const connect = async () => {
  const result: DbResult<MongoClient> = {
    result: null,
    hasError: false,
    message: "",
  };

  try {
    result.result = await MongoClient.connect(mongdbUrl, {
      useUnifiedTopology: true,
    });
  } catch (error) {
    result.hasError = true;
    result.message = "unable to connect to the db";
  }
  return result;
};

export const insertDoc = async <T>(
  rec: OptionalId<T>,
  collection: DocCollection
) => {
  const result: DbResult<OptionalId<T>> = {
    result: rec,
    hasError: false,
    message: "",
  };

  const connectDb = await connect();

  if (connectDb.hasError) {
    result.hasError = true;
    result.message = connectDb.message;
    return result;
  }

  try {
    const db = connectDb.result.db();
    const inserted = await db.collection<T>(collection).insertOne(rec);
    rec._id = inserted.insertedId;
  } catch (error) {
    result.hasError = true;
    result.message = "failed to insert user";
  }

  connectDb.result.close();

  return result;
};

export const insertUser = async (user: User) => {
  return await insertDoc<User>(user, "users");
};

export const findUser = async (email: string) => {
  const result: DbResult<WithId<User>> = {
    hasError: false,
    message: "",
    result: null,
  };
  const connectDb = await connect();

  if (connectDb.hasError) {
    result.hasError = true;
    result.message = connectDb.message;
    return result;
  }

  try {
    const db = connectDb.result.db();
    const found = await db
      .collection<WithId<User>>("users")
      .findOne({ email: email });
    result.result = found;
  } catch (error) {
    result.hasError = true;
    result.message = "unable to query db";
  }

  connectDb.result.close();
  return result;
};

export const updatePassword = async (_id: ObjectId, newPassword: string) => {
  const result: DbResult<void> = { hasError: false, message: "", result: null };
  const connectDb = await connect();

  if (connectDb.hasError) {
    result.hasError = true;
    result.message = connectDb.message;
    return result;
  }

  try {
    const db = connectDb.result.db();
    const result = await db
      .collection<WithId<User>>("users")
      .updateOne({ _id }, { $set: { password: newPassword } });
  } catch (error) {
    result.hasError = true;
    result.message = "unable to query db";
  }

  connectDb.result.close();
  return result;
};
