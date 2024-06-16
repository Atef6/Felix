const mongoose = require('mongoose')

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        console.log(`Connected to Mongoose`)
    } catch (error) {
        console.log(`Error connecting Mongoose`)
    }
}
module.exports = connectDatabase