import { Schema, model } from 'mongoose'
import { deleteAllBooks } from './book_model';

export interface RegistrationDataQuery {
    accountId: string;
}

export interface RegistrationDataPayload {
    accountId: string;
    login: string;
    password: string;
}

const UserSchema = new Schema({
    accountId: { type: String, required: true, lowercase: true, trim: true },
    login: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
})

export const UserModel = model('userSchema', UserSchema)

const _createRegistrationData = async (query: RegistrationDataPayload): Promise<Required<RegistrationDataPayload>> => (
    await UserModel.create(query)
);

export const createRegistrationData = (accountId: string, login: string, password: string) => (
    _createRegistrationData({ accountId, login, password })
);

const _deleteRegistrationData = async (query: RegistrationDataQuery):  Promise<void> => {
    await UserModel.findOneAndDelete(query);
};

export const deleteRegistrationData = (accountId: string) => (
    _deleteRegistrationData({ accountId })
);

export const deleteAccount = async (accountId: string) => {
    await Promise.all([
        deleteRegistrationData(accountId),
        deleteAllBooks(accountId),
    ]);
};




