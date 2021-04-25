module.exports = function(express){

    const showError = require(_$+'showError')

    /**
     * 
     */
    express.get('/', async function (req, res) {
        try {
            res.send('ready')

        } catch(ex){
            showError(res, ex)
        }
    })
}
