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
        val = String(val + (value - parseInt(value)).toFixed(3))
        value = val.charAt(0) === ',' ? val.substr(1) : val
    }
    return value
}

setTimeout(function() {
    var url = '/list?json'
    var cached = {}
    var cachedItm = {};
    var updStyle = 'upd_default'
    var val;
    setInterval(function() {
        var elm;
        var symbol;
        var needSplit = ['market_cap_usd', 'price_usd']
        var isPercent = false
        httpGetAsync(url, function(data) {
            data = JSON.parse(data).list
            data.forEach(coinBlock => {
                symbol = coinBlock.symbol
                Object.keys(coinBlock).forEach(key => {
                	if (Object.keys(cached).indexOf(symbol + '-' + key) > -1) {
                		cachedItm = cached[symbol + '-' + key]
                		console.log('cachedItm', cachedItm.value > coinBlock[key])
                		switch (true) {
                			case cachedItm.value > coinBlock[key]:
                				cachedItm.change = 'upd_dec'
                				console.log('dec')
                			break
                			case cachedItm.value < coinBlock[key]:
                				cachedItm.change = 'upd_inc'
                				console.log('inc')
                			break
                		}
                	} else {
                		cached[symbol + '-' + key] = { value: coinBlock[key], change: 'upd_def' }
                		cachedItm = cached[symbol + '-' + key]
                		// console.log('def')
                	}
                    elm = document.getElementById(symbol + '-' + key)
                    isPercent = new RegExp('^percent_change.+').test(key)
                    if (elm) {
                    	val = needSplit.indexOf(key) !== -1 ? split_price(coinBlock[key]) : coinBlock[key]
                    	elm.className = 'border border-secondary ' + cachedItm.change
                        elm.innerText = isPercent ? val + '%' : val
                    }
                })
            })
            console.log('list updated at ' + Date.now())
        })
    }, 5000)
}, 10000)