const { Admin } = require("../db/index");

// Middleware for handling auth
function adminMiddleware(req, res, next) { 
    const username = req.header.username;
    const password = req.header.password;
    Admin.findOne({
        username: username,
        password: password,
    })
        .then(function (value) { 
            if (value) {
                next();
            } else { 
                res.status(403).json({
                    "msg":"Admin does not exist"
                })
            }
        })
}

module.export = adminMiddleware;
