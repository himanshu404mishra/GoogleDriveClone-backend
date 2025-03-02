const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// ? using for validating form data
const { body, validationResult } = require("express-validator");

/* route strucutre: /user/test */

router.get("/register", (req, res) => {
    res.render("register");
});
router.post(
    "/register",

    body("email").trim().isEmail().isLength({ min: 12 }),
    body("password").trim().isLength({ min: 5 }),
    body("username").trim().isLength({ min: 3 }),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid Data'
            });
        }
        
        const { username, email, password } = req.body;

        const hashPassword = await bcrypt.hash(password,10)

        const newUser = await userModel.create({username,email,
            password: hashPassword
        })
        res.json(newUser)
    }
);

router.get("/login", (req,res)=>{
    res.render("login")
})
router.post("/login", 
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({min:5}),

    async (req,res)=>{
    
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array(),
            message:"Invalid User"
        })
    }

    const {username, password}= req.body;

    const user = await userModel.findOne({
        username,
    })
    if(!user) return res.status(400).json({message:"username or password is incorrect"})

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(400).json({message: "username or password is incorrect"})

    
    //! json web token
    
    const token = jwt.sign({
        userId: user._id,
        email: user.email,
        username: user.username
    },
    process.env.JWT_SECRET,
    )
    res.cookie('token',token)

    res.send("loggen in")

})


module.exports = router;
