const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {uploadToSupabase, supabase} = require("../config/supabase.config");

const filesModel = require("../models/files.model");


router.get("/", (req,res)=>{
    res.send("Goto /home for home page, or /users/login for login page")
})

router.get("/home", authMiddleware, async (req, res) => {
    const userFiles = await filesModel.find({
        user: req.user.userId,
    });

    res.render("home", {
        files: userFiles,
    });
});

router.post(
    "/upload",
    authMiddleware,
    upload.single("file"),
    async (req, res) => {
        let uploadData = await uploadToSupabase(
            req.file.buffer,
            req.file.originalname,
            {
                contentType: req.file.mimetype
            }
        );
        let newFile = {};

        if (!uploadData.error) {
            newFile = await filesModel.create({
                path: uploadData.data.path,
                originalName: req.file.originalname,
                user: req.user.userId,
            });
        } else if (uploadData.error.error == "Duplicate") {
            uploadData = await uploadToSupabase(
                req.file.buffer,
                Date.now() + req.file.originalname,
                {
                    contentType: req.file.mimetype
                }
            );
            newFile = await filesModel.create({
                path: uploadData.data.path,
                originalName: req.file.originalname,
                user: req.user.userId,
            });
        }

        res.status(200).json({ newFile, uploadData });
    }
);

router.get("/download/:path", authMiddleware, async (req, res) => {
    const path = decodeURIComponent(req.params.path);
    const loggedInUserId = req.user.userId;

    // ? const path = req.params.path; -> see below for explanation
    // ! this thing would work if the route is router.get("/download/uploads/:path") but it doesn't come that way from the frontend and also for this way we need to change the logic of uploading which would take unwanted extra time to complete

    console.log(path);
    
    const file = await filesModel.findOne({
        user: loggedInUserId,
        path: path,
    });
    if (!file) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    
    const { data, error } = await supabase
    .storage
    .from('drive-data')
    .createSignedUrl(path, 60);


    res.redirect(data.signedUrl)
});

module.exports = router;
