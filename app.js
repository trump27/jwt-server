/*
 * REST API server template
 */
const express = require("express"),
  session = require('express-session'),
  jwt = require("jsonwebtoken"),
  cors = require("cors"),
  morgan = require("morgan"),
  config = require("./config");
  // cookieParser = require("cookie-parser"),

const app = express();

app.use(express.json());
// app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const sess = {
  secret: 'sesssecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  // store: memoryStore
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
} else {
  app.use(morgan("dev")); // monitor
}
app.use(session(sess));


const router = express.Router();
app.use(cors());
// api prefix
app.use("/api", router);

// router
router.get("/healthcheck", function(req, res) {
  res.send({
    success: true,
    message: "check ok!"
  });
});

const UserModel = require("./app/userModel");

// create token
router.post("/login", function(req, res) {
  console.log("req.body", req.body);

  let user = UserModel.getUser({
    id: req.body.id,
    password: req.body.password
  });

  if (user) {
    let token = jwt.sign(user, config.secret, { expiresIn: "1d" });
    // cookie
    // res.cookie("token", token); // set cookie
    req.session.token = token; // set cookie

    res.status(200).json({
      success: true,
      token: token
    });
  } else {
    res.status(200).json({
      success: false,
      message: "invalid credentials"
    });
  }
});

const VerifyToken = require("./middleware/VerifyToken");

router.get("/myinfo", VerifyToken, function(req, res) {
  res.status(200).send({
    success: true,
    id: req.decoded.id,
    name: req.decoded.name
  });
});

// for test
router.get("/verifytoken", VerifyToken, function(req, res, next) {
  res.status(200).send({
    success: true,
    message: "token checked."
  });
});

// catch 404
app.use(function(req, res, next) {
  console.log("404 req.body", req.body);
  // next(createError(404));
  res.status(404).send({
    success: false,
    message: "invalid access."
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("runnin on PORT: " + port);
});

module.exports = app;
