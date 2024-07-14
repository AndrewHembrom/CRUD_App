const { Router } = require('express');
const userMiddleware = require("../middleware/user");
const router = Router();
const { User, Course } = require("../db/index");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const mongoose = require('mongoose');

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({
                "msg": "User already exists"
            })
        }

        await User.create({
            username,
            password,
        });
        res.json({
            "msg": "User created successfully"
        });
    } catch (error) { 
        res.status(500).json({
            "msg": "Error creating User",
            error: error.message
        })
    }
});

router.post('/signin', async (req, res) => { 
    const username = req.body.username;
    const password = req.body.password;

    const userValidated = await User.find({
        username,
        password
    })

    if (userValidated) { 
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
})

router.get('/courses', async (req, res) => {
    const allCourses = await Course.find({});
    res.json({
        courses: allCourses
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const courseId = req.params.courseId;
    const username = req.username;

    await User.updateOne({
        username: username
    }, {
        "$push": {
            purchasedCourses: new mongoose.Types.ObjectId(courseId)
        }
    });
    res.json({
        "msg":"Purchased Course successfully"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const user = await User.findOne({
        username: req.username
    });

    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });

    res.json({
        courses: courses
    })
});

module.exports = router;