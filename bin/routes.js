/**
 * @author Aref Mirhosseini <code@arefm.me> (http://arefm.me)
 */

'use strict'

const debug = require('debug')('coinito:bin/routes')
const modelConfig = require(`${__dirname}/../server/model-config`)
const basePath = `${__dirname}/../server/models`
const modelSettingPattern = new RegExp('.+\.json$')

export default function(app, opts, next) {
	// const DB = app.Sequelize[app.configs.db.postgres.database]
	const DB = null
	let modelPath;
	let handler;
	let settings = {}
	let routeOpts = {}
	for (let Model in modelConfig) {
		modelPath = `${basePath}${modelConfig[Model]}`
		modelPath = modelPath.replace(/\/\//g, '/')
		if (!modelSettingPattern.test(`${modelPath}.json`))
			return new Error(`${Model} is not defined`)
		handler = require(`${modelPath}.js`)
		handler = new handler(app, opts, DB)
		settings = require(`${modelPath}.json`)
		for (let methodName in settings.methods) {
			routeOpts = {}
			let { path, method, schema, before } = settings.methods[methodName]
			path = settings.baseUrl === '/' ? path : `${settings.baseUrl}${path}`
			if (new RegExp('.+?/$', 'g').test(path))
				path = path.substring(0, path.length - 1)
			routeOpts.url = path.substr(1)
			routeOpts.method = method.toUpperCase()
			if (typeof schema !== 'undefined')
				routeOpts.schema = schema
			routeOpts.handler = handler[methodName].bind(handler)
			// Check BeforeHandlers
			let beforeHandlers = [];
			if (typeof before !== 'undefined') {
				if (Object.prototype.toString.call(before) === '[object String]')
					before = before.split(',')
				before.map(beforeHandler => {
					if (typeof handler[beforeHandler] === 'function')
						beforeHandlers.push(handler[beforeHandler].bind(handler))
				})
				if (beforeHandlers.length)
					routeOpts.beforeHandler = beforeHandlers
			}
			app.route(routeOpts)
			// debug(routeOpts.method, routeOpts.url)
		}
	}
	next()
}
