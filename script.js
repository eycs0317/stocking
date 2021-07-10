// When seatch btn click
$('.searchBtn').click(function(e) {
  e.preventDefault();
  let userInput = $('.searchCode').val()
  $('.searchCode').val('')
  chart(userInput);
  fetchStockPrice(userInput);
})

//using enter button for search
// $('.searchCode').keypress(function(e){
//   if(e.keyCode==13)
//   $('.searchBtn').click();
// });

const apiKey = 'c3ibusiad3ib8lb82nbg'

function fetchStockPrice (symbol) {
  symbol = symbol.toUpperCase();
  var stockPriceApi = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
  fetch(stockPriceApi)
  .then(res => {
    return res.json()
  })
  .then(data => {
    if(data.c === 0 && data.h === 0) {
      //Found Stock history API got faster return when input are bad! - have the chart function to return error message
      return;
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
    if(data.s !== 'no_data') {
      if(window.myChart instanceof Chart){
        window.myChart.destroy();
      }
      let timeSlot = data.t
      //convert unix time array to real time
      let realDate = timeSlot.map(time => {
        return new Date(time * 1000).toLocaleDateString("en-US")
      })
      buildChart(symbol,data.o, realDate)
    } else {
      let $invalidMsg = $('.invalid-msg')
        $invalidMsg.text('bad input')
        setTimeout(() => {
          $invalidMsg.text('')
        },700)
    }
  })
}

//buildChart function - INPUT --> 1. symbol 2. array of pricing, 3. array of date
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

//build marquee button
function buildMarqueeButton (sym) {
  sym = sym.toUpperCase()
  let historyBtnEl = $('<button>').addClass('stockToWatch history-btn mx-1').text(sym).attr('id', sym)

  historyBtnEl.click(function() {
<<<<<<< HEAD
    console.log('click')
    console.log($(this).attr('id'))
    if(window.myChart instanceof Chart){
      window.myChart.destroy();
    }
=======
>>>>>>> fa281a9c845d4819ccd36a1b1b813df16ba0c4af
    chart(sym);
    fetchStockPrice(sym);
  })

  $('marquee').append(historyBtnEl)
}


//display all history button when first load up
function initHistoryButton () {
  var localStorageData = JSON.parse(localStorage.getItem("stockSymbol"));
  if(localStorageData !== null) {
    localStorageData.forEach(symbol => {
      buildMarqueeButton(symbol)
    })
  }
}
initHistoryButton()

// deleteBtn
$('.deleteBtn').click(function(e) {
  e.preventDefault()
  let emptyArr = []
  localStorage.setItem('stockSymbol', JSON.stringify(emptyArr))
  $('marquee').empty()
});



// I clean up some code - need to update code picture in the presentation

// i change searchArea div to form. SO that the Enter key work HTML 25, 30. Added e.preventDefault() on JS 3 to prevent refresh, so 10-14 are no longer needed.

// using history data api inside chart function to check input

// for padding and margin - try to use https://bulma.io/documentation/helpers/spacing-helpers/ for flex box https://bulma.io/documentation/helpers/flexbox-helpers/

// added a button after the search button to clear the localstorage HTML line29 JS 183-188. I don't know if that a good idea or not. delete if you like

// We have a  <p class=“invalid-msg px-3 py-2”>error message show here!</p> on HTML line 30 for the invalid input. please style if u can.

//Found 2x .searchBtn in css ??



///////////////////////////////////////////////////////////////
// example for accounting.js and fetchCryto function that we didn't use
// accounting.js example
// var a = accounting.formatMoney(5318008);
// console.log(a) //$5,318,008.00

//function to fetch cryto - did not use
// function fetchCryto (symbol) {
//   var crytoApi = `https://api.cryptonator.com/api/full/${symbol}-usd`
//   fetch(crytoApi)
//   .then(res => {
//     if(res.ok) {
//       return res.json()
//     } else {
//       console.log('error ')
//     }
//   })
//   .then(data => {
//     console.log('data --->' , data)
//     console.log('current price -->', data.ticker.price)
//     console.log('symbol -->', data.ticker.base)
//     console.log('24 hr trade volumn -->', data.ticker.markets[0].volume)
//     console.log('Timestamp -->', new Date(data.timestamp * 1000).toLocaleDateString("en-US"))
//   })
// }
//symbol example to test - btc, eth, usdt ,bnb
// fetchCryto('bnb')
