const { Router } = require('express');
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require("../db/index")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config');


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

router.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const adminValidated = await Admin.find({
        username,
        password
    })

    if (adminValidated) {
        const token = jwt.sign({
            username
        }, JWT_SECRET);

        res.json({
            token
        })
    } else {
        res.status(411).json({
            "msg": "Incorrect Username or password"
        })
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    const { title, description, price, imageLink } = req.body;

    try { 
        const existingCourse = await Course.findOne({ title, description });
        console.log(existingCourse);
        if (existingCourse) {
            return res.status(400).json({
                msg: "Course with this title already exists."
            });
        }
        
        const newCourse = await Course.create({ title, description, price, imageLink });

        res.json({
            msg: "Course created successfully",
            courseId: newCourse._id
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error creating course",
            error: error.message
        });
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    const allCourses = await Course.find({});
    res.json({
        courses: allCourses
    })
});

module.exports = router;