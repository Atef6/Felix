const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const connectDatabase = require('./config/db')
const { NotFound, ErrorHandler } = require('./middlewares/error')
require('dotenv').config({ path: 'config.env' })

// * Connect to the database
connectDatabase()

// ^ Middleware 
app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }))

// * Routes
app.use(require('./routers/auth'))
app.use(require('./routers/users'))
app.use(require('./routers/password'))
app.use(require('./routers/anime'))
app.use(require('./routers/video'))
app.use(require('./routers/list'))
app.use(require('./routers/comment'))

// ! Error handler
app.use(NotFound)
app.use(ErrorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port 🧑‍🚀 ${PORT}`)
})