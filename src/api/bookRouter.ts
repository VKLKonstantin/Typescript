import { Router } from 'express'
import { v4 } from 'uuid';
import { addBook, deleteOneBook, findBooks, findOneBook, findOneBookAndUpdate } from '../models/book_model';

const router = Router()

type User = {
    login: '',
    password: '',
    accountId: '',
}
router.get('/menu', async (req, res) => {
    console.log('req.user', req.user)
    res.render("menu", { title: 'Добро пожаловать в Ваш личный кабинет' });
})

router.get('/books', async (req, res) => {
    const user = req.user as User
    console.log('user', user)
    const accountId = user.accountId
    try {
        const booksList = await findBooks(accountId)
        res.render("listBooks", { booksList, title: 'Список книг' });
    }
    catch (e) {
        console.log(e)
        res.render("error", { title: 'Не удалось получить список книг' })
    }

})

router.get('/books/:idBook', async (req, res) => {
    const { idBook } = req.params
    try {
        const selectedBook = await findOneBook(idBook);
        if (selectedBook) {
            res.render("aboutBook", { book: selectedBook, title: `Книга ${selectedBook.title}` });
        }
        else {
            res.status(404)
            res.render("error", { title: '404 | Книга не найдена' })
        }
    }
    catch (e) {
        res.render("error", { title: '404 | Книга не найдена' })
    }
})

router.post('/book/delete/:idBook', async (req, res) => {
    const { idBook } = req.params
    const user = req.user as User
    const accountId = user.accountId
    try {
        await deleteOneBook(accountId, idBook)
        res.render("menu", { title: 'Список книг' });
    } catch (e) {
        res.status(404)
        res.render("error", { title: 'Что-то пошло не так. Не удалось удалить книгу' })
    }
})

router.get('/createBook', (req, res) => {
    res.render("createBook", { title: "Добавьте книгу", book: {} });
})

router.post('/createBook', async (req, res) => {
    const { title, description, authors, favorite, fileCover } = req.body
    const user = req.user as User
    const accountId = user.accountId

    const idBook = v4();

    try {
        await addBook(accountId, idBook, { title, description, authors, favorite, fileCover });
        const booksList = await findBooks(accountId)
        res.status(201)
        res.render('listBooks', { booksList, title: 'Список книг' });
    }
    catch (e) {
        console.log(e)
        res.render("error", { title: 'Не удалось создать книгу' })
    }
})

router.get('/editBook/:idBook', async (req, res) => {
    const { idBook } = req.params

    const selectedBook = await findOneBook(idBook)

    if (selectedBook) {
        res.render("editBook", { book: selectedBook, title: 'Редактирование' });

    } else {
        res.status(404)
        res.render("error", { title: '404 | Книга не найдена' })
    }
})

router.post('/editBook/:idBook', async (req, res) => {
    const { title, description, authors, favorite, fileCover } = req.body
    const { idBook } = req.params
    const user = req.user as User
    const accountId = user.accountId
    try {
        await addBook(accountId, idBook, { title, description, authors, favorite, fileCover });
        const booksList = await findBooks(accountId)
        res.render("listBooks", { booksList, title: 'Список книг' });
    }
    catch (e) {
        res.status(404)
        res.render("error", { title: '404 | Книга не найдена' })
    }
})

// router.get('/books/:id/download', (req, res) => {
//     const { id } = req.params
//     const { booksList } = bookStore
//     const book = booksList.find(book => book.id === id);
//     if (!book) {
//         res.status(404)
//         res.render("error", { title: '404 | Книга не найдена' })
//     }
//     console.log('book', book)
//     const fileName = book.fileName;
//     console.log('fileName', fileName)
//     console.log('__dirname', __dirname)
//     res.download(__dirname + `/myUploads/${fileName}`, `${book.fileName}`, err => {
//         if (err) {
//             res.json(err)
//         }
//     });

// })

export default router;