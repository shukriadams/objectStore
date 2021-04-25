// outputs HTTP error via express
module.exports  = (res, error, errorCode = 500)=>{

    let out = typeof error === 'object' ? 
        error.toString() : 
        error

    if (error.stack)
        out += `\n${error.stack} `

    res.status(errorCode)
    res.end(out)
} 