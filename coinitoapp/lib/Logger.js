/**
 * Coinito Logger
 */

'use strict'

import debug from 'debug'

const Logger = function(loggerLabel) {
	this.Log = debug(`coinito:${loggerLabel}`)
}

Logger.prototype.info = function(message) {
	this.Log(message)
}

export default Logger
