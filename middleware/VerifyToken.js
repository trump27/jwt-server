var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {

  const bearerHeader = req.headers['authorization'];
  let bearerToken = '';
  if (typeof bearerHeader !== 'undefined') {
    bearerToken = bearerHeader.split(' ')[1]
  }

  // console.log('req.cookies.token', req.cookies.token)

  // token from
  // headers['authorization'], headers['x-access-token'],　url parameters, post parameters
  // var token = bearerToken || req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
  var token = bearerToken || req.body.token || req.query.token || req.headers['x-access-token'] ;

  console.log('token', token)

  if (token) {

    // check token
    jwt.verify(token, config.secret, function (error, decoded) {
      if (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      } else {
        // 認証に成功したらdecodeされた情報をrequestに保存する
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // Unauthorized(401)
    return res.status(401).send({
      success: false,
      message: 'No token provided.',
    });

  }
}
module.exports = verifyToken;