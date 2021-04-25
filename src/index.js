global._$ = `${__dirname}/server/`;

(async function(){

    const http = require('http'),
        Express = require('express'),
        bodyParser = require('body-parser'),
        settings = require(_$+'settings'),
        defaultRoute = require(_$+'routes/default'),
        itemRoute = require(_$+'routes/item'),
        express = Express()

    express.use(Express.static('./static'))
    express.use(bodyParser.urlencoded({ }))
    express.use(bodyParser.json())

    // bind routes, default last
    itemRoute(express)
    defaultRoute(express)

    const server = http.createServer(express)
    server.listen(settings.port)
    console.log(`express listening on port ${settings.port}`)

})()