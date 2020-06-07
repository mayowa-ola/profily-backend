const mongoose = require('mongoose');
const config = require('config');

//CONNECTS TO THE DATABASE DEFINED IN THE CONFIG VARIABLE
module.exports =  function  () {
    const db = config.get('db');
    mongoose.connect(db, {useNewUrlParser: true})
    .then(()=> console.log(`Connected to ${db}...`))
    .catch(ex => console.log(ex));

} 