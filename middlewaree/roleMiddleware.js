const jwt = require('jsonwebtoken')
const { secret } = require('../config')

module.exports = function (roles) {
    return function (req, res, next) {
        if(req.method == "OPTIONS") {
            next
        }
    
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }
            const {roles: userRoles} = jwt.verify(token, secret) //расшифровка токена
            let hasRole = false
            userRoles.forEach(role => {
                if(roles.includes(role)) { //проверяем, содержит ли массив ролей пользователя, хотя бы одну роль, которая разрешена для данной функции
                    hasRole = true
                }
            })
            if (!hasRole) {
                return res.status(403).json({message: "У вас нет доступа"})
            }
            next()
        } catch (e) {
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
}