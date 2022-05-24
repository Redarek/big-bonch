const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('./config') //импорт секрета для токена
const generateAccessToken = (id, roles) => { //генерация токена доступа
    const payload = { //передаем id и roles из БД как данные в токен
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"}) //секрет из config.js, время жизни токена 24 часа
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req) //ответ на валидацию
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const {username, walletAddress} = req.body; //вытягиваем кошелек и username
            const candidate = await User.findOne({username}) //проверяем есть ли такой username в БД
            if (candidate) {
                //return res.status(400).json({message: "Пользователь с таким именем уже существует"})
                return res.sendFile(__dirname + '/client/index.html')
            }
            const hashWalletAddress = await bcrypt.hash(walletAddress, 3) //хэш кошелька, чтобы не хранилось в открытом виде
            const userRole = await Role.findOne({value: "USER"}) //ищем роль для user
            const user = new User({walletAddress, username, roles: [userRole.value]}) //создаем юзера
            await user.save() //сохраняем юзера
            return res.json({message: "Пользователь успешно зарегистрирован"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {walletAddress, username} = req.body //вытягиваем адрес кошелька и username из запроса
            const user = await User.findOne({username}) //проверяем есть ли такой username в БД
            if (!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            const validWalletAddress = await bcrypt.compare(walletAddress, user.walletAddress) //проверяем кошелек. Передаем введенный кошелек и хэш из БД
            if (!validWalletAddress){
                return res.status(400).json({message: "Пользователь с таким Metamask не найден"})
            }
            const token =  generateAccessToken(user._id, user.roles) //генерация токена
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Login error"})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            
        }
    }
}

module.exports = new authController()