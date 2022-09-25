import passport from 'passport';
import LocalStrategy from 'passport-local';
import { createRegistrationData, UserModel } from '../models/user_model';
import { v4 } from 'uuid';
import { Router } from 'express';

const _LocalStrategy = LocalStrategy.Strategy;
const router = Router()

const options = {
    usernameField: 'login',
    passwordField: 'password',
    accountIdField: 'accountId',
}

const verifyPassword = (user: any, password: string) => {
    return user.password === password
};

const verify = (login: string, password: string, done: any) => {
    UserModel.findOne({ login: login }, (err: any, user: any) => {
        if (err) {
            return done(err)
        }
        if (!user) {
            return done(null, false, { message: `Пользователь ${login} не найден` })
        }
        if (!verifyPassword(user, password)) {
            return done(null, false, { message: 'Не верный пароль' })
        }
        return done(null, user)
    })
}
passport.use('local', new _LocalStrategy(options, verify))

passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: NativeError, user: any) => done(err, user));
});
router.get('/get/login', (req, res) => {
    res.render("login", { title: "Вход" });
})

router.post('/send/login', passport.authenticate('local', { failureRedirect: '/user/get/login' }), (req, res) => {
    res.redirect('/api/menu')
})

router.get('/logout', function (req, res, next) {
    req.logout(function (err: any) {
        if (err) {
            return next(err);
        }
        console.log('requestLogout', req)
        res.redirect('/');
    });
});

export const getRegistrationFrame = router.get('/get/registration', (req, res) => {
    res.render("registration", { title: "Регистрация" });
})

export const sendRegistrationData = router.post('/send/registration', async (req, res) => {
    const { login, password } = req.body;
    const accountId = v4();
    try {
        await createRegistrationData(accountId, login, password)
        res.redirect('/user/get/login')
        res.render("login", { title: "Вход" });
    }
    catch (e) {
        console.log(e)
        res.render("error", { title: 'Такой адрес уже зарегистрирован' })
    }
})

router.get('/me', (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/user/login')
    }
    next()
},
    (req, res) => {
        res.render('profile', { user: req.user, title: 'Ваш профиль' })
    })
    
export default router;