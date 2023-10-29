const mongoose = require('mongoose')
const shortid = require ('shortid')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const User = new Schema({
    _id: {
      type: String,
      default: shortid.generate
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      unique: true,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    created_at: {
       type: Date,
       default: new Date()
    }

});

User.pre('save', async function(next) {
  user = this;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
})

User.methods.validatePassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

const UserModel = mongoose.model('User', User);


module.exports = UserModel;