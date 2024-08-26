import {ObjectId, WithId} from "mongodb";
import {db} from "../db";
import {User} from "./domain/user.entity";


export const usersRepository = {
    async create(user: User): Promise<string> {
        const newUser = await db.getCollections().usersCollection.insertOne({...user});
        return newUser.insertedId.toString();
    },
    async delete(id: string): Promise<boolean> {
        if (!this._checkObjectId(id)) return false;
        const isDel = await db.getCollections().usersCollection.deleteOne({_id: new ObjectId(id)});
        return isDel.deletedCount === 1;
    },
    async findById(id: string): Promise<WithId<User> | null> {
        if (!this._checkObjectId(id)) return null;
        return db.getCollections().usersCollection.findOne({_id: new ObjectId(id)});

    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<User> | null> {
        return db.getCollections().usersCollection.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}],
        });

    },
    async doesExistById(id: string): Promise<boolean> {
        if (!this._checkObjectId(id)) return false;
        const isUser = await db.getCollections().usersCollection.findOne({_id: new ObjectId(id)});
        return !!isUser
    },

    async doesExistByLoginOrEmail(
        login: string,
        email: string
    ): Promise<boolean> {
        const user = await db.getCollections().usersCollection.findOne({
            $or: [{email}, {login}],
        });
        return !!user
    },

    _checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    },


};
