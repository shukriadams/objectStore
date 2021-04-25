let chokidar = require('chokidar'),
    spawn = require('cross-spawn'),
    process = require('process'),
    _expressProcess = null


/** 
 * Starts Express server. If Express is already started, kills the existing process.
 */
function startExpress(){
    if (_expressProcess){
        console.log('stopping existing express process')
        _expressProcess.kill('SIGINT')
    }
    
    const breakSwitch = process.argv.includes('--brk') ? '-brk' : ''
    if (breakSwitch)
        console.log(`BREAK enabled`)

    _expressProcess = spawn('node', [`--inspect${breakSwitch}=0.0.0.0:5001`, 'index'], { cwd : process.cwd(), env: process.env })

    _expressProcess.stdout.on('data', function (data) {
        console.log(data.toString('utf8'))
    })
     
    _expressProcess.stderr.on('data', function (data) {
        console.log(data.toString('utf8'))
    })
}


(async function(){

    // start watching server js files
    let expressWatcher = chokidar.watch(['./index.js', './server/**/*.js', '!./develop/**', '!**/node_modules/**' ], {
        persistent: true,
        usePolling: true,
        // always ignore initial for server file watcher
        ignoreInitial : true
    })

    expressWatcher
        .on('add', async function() {
            startExpress()
        })
        .on('change', async function(){
            startExpress()
        })
        .on('unlink', async function(){
            startExpress()
        })

    startExpress()

    console.log('Watching...')
})()
