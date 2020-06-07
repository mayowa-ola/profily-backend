//This Asyncmiddleware is our global try and catch function that takes the request from our router and passes it to our middleware
function asyncMiddleware (handler){
    return async (req,res,next) =>{
        try{
            await handler(req,res)
        }
        catch(ex) {
            next(ex)
        }
    }
}

module.exports = asyncMiddleware