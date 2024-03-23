const jwt = require("jsonwebtoken");
const { secret } = require("../config.js");

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token = req.headers.authorization.split(" ")[1];
            console.log(token);
            if (!token) {
                return res.status(403).json({ message: "пользователь не авторизован" });
            }
            const decodedToken = jwt.verify(token, secret);
            
            const userRoles = decodedToken.roles;
            console.log(userRoles)
            if (!userRoles || !Array.isArray(userRoles)) { // Проверка на undefined и тип массива
                return res.status(403).json({ message: "Не удалось получить роли пользователя из токена" });
            }
            let hasRole = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                return res.status(403).json({ message: "У вас нет доступа" });
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({ message: "Не удалось проверить авторизацию" });
        }
    };
};