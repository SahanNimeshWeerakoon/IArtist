const express=require('express');
const router= express.Router();
const auth=require("../../middleware/auth");
const {check, validationResult}= require("express-validator");

const Item = require("../../models/Item");

//@route POST api/item
//@desc Add a post
//@access Private
router.get("/", async (req, res) => {
    let items = await Item.find({});
    return res.json(items);
});

//@route POST api/item
//@desc Add a post
//@access Private
router.post("/",[auth,[check("name","Name is required").not().isEmpty()]],async(req,res)=>{
    let { name, user, video } = req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        
        const newItem = new Item({
            name,
            user,
            video
        });

        const savedItem = await newItem.save();

        return res.json(savedItem);
    } catch (err) {
        return res.status(500).send("Server error");
    }
    

});

router.get("/:id", async(req, res) => {
    let item = await Item.findOne({ _id: req.params.id });
    return res.json(item);
});

router.delete("/:id", async(req, res) => {
    let { id } = req.params;
    await Item.deleteOne({ _id: id });
    return res.json(id);
});

module.exports=router;