const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${Date.now()}_${file.originalname}`)
    }
})
  
  const upload = multer({ storage: storage }).single("file");

//@route POST api/users
//@desc Test route
//@access Public
router.get("/test", (req, res) => {
    console.log("caled");
    res.send("test");
});
router.post("/uploadfile", async (req,res)=>{
    
    //See if user exists
    try{
        upload(req, res, err => {
            if (err) return res.status(500).json({ err });

            return res.json({ videoLink: res.req.file.path, videoSaving: false });
        });
    }
    
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }


    
});

module.exports=router;