'use strict'

var httpGetAsync = function(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

var split_price = function(value) {
    value = parseFloat(value).toFixed(3)
    let int = String(parseInt(value))
    if (int.length > 3) {
        int = int.split('')
        int = int.reverse()
        let val = []
        let splitter = 0
        int.forEach(blk => {
            val.push(blk)
            splitter++
            if (splitter > 2) {
                val.push(',')
                splitter = 0
            }
        })
        val = val.reverse().join('')
        value = val.charAt(0) === ',' ? val.substr(1) : val
    }
    return value
}

setTimeout(function() {
    var url = '/list?json'
    setInterval(function() {
        var elm;
        var symbol;
        var needSplit = ['market_cap_usd', 'price_usd']
        httpGetAsync(url, function(data) {
            data = JSON.parse(data).list
            data.forEach(coinBlock => {
                symbol = coinBlock.symbol
                Object.keys(coinBlock).forEach(key => {
                    elm = document.getElementById(symbol + '-' + key)
                    if (elm)
                        elm.innerText = needSplit.indexOf(key) !== -1 ? split_price(coinBlock[key]) : coinBlock[key]
                })
            })
            console.log('list updated at ' + Date.now())
        })
    }, 5000)
}, 10000)