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

$('.searchBtn').click(function() {
  if(window.myChart instanceof Chart){
    window.myChart.destroy();
  }
  let userInput = $('.searchCode').val()
  $('.searchCode').val('')

  chart(userInput);
  fetchStockPrice(userInput);
  // buildMarqueeButton(userInput)
})


const apiKey = 'c3ibusiad3ib8lb82nbg'

function fetchStockPrice (symbol) {
  // console.log(symbol)
  symbol = symbol.toUpperCase();
  var stockPriceApi = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
  fetch(stockPriceApi)
  .then(res => {

    return res.json()
  })
  .then(data => {
    if(data.c === 0 && data.h === 0) {
      console.log('invalid input')
      return;
      // need to show user invalid input
    } else {
      var stockArray = JSON.parse(localStorage.getItem("stockSymbol"));
      if (stockArray === null) {
        stockArray = [];
        stockArray.push(symbol);
        localStorage.setItem('stockSymbol', JSON.stringify(stockArray))
        buildMarqueeButton(symbol)
      } else if (!stockArray.includes(symbol)) {
          stockArray.push(symbol)
          localStorage.setItem('stockSymbol', JSON.stringify(stockArray))
          buildMarqueeButton(symbol)
      } else {
        // buildMarqueeButton(symbol)
      }

      let currentPrice = accounting.formatMoney(data.c)
      let openPrice = accounting.formatMoney(data.o)
      let lowPrice = accounting.formatMoney(data.l)
      let highPrice = accounting.formatMoney(data.h)
      let prevPrice = accounting.formatMoney(data.pc)
      displayCurrentStockInfo(symbol,currentPrice, openPrice, lowPrice, highPrice, prevPrice)
    }
    })

}

//symbol example to test - aapl, fb , googl, amzn
// fetchStockPrice('googl')
function displayCurrentStockInfo(symbol, currentPrice, openPrice, lowPrice, highPrice, prevPrice){

 document.getElementsByClassName('stock-heading')[0].innerText = `${symbol}`;
 document.getElementsByClassName('current-price')[0].innerText = `Current price: ${currentPrice}`;
 document.getElementsByClassName('open')[0].innerHTML = `Open price: ${openPrice}`;
 document.getElementsByClassName('low')[0].innerHTML = `Low price: ${lowPrice}`;
 document.getElementsByClassName('high')[0].innerHTML = `High price: ${highPrice}`;
 document.getElementsByClassName('previous-close')[0].innerHTML = `Previous price: ${prevPrice}`;

}

 //fetch news
function fetchNews() {
  var bussinessNewsApi = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`
  fetch(bussinessNewsApi)
  .then(res => {
    return res.json()
  })
  .then(data => {
    console.log(data)
    // News section
    for(var i = 0; i < 4; i++) {
    let headline = data[i].headline;
    let imageUrl = data[i].image;
    let url = data[i].url;
    let summary = data[i].summary


    var $headlineEl = $("<p>").addClass("title headline is-size-4").text(headline);
    var $summaryEl = $("<p>").addClass("summary is-size-6").text(summary);
    var $articleEl = $("<article>").addClass("tile is-child box");
    var $cardEl = $("<div>").addClass("tile is-parent cardItem").attr("url", url);
    $cardEl.click(function (){
    $(this).attr("url")

    var cardLink =  $(this).attr("url")
    window.open(cardLink);

    })

    $articleEl.append($headlineEl, $summaryEl);
    $cardEl.append($articleEl);
    $(".article-section").append($cardEl);

    }
  })
}
fetchNews()

//using enter button for search
$(document).ready(function(){
  $('.searchCode').keypress(function(e){
    if(e.keyCode==13)
    $('.searchBtn').click();
  });
});

//chart function. input - symbol
//function will call the API and get all the history data.
function chart(symbol) {
  var currentUnix =Math.round(new Date().getTime()/1000);
  var dateInUnix10DayAgo = currentUnix - (86400 * 20)

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


//build chart function - input 1. symbol 2. array of pricing, 3. array of date
//This function will call by function 'chart'
function buildChart(symbol,priceArray, dateArray) {
  // need to grab the current price nd push it to priceArray
  let labels = dateArray;

  let data = {
    labels: labels,
    datasets: [{
      label: symbol.toUpperCase(),
      backgroundColor: '#ff00cc',
      borderColor: '#ff00cc',
      data: priceArray,
    }]
  };

  const config = {
    type: 'line',
    data,
    options: {}
  };

  window.myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
}




//marquee function to stop and start when hover over


//build marquee button
function buildMarqueeButton (sym) {
  sym = sym.toUpperCase()
  let historyBtnEl = $('<button>').addClass('stockToWatch history-btn').text(sym)

  historyBtnEl.attr('id', sym)
  historyBtnEl.click(function() {
    console.log('click')
    console.log($(this).attr('id'))
    if(window.myChart instanceof Chart){
      window.myChart.destroy();
    }
    // let userInput = $('.searchCode').val()
    // $('.searchCode').val('')
    // console.log('userInput', userInput)
    chart(sym);
    fetchStockPrice(sym);
  })
  $('marquee').append(historyBtnEl)
}

//display all history button when first load up
function initHistoryButton () {
  var localStorageData = JSON.parse(localStorage.getItem("stockSymbol"));
  localStorageData.forEach(symbol => {
    buildMarqueeButton(symbol)
  })

}
initHistoryButton()