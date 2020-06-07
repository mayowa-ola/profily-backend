const helmet = require('helmet');
const compression = require('compression');

//Production function to secure our end point using helment and compress our js files using compression
module.exports = function(app) {
    app.use(helmet());
    app.use(compression());
}