import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import passport from 'passport'
import bookRouter from './api/bookRouter'
import userRouter from './api/userRouter'

const PORT = process.env.PORT || 3002
const passwordDB = process.env.PasswordDB

async function start(port: string | number, _passwordDB: string | undefined) {
    if (_passwordDB !== undefined) {
        try {
            await mongoose
                .connect(_passwordDB)
                .then(() => {
                    console.info('Connected to MONGO.');
                })
                .catch((error) => {
                    console.error('Failed to connect to: MONGO.', error);

                    return process.exit(1);
                });

            app.listen(port, () => { `Сервер запущен на ${port}` })
        }
        catch (e) {
            console.log(e)
        }
    }

}

start(PORT, passwordDB)

const app = express()
    .set('view engine', 'ejs')
    .set('views', './src/views')
    .use(express.urlencoded())
    .use(session({ secret: 'SECRET' }))
    .use(passport.initialize())
    .use(passport.session())
    .use(express.static("public"))
    .use('/user', userRouter)
    .use('/api', bookRouter)

app.use('/', (req, res) => {
    res.render("start", { title: "Добро пожаловать в библиотеку!" });
})

