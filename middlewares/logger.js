/**
 * @author Aref Mirhosseini <code@arefm.me> (http://arefmirhosseini.com)
 */

'use strict'

import debug from 'debug'
const log = debug('coinito:logger')

const Logger = function(req, res, next) {
	let now = new Date()
	log(`${now} [${req.method}] ${req.url}`)
	// log('Headers: %j', req.headers)
	// if (req.method !== 'GET')
	// 	log('Body: %j', req.body)
	// log('========================================')
	next()
}

export default Logger
