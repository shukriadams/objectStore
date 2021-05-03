const settings = require(_$+'settings'),
    MongoClient = require('mongodb').MongoClient

module.exports = {

    /** 
     * Gets a mongo collection, and db instance for closing.
     */
    async getCollection( collectionName) {
        return new Promise((resolve, reject) => {
            try {
                MongoClient.connect(settings.connectionString, { poolSize : settings.poolSize, useUnifiedTopology: true }, (err, client) => {
                    if (err)
                        return reject(err)

                    const db = client.db(settings.db)

                    resolve({ 
                        close : ()=>{
                            client.close()
                        }, 
                        collection : db.collection(collectionName)
                    })
                })
            } catch(ex){
                reject(ex)
            }
        })
    },


    /**
     * Use this to set up database structures, import default 
     */
    async initialize(){
        return new Promise(async (resolve, reject) => {
            try {
                MongoClient.connect(settings.connectionString, { poolSize : settings.poolSize, useUnifiedTopology: true }, async (err, client) => {
                    if (err)
                        return reject(err)

                    // add setup here
                    const db = client.db(settings.db)

                    await db.collection('items').createIndex( { signature: 1, tags : 1  }, { unique: false, name : `items_lookup_performance` })

                    client.close()
                    resolve()
                })
            } catch(ex){
                reject(ex)
            }
        })
    },


    /**
     * Args :
     * table, and then any number of arguments used by mongo's native aggregate method, example "aggregate, where, sort, limit".
     */
    async aggregate (table, aggregator){
        // advanced mongo queries are a sequence of objects, ex : aggregator, where, sort, limit, etc. Convert to array so we can do this dynamically
        const args = Array.from(arguments).slice(1)
        return new Promise(async (resolve, reject)=>{
            try {
                const mongo = await this.getCollection(table)
              
                mongo.collection.aggregate(args, (err, records)=>{
                    if (err)
                        return reject(err)

                    records.toArray((err, records)=>{
                        if (err)
                            return reject(err)

                        if (!records)
                            return resolve([])

                        mongo.close()
                        resolve(records)
                    })
    
                })
               
            } catch(ex){
                reject(ex)
            }
        })
    }, 


    /**
     * 
     */ 
    async distinct(collectionName, field, query){
        return new Promise(async (resolve, reject)=>{
            try {
                const mongo = await this.getCollection(collectionName)
                mongo.collection.distinct(field, query, (err, records)=>{
                    if (err)
                        return reject(err)
                    
                    mongo.close()
                    resolve(records)
                })

            } catch(ex){
                reject(ex)
            }
        })
    },


    /**
     * 
     */ 
    async getById(collectionName, id, options = {}){
        return new Promise(async (resolve, reject)=>{
            try {
                // if an id is corrupt/ invalid we don't want objectId to throw a parse error
                // and derail entire call - an invalid id should be treated as "not found"
                // which is a null return
                const mongo = await this.getCollection(collectionName)
                mongo.collection.findOne({ _id : id },(err, record)=>{
                    if (err)
                        return reject(err)
                    
                    if (options.expected && !record)
                        return reject(`Expected record id ${id} from table ${collectionName} not found`)

                    mongo.close()
                    resolve(record)
                })

            } catch(ex){
                reject(ex)
            }
        })
    },

    
    /**
     * 
     */ 
    async find(collectionName, query = {}, sort = {}, limit = 0){
        return new Promise(async (resolve, reject)=>{
            try {
                const mongo = await this.getCollection(collectionName)
                
                mongo.collection.find(query).sort(sort).limit(limit).toArray((err, records)=>{
                    if (err)
                        return reject(err)
                    
                    mongo.close()
                    resolve(records)
                })

            } catch(ex){
                reject(ex)
            }
        })
    },    


    /**
     * 
     */ 
    async findOne(collectionName, query){
        return new Promise(async (resolve, reject)=>{
            try {
                const mongo = await this.getCollection(collectionName)
                mongo.collection.find(query).toArray((err, records)=>{
                    if (err)
                        return reject(err)
                    
                    mongo.close()
                    if (records.length > 1)
                        return reject(`One or zero records expected, ${records.length} found in collection ${collectionName}`)

                    if (records.length)
                        return resolve(records[0])
                    
                    resolve(null)
                })
            } catch(ex){
                reject(ex)
            }
        })
    },


    /**
     * 
     */ 
    async findFirst(collectionName, query){
        return new Promise(async (resolve, reject)=>{
            try {
                const mongo = await this.getCollection(collectionName)
                mongo.collection.find(query).toArray((err, records)=>{
                    if (err)
                        return reject(err)
                    
                    mongo.close()
                    resolve(records.length ? records[0] : null)
                })
            } catch(ex){
                reject(ex)
            }
        })
    },


    /**
     * 
     */ 
    async remove(collectionName, query){
        return new Promise(async (resolve, reject)=>{
            try {
                const mongo = await this.getCollection(collectionName)
                mongo.collection.deleteMany(query, err =>{
                    if (err)
                        return reject(err)
                    
                    mongo.close()
                    resolve()
                })
            } catch(ex){
                reject(ex)
            }
        })
    },
   

    /**
     * Id must be a valid mongo ObjectId.
     */ 
    async update(collectionName, record){
        return new Promise(async (resolve, reject)=>{
            try {
                const mongo = await this.getCollection(collectionName)
                mongo.collection.updateOne({ _id : record._id }, { $set: record }, {}, err => {
                    if (err)
                        return reject({err, record})
                    
                    mongo.close()
                    resolve()
                })
            } catch(ex){
                reject({ex, record})
            }
        })
    },

    
    /**
     * Inserts record; returns the record inserted.
     */ 
    async insert (collectionName, record){
        return new Promise(async (resolve, reject)=>{
            try {
                const mongo = await this.getCollection(collectionName)

                mongo.collection.insertOne(record, (err, result)=>{
                    if (err)
                        return reject(err)
                        
                    mongo.close()

                    resolve(result.ops[0])
                })
            } catch(ex){
                reject(ex)
            }
        })
    }
}    
    
