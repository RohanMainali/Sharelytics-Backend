const mongoose = require('mongoose');
const PortfolioEntrySchema = require('./PortfolioEntry');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  portfolio: { type: [PortfolioEntrySchema], default: [] },
  watchlist: { type: Array, default: [] },
  notifications: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
