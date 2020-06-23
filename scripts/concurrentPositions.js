const exchange = require('./exchange')
const { pairWatch } = require('./pairManager')
const databaseManager = require('./databaseManager')
const concurrentPositons = {}

concurrentPositons.start = async () => {
  // looks up draftPositions, starts position
  const positions = await databaseManager.lookup()
  console.log(positions);
  positions.forEach((position) => {
    concurrentPositons.position(position)
  })
}

concurrentPositons.position = async (draftPosition) => {
  // While loop variables:
  let dbPosition
  let stopPlaced = false
  let positionEntered = false
  // define isShort
  let isShort = draftPosition.entry < draftPosition.stop
  console.log('position is short?', isShort);
  // Get entry order Information
  const entryOrderInfo = await exchange.getEntryInfo()
  // start loop
  let go = true
  while (go) {
    // Start tracking pair price
    function getPairsPrices(draftPosition) {
      return new Promise((resolve) => {
        setTimeout(
          async () => {
            return resolve(await pairWatch(draftPosition))
          },
          100,
          draftPosition
        )
      })
    }
    //Get price
    let pairPrice = await getPairsPrices(draftPosition)
    console.log(pairPrice)

    // logic for checking to see if stop was breached
    if (positionEntered !== true) {
      if (
        (isShort && pairPrice > draftPosition.stop) ||
        (!isShort && pairPrice < draftPosition.stop)
      ) {
        //cancel all orders on pair
        //TODO: Error handle if orders aren't cancelled
        console.log('cancelling orders on pair')
        exchange.cancelOrdersOnpair(draftPosition)
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })

        // find db current Position and delete:
        // lookup all positions, filter by pair, delete
        databaseManager.deleteCurrentPos(draftPosition)
        // STOPS HERE
        go = false
        return
      }
    }
    // -[] TEST THIS FUNCTION

    // if position has been entered, place stop, get entry Order information and post to database
    if (stopPlaced = false && positionEntered != true) {
      if (
        (isShort && pairPrice < draftPosition.entry) ||
        (!isShort && pairPrice > draftPosition.entry)
      ) {
        console.log('placing stop')
        // place stop
        positionEntered = true
        stopPlaced = true
        const stopInfo = await exchange.stopOrder(draftPosition)
          .then(async (res) => {
            //handle error, 404: trigger price too high
            if ((res.success = false)) {
              console.log('Stop order was not placed', res)
              exitPosition(draftPosition)
              return
            }
            // console.log('stopOrder res is ', res)
            // //get Entry Order Information
            // const positionInfo = await exchange.getPositionInfo(draftPosition)
            //   .then(async (position) => {
            //     //database Entry
            //     dbPosition = await databaseManager.createPosition(
            //       draftPosition,
            //       position,
            //       returnFromEntry
            //     )
            //   })
            // console.log('the position info is', positionInfo)
          })
          .then(async () => {
            // update concurrent positions with fact that stop has been placed
            const response = await databaseManager.updateCurrentPos()
          })
          .catch((err) => {
            console.log(err)
            go = false
            return
          })

        console.log('stop placed and position entered is ', stopPlaced, positionEntered);
      }
    }

    //If stop was executed, update position in db
    // Check to see if stop order was exected
    // If so, update position

    // if (positionEntered === true) {
    //   // Get stop order Info
    //   const stopOrderInfo = await exchange.getStopInfo(draftPosition)
    //   console.log('the stopOrderInfo is ', stopOrderInfo);
    //   if (stopOrderInfo.avgFillPrice != null) {
    //     databaseManager.updatePosition(dbPosition, stopOrderInfo)
    //     // STOPS HERE
    //     go = false
    //     return
    //   }
    // }
  }
  if (!go) {
    console.log('Position function ended');
    return
  }
}

module.exports = concurrentPositons