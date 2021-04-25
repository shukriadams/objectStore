global._$ = `${__dirname}/server/`;

(async function(){

    const http = require('http'),
        Express = require('express'),
        settings = require(_$+'settings'),
        defaultRoute = require(_$+'routes/default'),
        express = Express()

    express.use(Express.static('./static'))
    
    // bind routes, default last
    defaultRoute(express)

    const server = http.createServer(express)
    server.listen(settings.port)
    console.log(`express listening on port ${settings.port}`)

})()