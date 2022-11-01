const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/ApiError');

class UserService {
    async registration(email, password, walletAddress, name) {
        const candidate = await userModel.findOne({email});
        const candidateWallet = await userModel.findOne({walletAddress});
        // Проверяем, есть ли email и кошелек в БД
        if (candidate && candidateWallet) {
            throw ApiError.badRequest(`Пользователь с почтовым адресом ${email} или кошельком уже существует`);
        }
        //перед регистрацией подключение MetaMask, получение номера кошелька, если такой кошелек зареган, то доступа нет, если нет, то идем дальше к email??????? Или наоборот??
        const hashPassword = await bcrypt.hash(password, 3); //хэшируем пароль
        const activationLink = uuid.v4(); // генерация ссылки активации для письма на email

        const user = await userModel.create({email, password: hashPassword, walletAddress, name, activationLink}); // сохраняем польз-ля в БД
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user); //id, email, isActivated, walletAddress, name Отправляем письмо для активации
        const tokens = tokenService.generateTokens({...userDto}); // генерируем JWT токены payload=userDto
        await tokenService.saveToken(userDto._id, tokens.refreshToken); // сохраняем рефреш токен в БД

        // возвращаем инфу о польз-ле и токены
        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await userModel.findOne({activationLink});
        if (!user) {
            throw ApiError.badRequest('Некорректная ссылка активации');
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password, walletAddress) {
        const user = await userModel.findOne({email});
        const userWallet = await userModel.findOne({walletAddress});
        if (!user && !userWallet) {
            throw ApiError.badRequest('Пользователь с таким email и кошельком не найден')
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) {
            throw ApiError.badRequest('Неверный пароль')
        }
        const userDto = new UserDto(user); //генерируем dto, выбрасываем из модели всё ненужное
        const tokens = tokenService.generateTokens({...userDto}); // генерируем JWT токены
        await tokenService.saveToken(userDto.id, tokens.refreshToken); // сохраняем рефреш токен в БД

        // возвращаем инфу о польз-ле и токены
        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.unauthorizedError();
        }
        const user = await userModel.findById(userData._id)
        // код ниже можно вынести в отдельную функцию
        const userDto = new UserDto(user); //генерируем dto, выбрасываем из модели всё ненужное
        const tokens = tokenService.generateTokens({...userDto}); // генерируем JWT токены
        await tokenService.saveToken(userDto._id, tokens.refreshToken); // сохраняем рефреш токен в БД

        // возвращаем инфу о польз-ле и токены
        return {
            ...tokens,
            user: userDto
        }
    }

    async getAllUsers() {
        const users = await userModel.find();
        return users;
    }
}

module.exports = new UserService();
