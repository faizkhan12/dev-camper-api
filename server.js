const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
const bootcamps = require('./routes/bootcamps')

// load env vars
dotenv.config({ path: './config/config.env' })

// connect to database
connectDB()

const app = express()

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)



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