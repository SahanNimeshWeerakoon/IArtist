const express=require('express');
const router= express.Router();
const auth= require("../../middleware/auth");
const jwt = require('jsonwebtoken');
const config=require('config');
const {check, validationResult}= require("express-validator");
const bcrypt=require('bcryptjs');

const User =require('../../models/User');

//@route GET api/auth
//@desc Auth route
//@access Public
router.get("/", auth, async(req,res)=>{
    try{
        const user= await User.findById(req.user.id).select("-password");
        res.json(user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//@route POST api/auth
//@desc check username and password, give jsonwebtoken
//@access Public
router.post("/",[check('email').isEmail(), check("password").exists()], async(req,res)=>{
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }


    var {email, password}=req.body;

    try{
        const user = await User.findOne({email: email});

        if(!user){
            res.status(401).send("Invalid credential");
        }

    const isMatch=await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).send("Invalid credential");

    
    }
    //Return jsonwebtoken
    const payload={
        user:{
            id: user.id
        }
    }

    jwt.sign(payload, config.get('jwtSecret'),
    {expiresIn: 360000},(err,token)=>{
        if(err){
            return res.status(400).send(err);
        }
        return res.send({token})
    })
    //return res.json(user);
    }
    catch(err){
        return res.status(400).send(err.message);
    }

    
    


    



})
module.exports=router;