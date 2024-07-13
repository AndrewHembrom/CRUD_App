const { Router } = require('express');
const adminMiddleware = require("../middleware/admin");
const router = Router();
const  { Admin } = require("../db/index")


router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const existingAdmin = await Admin.findOne({
            username: username,
        });

        if (existingAdmin) {
            res.status(400).json({
                msg: "Admin already exits"
            });
        }

        await Admin.create({
            username: username,
            password: password,
        });

        res.json({
            msg: "Admin created successfully"
        })
    } catch (error) { 
        res.status(500).json({
            msg: "Error creating user",
            error: error.message
        });
    }
});

// router.post('/courses', adminMiddleware, (req, res) => {

// });

// router.get('/courses', adminMiddleware,(req, res) => {

// });

module.exports = router;