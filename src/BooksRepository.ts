import { Book } from "./interfaces/Book";

export class BooksRepository {

    constructor(public books: Book[]) { }

    findCurrentIndex(id: string) {
        return this.books.findIndex(book => book.id === id);
    }

    createBook(book: Book) {
        this.books.push(book);
    }

    getBook(id: string) {
        return this.books.find(book => book.id === id);
    }

    getBooks() {
        return this.books;
    }

    updateBook(id: string, newValue: Book) {
        const index = this.findCurrentIndex(id);
        this.books.splice(index, 1, newValue);
        const newBooks: Book[] =  this.books;
        return newBooks;
    }

    deleteBook(id: string) {
        const index = this.findCurrentIndex(id);
        this.books.splice(index, 1);
        const newBooks: Book[] = this.books;
        return newBooks;
    }



}