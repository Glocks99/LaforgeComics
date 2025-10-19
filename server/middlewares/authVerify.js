const jwt = require("jsonwebtoken")

const verify = async(req,res, next) => {
    const {comicsToken} = req.cookies

    if(!comicsToken){
        return res.json({success: false, msg: "Unauthorized, login again!"})
    }

    try {
        const decode = jwt.verify(comicsToken, process.env.JWT_SECRET)

        if(decode?.id){
            req.user = {id: decode.id}
            next()
        }
        else{
            return res.json({success: false, msg: "Invalid token payload"})
        }
        
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }
}

module.exports = {verify}