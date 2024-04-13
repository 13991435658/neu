const loginServer = require('../models/login')
const JWT = require('../jwt/jwtconfig')
const loginCtrl = {
    login: async (req, res) => {
        const [result] = await loginServer.verify(req.body)
        if (result.length) {
            const accessToken = JWT.sign(result[0], '12h')
            const refreshToken = JWT.sign({...result[0],refreshToken:'true'}, '7d')
            res.send({
                ok: 1,
                accessToken,
                refreshToken,
                userInfo: result[0],
            })
        } else {
            res.send({
                ok: 0,
                message: '账号密码错误'
            })
        }
    }
}

module.exports = loginCtrl