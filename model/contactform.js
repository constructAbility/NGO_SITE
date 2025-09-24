const mongoose=require('mongoose');

const ContactSchema=mongoose.Schema({
full_name:{type:String ,required:true},
phone_number:{type:Number, required:true},
email:{type:String, required:true},
resone:{type:String}
});

module.exports = mongoose.model('contactform', ContactSchema);