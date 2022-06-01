const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const ItemSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    name:{
        type: String
    },
    video: {
        type: String
    }
})
module.exports=Post=mongoose.model("items",ItemSchema);