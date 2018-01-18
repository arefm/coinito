/**
 * @author Aref Mirhosseini <code@arefm.me> (http://arefm.me)
 */

const env = process.env.NODE_ENV || 'production'

const configs = require(`./server.development.json`)
const messages = require('./messages')

export { configs, messages }
