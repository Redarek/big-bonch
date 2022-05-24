const Router = require('express')
const router =  new Router()
const controller = require('./authController')
const { check } = require('express-validator')
const authMiddleware = require('./middlewaree/authMiddleware')
const roleMiddleware = require('./middlewaree/roleMiddleware')
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/registration', 
    [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('username', "Имя пользователя должно быть от 4 до 10 символов").isLength({min:4, max:10})
    ], 
    controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['USER', 'ADMIN']), controller.getUsers)

module.exports = router