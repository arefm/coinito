/**
 * @author Aref Mirhosseini <code@arefm.me>
 */

'use strict'

class ListHandler {

    constructor(app, opts = {}) {
        this.configs = app.configs
    }

    List(req, reply) {
        reply.send('List')
    }    

}

module.exports = ListHandler
