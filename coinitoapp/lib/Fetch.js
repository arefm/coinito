/**
 * Coinito Fetch
 */

'use strict'

import Request from 'request-promise'
import Logger from './Logger'

const log = new Logger('fetch')

const Fetch = function({ uri, url, method = 'GET', headers = {}, data = {} }) {
	this.Opts = {
		uri: typeof uri !== 'undefined' ? uri : url,
		method: method.toUpperCase(),
		json: true
	}
	if (Object.keys(headers).length > -1)
		this.Opts.headers = headers
	if (Object.keys(data).length > -1)
		this.Opts.body = data
}

Fetch.prototype.send = function(uri) {
	log.info(`sending new ${this.Opts.method} request to ${this.Opts.uri}`)
	if (typeof uri !== 'undefined')
		this.Opts.uri = uri
	return Request(this.Opts)
}

export default Fetch
