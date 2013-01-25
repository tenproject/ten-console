var mongoose = require('mongoose');

mongoose.set('debug', true)

mongoose.connect("mongodb://ten:project@linus.mongohq.com:10039/ten");
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function callback () {
  console.log("Mongoose Connection Open");
});

var slideSchema = mongoose.Schema({
  title: { type: String, required: true, default : '', trim : true },
  description: { type: String, default : '', trim : true },
  remarks: { type: String, trim : true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  location: { type: [] },
  source_url: { type: String, trim : true },
  status: { type: String, default: 'submitted', enum: ['submitted', 'rejected', 'success', 'alert', 'expired', 'online', 'offline', 'draft'] },
  time_created: { type: Date, default: Date.now },
  time_modified: { type: Date, default: Date.now }
});

var userSchema = mongoose.Schema({
  username: { type: String, lowercase: true, required: true, trim : true },
  firstname: { type: String, default : '', trim : true },
  lastname: { type: String, default : '', trim : true },
  password: { type: String, required: true, trim : true },
  email: { type: String, lowercase: true, required: true, trim : true },
  organization: { type: String, trim : true },
  time_created: { type: Date, default: Date.now },
});

var locationSchema = mongoose.Schema({
  name: { type: String, required:true, trim: true },
  building: { type: String, required: true, trim: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  remarks: { type: String },
  status: { type: String, enum: ['online', 'offline', 'warning'] }
});

userSchema.methods.validPassword = function (password) {
  return this.password == password;
};

module.exports = {
  Slide: mongoose.model('Slide', slideSchema),
  User: mongoose.model('User', userSchema),
  Location: mongoose.model('Location', locationSchema)
};