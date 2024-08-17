import {ObjectId, WithId} from "mongodb";
import {IUserDB} from "./types/user.db.interface";
import {db} from "../db";


export const usersRepository = {
    async create(user: IUserDB): Promise<string> {
        const newUser = await db.getCollections().usersCollection.insertOne({...user});
        return newUser.insertedId.toString();
    },
    async delete(id: string): Promise<boolean> {
        if (!this._checkObjectId(id)) return false;
        const isDel = await db.getCollections().usersCollection.deleteOne({_id: new ObjectId(id)});
        return isDel.deletedCount === 1;
    },
    async findById(id: string): Promise<WithId<IUserDB> | null> {
        if (!this._checkObjectId(id)) return null;
        return db.getCollections().usersCollection.findOne({_id: new ObjectId(id)});

    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<IUserDB> | null> {
        return db.getCollections().usersCollection.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}],
        });

    },
    _checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    },


};
