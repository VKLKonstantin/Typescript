import { Schema, model } from 'mongoose'

export interface BookQuery {
    accountId: string;
    idBook: string;
    title?: string;
    description?: string;
    authors?: string;
    favorite?: string;
    fileCover?: string;
}

export interface BookDataPayload {
    accountId: string;
    idBook: string;
    title: string;
    description: string;
    authors: string;
    favorite: string;
    fileCover: string;
}

export type BookData = Omit<BookQuery & BookDataPayload, 'accountId'>;
export interface IBookData extends Document, BookDataPayload { }

const bookSchema = new Schema({
    accountId: { type: String, required: true, lowercase: true, trim: true },
    idBook: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    authors: { type: String },
    favorite: { type: String },
    fileCover: { type: String },
})

export const BookModel = model<IBookData>('bookSchema', bookSchema);

const _addBook = async (query: BookQuery, diff: Partial<BookDataPayload>, upsert: boolean): Promise<void> => {
    await BookModel.findOneAndUpdate(query, diff, { upsert });
};

export const addBook = async (accountId: string, idBook: string, data: { title: string, description: string, authors: string, favorite: string, fileCover: string }) => (
    _addBook({ accountId, idBook }, data, true)
);

const _findOneBook = async (query: Partial<BookQuery>): Promise<BookData | null> => (
    await BookModel.findOne(query)
);

export const findOneBook = async (idBook: string) => (
    _findOneBook({ idBook })
);

const _findOneBookAndUpdate = async (query: Partial<BookQuery>): Promise<BookData | null> => (
    await BookModel.findOneAndUpdate(query)
);

export const findOneBookAndUpdate = async (idBook: string, accountId: string) => (
    _findOneBookAndUpdate({ idBook, accountId })
);

const _findBooks = async (query: Partial<BookQuery>): Promise<Required<BookData>[]> => (
    await BookModel.find(query)
);

export const findBooks = async (accountId: string) => (
    _findBooks({ accountId })
);
const _deleteOneBook = async (query: Partial<BookQuery>): Promise<void> => {
    await BookModel.findOneAndDelete(query)
};

export const deleteOneBook = async (accountId: string, idBook: string) => (
    _deleteOneBook({ accountId, idBook })
);

const _deleteAllBooks = async (query: Partial<BookQuery>): Promise<void> => {
    await BookModel.deleteMany(query)
};

export const deleteAllBooks = async (accountId: string) => (
    _deleteAllBooks({ accountId })
);