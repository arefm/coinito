/**
 * @author Aref Mirhosseini <code@arefm.me> (http://arefm.me)
 */

import fastify from 'fastify'
import helmet from 'fastify-helmet'
import compress from 'fastify-compress'
import { configs, messages } from '../configs'
import pov from 'point-of-view'
import stc from 'fastify-static'
import hbs from 'hbs'
// import body from 'fastify-formbody'
// // import { Client } from 'fastify-sequelizejs'
import routes from '../bin/routes'
import middlewares from './middlewares'

const env = ['development', 'production'].indexOf(process.env.NODE_ENV) > -1 ? process.env.NODE_ENV : 'development'
const app = fastify()

hbs.registerHelper('split_price', (value, opts) => {
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
})

// Load Middlewares
middlewares.forEach(middleware => app.use(middleware))

app.decorate('configs', configs)
app.decorate('messages', messages)
// app.register(Client, configs.db.postgres)
app.register(compress)
app.register(helmet)
// app.register(body)
app.register(stc, {
    root: `${__dirname}/../public`,
    prefix: '/public/'
})
app.register(pov, {
    engine: {
        handlebars: hbs
    },
    templates: 'views',
    options: {}
})
app.register([
    routes
], configs.routes, err => {
    if (err) throw err
})

app.ready(err => {
    if (err) throw err
    console.log('app is ready.')
})

app.listen(configs.port, configs.host, function(err) {
    if (err)
        throw err
    let addr = app.server.address()
    addr = `http://${addr.address}:${addr.port}`
    console.log(`app is running at ${addr}`)
})