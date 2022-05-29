const express=require('express');
const router= express.Router();
const auth=require("../../middleware/auth");
const {check, validationResult}= require("express-validator");

const Post= require("../../models/Post");
const Profile= require("../../models/Profile");
const User= require("../../models/User");


//@route POST api/post
//@desc Add a post
//@access Private
router.post("/",[auth,[check("text","Text is required").not().isEmpty()]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        
        const user=await User.findById(req.user.id).select("-password");
        if(!user){
            res.send("No User");        }
        const newPost=new Post({text:req.body.text, name:user.name, avatar:user.avatar, user:req.user.id});
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
    

});

//@route GET api/post/
//@desc Get all Posts
//@access Private
router.get("/",auth,async(req,res)=>{
    try {
        const posts=await Post.find().sort({date:-1});
        res.json(posts);
    } catch (error) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

//@route GET api/post/:post_id
//@desc Get Post by Id
//@access Private
router.get("/:id",auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({"msg":"Post not found"});
        }
        res.json(post);
    } catch (err) {
        console.log(err.message);
        if(err.kind==="ObjectId"){
            return res.status(404).json({"msg":"Post not found"});
        }
        res.status(500).send("Server error");
    }
})

//@route DELETE api/post/:id
//@desc Delete Post
//@access Private
router.delete("/:id",auth,async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id);
        
        if(!post){
            return res.status(404).json({"msg":"Post not found"});

        }
        //Check user
        if(post.user.toString()!==req.user.id){
            return res.status(401).send("User is not authorized");
        }
        await post.remove();
        res.send("Delete successfully");
    } catch (error) {
        console.log(error.message);
        if(error.kind==="ObjectId"){
            return res.status(404).json({"msg":"Post not found"});
        }
        res.status(500).send("Server error");
    }
})

//@route PUT api/posts/like/:id
//@desc Like a Post
//@access Private
router.put("/like/:id",auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);

        //Check that the post has already liked
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
            return res.status(400).send("Post already liked");
            
        }
        const likeuser={user:req.user.id};
        post.likes.unshift(likeuser);
        post.save();
        res.json(post.likes);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
})

//@route PUT api/posts/unlike/:id
//@desc Like a Post
//@access Private
router.put("/unlike/:id",auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);

        //Check that the post has already liked
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
            return res.status(400).send("Post has not been liked");
            
        }
        const removeIndex=post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex,1);
        await post.save();
        res.json(post.likes);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
})

//@route POST api/posts/comment/:id
//@desc Comment on the post by ID
//@access Private
router.post("/comment/:id",[auth,[check("text","Text is required").not().isEmpty()]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user=await User.findById(req.user.id);
        const post=await Post.findById(req.params.id);

        const newComment=new Post({text:req.body.text, name:user.name, avatar:user.avatar, user:req.user.id});
        
        post.comments.unshift(newComment);
        
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
    

});

//@route DELETE api/posts/comment/:id/comment_id
//@desc Delete comment on the post by ID
//@access Private
router.delete("/comment/:id/:comment_id",auth,async(req,res)=>{
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send("No post id found");
        }
        const post=await Post.findById(req.params.id);
        if(!post){return res.status(400).send("No post id found");}
        const removeId=post.comments.map(a=>a.id.toString()).indexOf(req.params.comment_id);
        if(removeId==-1){return res.status(400).send("No comment id found");}

        const comment=post.comments.find(a=>a.id=req.params.comment_id);
        if(comment.user.toString()!==req.user.id){
            return res.status(401).send("Unauthorized user");
        }
        
        post.comments.splice(removeId,1);
        
        await post.save();
        return res.json(post.comments);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Server error");
    }
    

});


module.exports=router;