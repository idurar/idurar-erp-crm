const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const customerSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
       
    },
    email:{
        type: String,
   
    lowercase: true,
    trim: true,
    required: true,
    },
    mobile:{
        type:Number,
        required:true,
       
    },
  created: {
    type: Date,
    default:Date.now,
  },
    Lastlogin:{
        type:Date,
        default:Date.now,
    }   
});

module.exports = mongoose.model("Customer",customerSchema);