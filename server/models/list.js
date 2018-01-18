/**
 * @author Aref Mirhosseini <code@arefm.me>
 */

'use strict'

import request from 'request'

class ListHandler {

    constructor(app, opts = {}) {
        this.configs = app.configs
        this.Storage = {
        	list: []
        }
    }

    List(req, reply) {
        reply.view('/list/list.html', {
        	list: this.Storage.list
        })
    }

    FetchList(req, reply, next) {
    	this.__Fetch({ url: 'https://api.coinmarketcap.com/v1/ticker/?limit=10' })
    		.then(data => {
    			this.Storage.list = data
    			next()
    		})
    		.catch(err => next(err))
    }

    __Fetch(opts) {
    	return new Promise((resolve, reject) => {
    		request(opts, (err, resp, body) => {
    			if (err) {
    				reject(err)
    				return
    			}
    			resolve(JSON.parse(body))
    		})
    	})
    }

}

module.exports = ListHandler
