module.exports = function(express){

    const showError = require(_$+'showError'),
        mongo = require(_$+'mongo')

    /**
     * 
     */
    express.post('/v1/item/:key', async (req, res) => {
        try {
            let tags = (req.query.tags || '').split(','),
                signature = ''

            if (!req.body)
                throw `body not set`
                
            await mongo.insert('items', {
                date : new Date(),
                signature,
                tags,
                data : req.body
            })
            res.end('created')
        } catch(ex){
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
