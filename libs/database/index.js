var mongoose = require('mongoose');

mongoose.set('debug', true)

mongoose.connect("mongodb://ten:project@linus.mongohq.com:10039/ten");
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function callback () {
  console.log("Mongoose Connection Open");
});

var slideSchema = mongoose.Schema({
  title: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  remarks: {type : String, trim : true},
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  location: { type: [] },
  source_url: {type : String, trim : true},
  status: { type: String, default: 'submitted' },
  time_created: { type: Date, default: Date.now },
  time_modified: { type: Date, default: Date.now }
});

var userSchema = mongoose.Schema({
  username: {type : String, default : '', trim : true},
  password: {type : String, default : '', trim : true},
  email: {type : String, trim : true},
  time_created: { type: Date, default: Date.now },
});

userSchema.methods.validPassword = function (password) {
  return this.password == password;
};

module.exports = {
  Slide: mongoose.model('Slide', slideSchema),
  User: mongoose.model('User', userSchema)
};