const jsonwebtoken = require("jsonwebtoken")

const {jwtSecret} = require("../config")

const createJWT = ({payload}) => {
    const token = jsonwebtoken.sign(payload, jwtSecret,{expiresIn : "8h"});
    return token
}

const isTokenValid = ({token}) => jsonwebtoken.verify(token, jwtSecret)

module.exports = {
    isTokenValid, 
    createJWT
}