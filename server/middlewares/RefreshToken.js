const JWT = require("../jwt/jwtconfig")

const RefreshToken = (req,res)=>{
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({ error: '缺少刷新令牌' });
    }
    try {
        const decoded = JWT.verify(refreshToken);
        delete decoded.iat
        delete decoded.exp
        decoded.time = Date.now()
        if (!decoded) {
            return res.status(401).json({ error: '无效的刷新令牌' });
        }
        const newAccessToken = JWT.sign(decoded,'5h');
        const newRefreshToken = JWT.sign(decoded,'7d');
        res.send({
            newAccessToken,
            newRefreshToken
        })
    } catch (error) {
        console.error(error);
    }
}

module.exports = RefreshToken