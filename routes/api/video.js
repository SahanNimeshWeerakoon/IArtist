const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'_'+file.originalname);
  }
})

const upload = multer({ storage: storage }).single('file');

//@route POST api/users
//@desc Test route
//@access Public
router.post("/uploadfile", (req,res)=>{
  upload(req, res, function (err) {
    if(err) {
      return res.status(500).json({ status: false, msg: "something went wrong" });
    } else {
      return res.json({ status: true, msg: `Successfully added ${req.file.originalname}`, videoLink: req.file.path });
    }
  })
});

module.exports=router;