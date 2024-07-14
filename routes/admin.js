const { Router } = require('express');
const adminMiddleware = require("../middleware/admin");
const router = Router();
const  { Admin, Course } = require("../db/index")


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

router.post('/courses', adminMiddleware, async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    try { 
        const existingCourse = Course.findOne({
            title,
            description
        });
        if (existingCourse) {
            res.status(400).json({
                "msg": "Course with this title already exists."
            });
        }
        
        const newCourse = await Course.create({
            title: title,
            description: description,
            price: price,
            imageLink: imageLink
        });
        res.json({
            "msg": "Course created successfully",
            courseId: newCourse._id
        });
    } catch (error) {
        res.status(500).json({
            "msg": "Error creating course",
            error: error.message
        })
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    const allCourses = await Course.find({});
    res.json({
        courses: allCourses
    })
});

module.exports = router;