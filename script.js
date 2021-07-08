// accounting.js example
// var a = accounting.formatMoney(5318008);
// console.log(a) //$5,318,008.00



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
    // console.log(data)

    // News section
      for(var i = 0; i < 4; i++) {
      let headline = data[i].headline;
      let imageUrl = data[i].image;
      let url = data[i].url;
      let summary = data[i].summary

    var $headlineEl = $("<p>").addClass("title headline is-size-4").text(headline);
    var $summaryEl = $("<p>").addClass("summary is-size-6").text(summary);
    var $articleEl = $("<article>").addClass("tile is-child box");
    var $cardEl = $("<div>").addClass("tile is-parent");
    

    $articleEl.append($headlineEl, $summaryEl);
    $cardEl.append($articleEl);
    $(".is-ancestor").append($cardEl);

    }
  })
}
fetchNews()


//chart function. input - symbol
//function will call the API and get all the history data.
function chart(symbol) {
  var currentUnix =Math.round(new Date().getTime()/1000);
  var dateInUnix10DayAgo = currentUnix - (86400 * 10)
  // var aDatAgo = currentUnix - 86400;
  // console.log('currentUnix', new Date(currentUnix * 1000).toLocaleDateString("en-US"))
  // console.log('dateInUnix10DayAgo', new Date(dateInUnix10DayAgo * 1000).toLocaleDateString("en-US"))
  var stockCandlesApi = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${dateInUnix10DayAgo}&to=${currentUnix}&token=${apiKey}`
  fetch(stockCandlesApi)
  .then(res => {
    return res.json();
  })
  .then(data => {
    let timeSlot = data.t
    //convert unix time array to real time
    let realDate = timeSlot.map(time => {
      return new Date(time * 1000).toLocaleDateString("en-US")
    })
    buildChart(symbol,data.o, realDate)
  })
}
//symbol example to test - aapl, fb , googl, amzn
chart('fb')


//build chart function - input 1. symbol 2. array of pricing, 3. array of date
//This function will call by function 'chart'
function buildChart(symbol,priceArray, dateArray) {
  // need to grab the current price nd push it to priceArray
  let labels = dateArray;

  let data = {
    labels: labels,
    datasets: [{
      label: symbol.toUpperCase(),
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: priceArray,
    }]
  };

  const config = {
    type: 'line',
    data,
    options: {}
  };

  var myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
}



