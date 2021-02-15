const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
const fileUpload = require('express-fileupload')

// load env vars
dotenv.config({ path: './config/config.env' })

const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const errorHandler = require('./middleware/error')
const path = require('path')

// connect to database
connectDB()

const app = express()

// Body parser
app.use(express.json())

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// File uploading 
app.use(fileUpload())

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

app.use(errorHandler)

const PORT = process.env.PORT || 8000

const server = app.listen(PORT, () => {
    console.log(`Server is up running at PORT ${process.env.PORT}`.green.bold)
})

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    // close server & exit process
    server.close(() => process.exit(1))
})