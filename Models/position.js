const mongoose = require('mongoose')

var positionSchema = new mongoose.Schema({
  pair: String,
  positionSize: Number,
  entry: Number,
  stop: Number,
  timeframe: String,
  exchangeOrderID: Number,
  averageFillPrice: Number,
})

module.exports = mongoose.model('Position', positionSchema)