import { ObjectId, WithId } from 'mongodb';
import { db } from '../../db';
import { User } from '../domain/user.entity';

export const usersRepository = {
  async create(user: User): Promise<string> {
    const newUser = await db
      .getCollections()
      .usersCollection.insertOne({ ...user });
    return newUser.insertedId.toString();
  },
  async delete(id: string): Promise<boolean> {
    const isDel = await db
      .getCollections()
      .usersCollection.deleteOne({ _id: new ObjectId(id) });
    return isDel.deletedCount === 1;
  },
  async findById(id: string): Promise<WithId<User> | null> {
    return db
      .getCollections()
      .usersCollection.findOne({ _id: new ObjectId(id) });
  },
  async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<User> | null> {
    return db.getCollections().usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  },

  async doesExistByLoginOrEmail(
    login: string,
    email: string
  ): Promise<boolean> {
    const user = await db.getCollections().usersCollection.findOne({
      $or: [{ email }, { login }],
    });
    return !!user;
  },
};
