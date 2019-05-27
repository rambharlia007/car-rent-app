  const google = {
    clientID:
      "9966865858-fq2it5vet72cbc19ar7okd7dhr7me2n6.apps.googleusercontent.com",
  }
  const facebook = {
    clientID:
      "672412126506217"
  }
  const mongodb = {
    dbURI:
      "mongodb+srv://rambharlia:11gaei5034@cluster0-rjpcq.mongodb.net/recruiter-app?retryWrites=true"
  }



const production = {
  server : "https://adi-app.herokuapp.com",
  google,
  mongodb,
  facebook
}
const dev = {
  server : "http://localhost:5000",
  google,
  mongodb,
  facebook
}

if(process.env.NODE_ENV === 'production'){
  module.exports = production
}else{
  module.exports = dev
}

