/**
 * @author Aref Mirhosseini <code@arefm.me> (http://arefm.me)
 */

const env = process.env.NODE_ENV || 'production'

const server = Object.assign({}, { env: env }, require(`./server.${env}`))
const messages = require('./messages')

export { server, messages }
