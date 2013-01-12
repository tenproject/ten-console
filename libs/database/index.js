var mongoose = require('mongoose');

mongoose.set('debug', true)

mongoose.connect("mongodb://ten:project@linus.mongohq.com:10039/ten");
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function callback () {
  console.log("Mongoose Connection Open");
});

var slideSchema = mongoose.Schema({
  title: 'string',
  description: 'string',
  remarks: 'string',
  author: { type: mongoose.Schema.ObjectId, ref: 'User' },
  location: { type: [] },
  source_url: { type: 'string' },
  status: { type: 'string', default: 'submitted' },
  time_created: { type: Date, default: Date.now },
  time_modified: { type: Date, default: Date.now }
});

var userSchema = mongoose.Schema({
  username: 'string',
  password: 'string',
  email: 'string'
});

userSchema.methods.validPassword = function (password) {
  console.log(password);
  return true;
};

module.exports = {
  Slide: mongoose.model('Slide', slideSchema),
  User: mongoose.model('User', userSchema)
};