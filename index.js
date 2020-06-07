//EXPRESS & DEPENDENCIES
const config = require('config');
const express = require('express');
const passport = require('passport');

let app = express();

// Passport Config
require('./config/passport')(passport);

//ENSURES A JWTPRIVATE KEY IS DEFINES BEFORE APPLICATION CAN RUN
if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads',express.static('uploads'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

//STARTUP ROUTES
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/prod')(app);


const port = process.env.PORT || 3001;
app.listen(port, ()=> console.log(`Listening on port ${port}`))

