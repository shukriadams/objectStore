module.exports = function(express){

    const showError = require(_$+'showError'),
        mongo = require(_$+'mongo')

    const SHA256FromData = function(data){
        const crypto = require('crypto'),
            shasum = crypto.createHash('sha256')
    
        shasum.update(data)
        return shasum.digest('hex')
    } 

    function generateObjectSignature(obj){
        if (!obj)
            return ''

        let names = Object.keys(obj).sort(),
            sigantureString = ''
        
        for (let name of names){
            if (typeof obj[name] === 'object' || Array.isArray(obj[name]))
                sigantureString += generateObjectSignature(obj[name])
            else
                sigantureString += name
        }

        return SHA256FromData(sigantureString)
    }

    /**
     * 
     */
    express.post('/v1/item/:key', async (req, res) => {
        try {
            let tags = (req.query.tags || '').split(',').filter(tag => !!tag),
                signature =  generateObjectSignature(req.body)

            if (!req.body)
                throw `body not set`
                
            await mongo.insert('items', {
                _id : req.params.key,
                date : new Date(),
                signature,
                tags,
                data : req.body
            })
            res.end('created')
        } catch(ex){
            if (ex.message && ex.message.includes('duplicate key'))
                return showError(res, `A record for key "${req.params.key}" already exists`)
            showError(res, ex)
        }
    })


    /**
     * 
     */
    express.get('/v1/item', async (req, res) => {
        try {

        } catch(ex){
            showError(res, ex)
        }
    })


    /**
     * 
     */
    express.delete('/v1/item', async (req, res) => {
        try {

        } catch(ex){
            showError(res, ex)
        }
    })    
}
