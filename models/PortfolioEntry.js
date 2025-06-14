const mongoose = require('mongoose');

const PortfolioEntrySchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  value: { type: Number, required: true },
  profitLoss: { type: Number, required: true },
  profitLossPercentage: { type: Number, required: true },
  lastUpdated: { type: Date, required: true }
}, { _id: true });

module.exports = PortfolioEntrySchema;
