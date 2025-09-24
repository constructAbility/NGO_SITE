const mongoose=require('mongoose');

const Schema=mongoose.Schema({
name:{type:String ,required:true},
phone_number:{type:Number, required:true},
email:{type:String, required:true},

});

module.exports = mongoose.model('donetform', Schema);