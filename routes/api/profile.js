const express=require('express');
const router= express.Router();
const auth=require("../../middleware/auth");
const {check, validationResult}= require("express-validator");
const config=require('config');
const request=require('request');


const Profile= require("../../models/Profile");
const User= require("../../models/User");
const Post= require("../../models/Post");


//@route GET api/profile/me
//@desc Get current User Profile
//@access Private
router.get("/me",auth,async(req,res)=>{
    try{
        const profile= await Profile.findOne({user:req.user.id}).populate("user",['name','avatar']);
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    }
    catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

//@route POST api/profile
//@desc Create and Update User's Profile
//@access Private
router.post("/",[auth,[check('status', "Status is required").not().isEmpty(), check('skills', 'Skills is required').not().isEmpty()]], async(req,res)=>{
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    
    try{
        let profile= await Profile.findOne({user: req.user.id});

        if(profile){
            //Update
            profile= await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true});
            return res.json(profile);
        }

        //Create
        profile=new Profile(profileFields);
        await profile.save();
        return res.json(profile);

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
//@route GET api/profile
//@desc Acess to all users'profile
//@access Public
router.get("/",async(req,res)=>{
    try{
        const profiles= await Profile.find().populate("user",['name','avatar']);
        res.json(profiles);
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Server error");
    }
})

//@route GET api/profile/user/:user_id
//@desc Get profile by user ID
//@access Public
router.get("/user/:user_id",async(req,res)=>{
    try{
        const profile= await Profile.findOne({user:req.params.user_id}).populate("user",['name','avatar']);
        if(!profile){
            return res.status(400).json({ msg: 'Profile not found' });

        }
        res.json(profile);
    }
    catch(err){
        console.log(err);
        if(err.kind=="ObjectId"){
            return res.status(400).json({ msg: 'Profile not found' });

        }
        return res.status(500).send("Server error");
    }
})

//@route DELETE api/profile/
//@desc Delete Profile, User and Post
//@access Private
router.delete("/",auth,async(req,res)=>{
    try{

        //delete User's Posts
        await Post.deleteMany({user: req.user.id});

        //delete Profile
        await Profile.findOneAndDelete({user:req.user.id});
        
        //delete User
        await User.findOneAndDelete({_id:req.user.id});
        res.json({msg: "User is deleted"});
    }
    catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

//@route PUT api/profile/experience
//@desc Add Profile's Experience
//@access Private
router.put("/experience",[auth,[check('title',"Title is required").not().isEmpty(),check('company',"Company is required").not().isEmpty(),check('from',"From date is required").not().isEmpty()]], async(req,res)=>{
const errors=validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
}
const{title, company,location, from, to, current, description}=req.body;
const newExp={title, company,location, from, to, current, description};
try{
    const profile=await Profile.findOne({user:req.user.id});

    profile.experience.unshift(newExp);

    await profile.save();
    res.json(profile);

}
catch(err){
    console.log(err.message);
    res.status(500).send("Server error");
}

})

//@route DELETE api/profile/experience/:exp_id
//@desc DELETE Experience from Profile
//@access Private
router.delete("/experience/:exp_id",auth,async(req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id});
        const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id);

        if (removeIndex!==-1){
            profile.experience.splice(removeIndex,1);
            await profile.save();
            res.json(profile);
        }
        else{
            res.status(500).send("No experience found");
        }
    }
    catch(err){
        console.log(err.message);
    res.status(500).send("Server error");
    }
})

//@route PUT api/profile/education
//@desc Add Profile's Education
//@access Private
router.put("/education",[auth,[check('school',"School is required").not().isEmpty(),check('degree',"Degree is required").not().isEmpty(),check('fieldofstudy',"Field of study is required").not().isEmpty(),check('from',"From date is required").not().isEmpty()]], async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const{school, degree,fieldofstudy, from, to, current, description}=req.body;
    const newEdu={school, degree,fieldofstudy, from, to, current, description};
    try{
        const profile=await Profile.findOne({user:req.user.id});
    
        profile.education.unshift(newEdu);
    
        await profile.save();
        res.json(profile);
    
    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
    
    })
    
    //@route DELETE api/profile/education/:edu_id
    //@desc DELETE Education from Profile
    //@access Private
    router.delete("/education/:edu_id",auth,async(req,res)=>{
        try{
            const profile=await Profile.findOne({user:req.user.id});
            const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.edu_id);
            profile.education.splice(removeIndex,1);
            await profile.save();
            res.json(profile);
        }
        catch(err){
            console.log(err.message);
        res.status(500).send("Server error");
        }
    })

    //@route GET api/profile/github/:username
    //@desc Show User's github repos
    //@access Public
    router.get("/github/:username",(req,res)=>{
        try {
            const options={
                uri:`https://api.github.com/users/${
                    req.params.username
                  }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                    'githubClientId'
                  )}&client_secret=${config.get('githubSecret')}`,
                method: "GET",
                headers:{"user-agent":"node.js"}
            }
            request(options,(error,response,body)=>{
                if(error){console.log(error);}
                if(response.statusCode!==200){
                    res.status(404).json({"msg":"No Github profile found"});
                }
                res.json(JSON.parse(body));
            })
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server error");
        }
    })

module.exports=router;