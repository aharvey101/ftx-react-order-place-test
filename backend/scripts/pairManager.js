const ftxrest = require('ftx-api-rest')
const util = require('util')
const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

// The pairwatch function should be called when the server is started,
// When a trade is made, the pair is added to the pairs array and that is watched

// We are trying to have an object stored globally containing price of pairs
// That we can use as inputs into other functions

// the function takes in the current trading pairs array and the tradingsPairsObject
// it loops over the array and for each item in the array, makes a request,
// When the request is recieved, the tradingPairsObject is updated to contain the current object
// And the new price. Then the object is returned

module.exports = {
  pairWatch: async function (tradingPairsArray) {
    console.log(
      `When tradingPairs Array is ingested ${JSON.stringify(tradingPairsArray)}`
    )
    console.log('Watching pairs')

    //logic:
    // have function variable that is the prices array
    // function that getsPrices and sets array to the updated getPrices
    //function that calls the getPrices function every second

    let prices = []
    const updatePrices = async () => {
      try {
        let res = await getPrices()
        prices = res
        console.log(prices)
      } catch (err) {
        console.log(err)
      } finally {
        setTimeout(getPrices, 1000)
      }
    }

    // let go = true
    // function that gets getPrices
    function getPrices() {
      console.log('Im getting some data')
      return new Promise((resolve, reject) => {
        resolve(
          ftx.request({
            method: 'GET',
            path: '/markets',
          })
        )
      })
    }

    const gotPrices = await updatePrices(10)
    //function sort prices
    function filterPrices(gotPrices, tpa) {
      return tpa.map((pair) => {
        return gotPrices.result.filter((i) => i.name === pair.pair)
      })
    }

    // const sortedPrices = filterPrices(gotPrices, tradingPairsArray)
    // console.log(sortedPrices)
    // return sortedPrices

    // let prices = getPrices(tradingPairsArray, go)
    // let d = []

    // // const setAsyncSetInterval = require('util').promisify(setTimeout)
    // const setAsyncSetInterval = (cb, timeout = 500) => {
    //   return new Promise((resolve) => {
    //     setInterval(() => {
    //       getPrices()
    //       resolve()
    //     }, timeout)
    //   })
    // }
    // const getData = async (d) => {
    //   await setAsyncSetInterval(
    //     null,
    //     () => {
    //       ftx
    //         .request({
    //           method: 'GET',
    //           path: '/markets',
    //         })
    //         .then((res) => {
    //           d = sort(res, tradingPairsArray)
    //           console.log(d)
    //           function sort(res, tpa) {
    //             //map over trading Pairs Array, filter server results by each item in trading Pairs Array
    //             return tpa.map((pair) => {
    //               return res.result.filter((i) => i.name === pair.pair)
    //             })
    //           }
    //           return d
    //         })
    //     },
    //     500,
    //     d
    //   )
    // }
    // getData(d)
    // console.log(d)
    // return d
  },

  // two alternate options:
  //idea 1:
  // have a variable set to a boolean value
  // have a setInterval run that turns the boolean to true or false
  // have another loop that while the boolean value is true, runs the function
  // idea 2:
  // global variable taht sets delay measured in ms
  //
  //
  //inside of a while lo

  // let prices = []
  // function pairWatch(tpa, prices) {
  //   console.log(
  //     `When tradingPairs Array is ingested ${JSON.stringify(tradingPairsArray)}`
  //   )
  //   console.log('Watching pairs')
  //   function getPrices(tpa, p) {
  //     ftx
  //       .request({
  //         method: 'GET',
  //         path: '/markets',
  //       })
  //       .then((res) => {
  //         return (p = sort(res, tpa))
  //         // console.log(p/ )
  //         function sort(res, tpa) {
  //           //map over trading Pairs Array, filter server results by each item in trading Pairs Array
  //           return tpa.map((pair) => {
  //             return res.result.filter((i) => i.name === pair.pair)
  //           })
  //         }
  //       })
  //   }

  //   function timer(delayTime) {
  //     return new Promise(function (resolve) {
  //       setInterval(function () {
  //         let response = getPrices(tpa, prices)
  //         console.log(`response is ` + response)
  //         resolve(getPrices(tpa, prices))
  //       }, delayTime)
  //     })
  //   }

  //   timer(1000).then(function (t) {
  //     console.log(t)
  //   })
  // }
  // const p = pairWatch(tradingPairsArray, prices)
  // console.log(prices)
}
