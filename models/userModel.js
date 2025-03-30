const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['Donor', 'NGO'],
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: String },
  },
//   donorDetails: {
//     type: Schema.Types.ObjectId,
//     ref: 'Donation', 
//   },
//   ngoDetails: {
//     type: Schema.Types.ObjectId,
//     ref: 'NgoProfile', 
//   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.plugin(passportLocalMongoose);


const User = mongoose.model('User', userSchema);

module.exports = User;
