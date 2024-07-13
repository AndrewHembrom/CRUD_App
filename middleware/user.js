const { User } = require("../db/index");

//
function userMiddleware(req, res, next) { 
    const username = req.header.username;
    const password = req.header.password;
    User.findOne({
        username: username,
        password: password,
    })
        .then(function (value) { 
            if (value) {
                next();
            } else { 
                res.status(403).json({
                    "msg":"User does not exist"
                })
            }
        })
}

module.exports = userMiddleware;