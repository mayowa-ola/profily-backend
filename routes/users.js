//Express  
const express = require('express');
const router = express.Router();
//Config module
const config = require('config');
//Dependency
const _ = require('lodash');
const bcrypt = require('bcrypt');
const moment = require("moment");
const passport = require('passport');
const upload = require('multer');
const cloudinary = require('cloudinary');
const jwt = require('jsonwebtoken');

cloudinary.config({
    cloud_name: config.get('CLOUDINARY_DOMAIN'),
    api_key: config.get('CLOUDINARY_API_KEY'),
    api_secret:config.get('CLOUDINARY_API_SECRET'),
})
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename : function (req, file, cb) {
        cb(null, new Date().getTime()+'-'+file.originalname);
    }
});
//Middlewares
const asyncMiddleware = require("../middleware/async");
const upload = multer({storage: storage});

//Models
const {User,validate} = require('../models/Users');


router.post('/login',
    passport.authenticate('local'),
    function (req, res) {
        const user = req.user;
        const jwtPrivateKey = config.get('jwtPrivateKey');
        const token = jwt.sign({_id: user._id, email: user.email, name: user.name, photos: user.photos}, jwtPrivateKey);
        res.send(token);
 }
);

router.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    }),
  );
  
router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: config.get('CLIENTDOMAIN'),
    }),
    function (req, res) {
        const user = req.user;
        // return res.status(200).json(req.user);
        const jwtPrivateKey = config.get('jwtPrivateKey');
        const token = jwt.sign({_id: user._id, email: user.email, name: user.name, photos: user.photos}, jwtPrivateKey);
        res.send(token); 
 }
);

router.post('/register', asyncMiddleware(async(req,res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const {name, email, password} = req.body;

    let user = await User.findOne({email});   
    if(user) return res.status(400).send('This email address alredy exists')

    user = new User (_.pick(req.body,['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.date = moment().toJSON(),
    await user.save();

    res.send(user);

}));

//Get all the  within the application
router.get('/logout', asyncMiddleware(async(req,res) => {
    
    req.logout();
    res.send('Log out successfully');
}));

router.get("/:id", asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.params.id).select("-__v");
  
  if (!user)
      return res
      .status(404)
      .send("The User with the given ID was not found.");
  
  res.send(user);
}));

router.put("/upload/:id", upload.array('photos', 100), asyncMiddleware(async (req, res) => {
    // console.log(req);
    // if(!req.files || !req.file) return res.status(400).send('Please upload a profile picture');
    const urls = [];
    for(const files of req.files) {
        const {path} = files
        const newPath = await cloudinary.uploader.upload(path);
        urls.push(newPath.url);
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {$push:{
        photos: urls,
      }},
      { new: true,
        useFindAndModify: false 
      }
    );
  
    if (!user)
      return res
        .status(404)
        .send("The User with the given ID was not found.");
  
    
    res.send(user);
}));

module.exports = router;