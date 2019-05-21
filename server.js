const express = require("express");
const authRoutes = require("./routes/auth-routes");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const bodyParser = require("body-parser");

const path = require("path");

const _ = require("underscore");

const User = require("./models/user-model");

var async = require("async");
const cors = require("cors");

const app = express();

app.use(cors());

// initialize passport
app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

mongoose
  .connect(keys.mongodb.dbURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// set up routes
app.use("/auth", authRoutes);

app.get(
  "/login",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find({}, function(err, users) {
      if (err) res.status(500).send("Internal server error");
      else {
        res.status(200).send(users);
      }
    });
  }
);

app.get("/facebook", (req, res) => {});

app.get(
  "/google",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.params.id, function(err, users) {
      if (err) res.status(500).send("Internal server error");
      else {
        res.status(200).send(users);
      }
    });
  }
);

app.post("/register", (req, res) => {
  var interviewee = new Interviewee(req.body);
  interviewee
    .save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

//Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

var server = app.listen(port, () => {
  console.log(`app now listening for requests on port ${port}`);
});
