//MONGOOSE
const mongoose = require('mongoose');
//DEPENDENCIES
const Joi = require('@hapi/joi');

//STUDENT MONGOOSE SCHEMA
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        minlength:3
    },
    email: {
        type:String,
        required:true,
    },
    password: {
        type:String,
    },
    photos: {
        type:Array,
    }
});
 
const User = mongoose.model('users', userSchema);




const validateUser = user => {
    const schema= {
        name: Joi.string().min(3).required(),
        email: Joi.string().email().min(11).required(),
        password: Joi.string().min(3).required(),
        picture:Joi.any()
    };
   return  Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;