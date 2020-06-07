const express = require('express');

//API ROUTES
const user = require('../routes/users');



 function routes(app){
    app.use(express.json());
    app.use('/api/users', user);
}

module.exports = routes
