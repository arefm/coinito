/**
 * @author Aref Mirhosseini <code@arefm.me>
 */

'use strict'

import { Logger, Fetch } from 'coinitoapp'

const log = new Logger('list')

class ListHandler {

    constructor(app, opts = {}) {
        this.configs = app.configs
        this.Storage = {
        	list: []
        }
    }

    List(req, reply) {
        let { json } = req.query
        if (typeof json === 'undefined') {
            reply.view('/list/list.html', {
            	list: this.Storage.list
            })
            return
        }
        reply
            .type('application/json')
            .send({ list: this.Storage.list })
    }

    FetchList(req, reply, next) {
        let Request = new Fetch({
            url: 'https://api.coinmarketcap.com/v1/ticker/?limit=10'
        })
        Request.send()
    		.then(data => {
    			this.Storage.list = data
    			next()
    		})
    		.catch(err => next(err))
    }

}

module.exports = ListHandler
