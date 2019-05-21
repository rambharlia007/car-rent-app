const google = {
  clientID:
    "225239235499-2kcl83lbn7tdga1rhahkg62k5qm9i1ii.apps.googleusercontent.com",
  clientSecret: "2LGCjFhFqsevbzFw4qnXaNIQ"
};
const mongodb = {
  dbURI:
    "mongodb+srv://rambharlia:11gaei5034@cluster0-rjpcq.mongodb.net/adi-app?retryWrites=true"
};

const production = {
  server: "https://devon-recruiter-app.herokuapp.com",
  google,
  mongodb
};
const dev = {
  server: "http://localhost:5000",
  google,
  mongodb
};

if (process.env.NODE_ENV === "production") {
  module.exports = production;
} else {
  module.exports = dev;
}
