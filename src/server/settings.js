console.log("!!!! SETTINGS LOADED")

let process = require('process'),
    fs = require('fs-extra'),
    customEnv = require('custom-env'),
    yaml = require('js-yaml'),
    settings = {
        // port Express listens on
        port : 5000,
    }

// Load settings from YML file, merge with default settings
if (fs.existsSync('./settings.yml')){
    let userSettings = null

    try {
        const settingsYML = fs.readFileSync('./settings.yml', 'utf8')
        userSettings = yaml.safeLoad(settingsYML)
    } catch (e) {
        console.error('Error reading settings.yml', e)
    }    
    
    settings = Object.assign(settings, userSettings)
}


// if exists, load dev .env into ENV VARs
if (fs.existsSync('./.env')){
    customEnv.env()
    console.log('.env loaded')
}

// apply all ENV VARS over settings, this means that ENV VARs win over all other settings
for (let property in settings){

    settings[property] = process.env[property] || settings[property]

    // parse env bools
    if (settings[property] === 'true')
        settings[property] = true

    if (settings[property] === 'false')
        settings[property] = false
}

module.exports = settings
