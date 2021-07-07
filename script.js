//accounting.js example
var a = accounting.formatMoney(5318008);
console.log(a) //$5,318,008.00



//function to fetch cryto
function fetchCryto (symbol) {
  var crytoApi = `https://api.cryptonator.com/api/full/${symbol}-usd`
  fetch(crytoApi)
  .then(res => {
    if(res.ok) {
      return res.json()
    } else {
      console.log('error ')
    }
  })
  .then(data => {
    console.log('data --->' , data)
    console.log('current price -->', data.ticker.price)
    console.log('symbol -->', data.ticker.base)
    console.log('24 hr trade volumn -->', data.ticker.markets[0].volume)
    console.log('Timestamp -->', new Date(data.timestamp * 1000).toLocaleDateString("en-US"))
  })
}
//symbol example to test - btc, eth, usdt ,bnb
// fetchCryto('bnb')


const apiKey = 'c3ibusiad3ib8lb82nbg'
function fetchStockPrice (symbol) {

  symbol = symbol.toUpperCase();
  var stockPriceApi = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
  fetch(stockPriceApi)
  .then(res => {
    console.log('res', res)
    return res.json()
  })
  .then(data => {
    console.log('current price', accounting.formatMoney(data.c))
    console.log('open price', accounting.formatMoney(data.o))
    console.log('low price', accounting.formatMoney(data.l))
    console.log('high price', accounting.formatMoney(data.h))
    console.log('Previous close price', accounting.formatMoney(data.pc))
  })

}
//symbol example to test - aapl, fb , googl, amzn
// fetchStockPrice('googl')

function fetchNews() {
  var bussinessNewsApi = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`
  fetch(bussinessNewsApi)
  .then(res => {
    return res.json()
  })
  .then(data => {
    console.log(data)
    for(var i = 0; i < 5; i++) {
      console.log('headline --> ', data[i].headline)
      console.log('image --> ', data[i].image)
      console.log('url --> ', data[i].url)
      console.log('summary --> ', data[i].summary)
    }
  })
}
fetchNews()





