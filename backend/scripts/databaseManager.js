const Position = require('../Models/position')

function newPositionToDB(order, position) {
  //create position
  const newPosition = {
    pair: order.pair,
    positionSize: order.positionSize,
    entry: order.entry,
    stop: order.stop,
    timeframe: order.timeframe,
    averageFillPrice: position[0].recentAverageOpenPrice,
  }
  Position.create(newPosition, function (err, newlyCreated) {
    if (err) {
      console.log(err)
    } else {
      console.log(
        `the newly created position is: ${JSON.stringify(newlyCreated)}`
      )
    }
  })
  return
}

module.exports = newPositionToDB
