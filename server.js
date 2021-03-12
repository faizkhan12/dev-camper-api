const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
const fileUpload = require('express-fileupload')
const path = require('path')
const errorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require("helmet")
var xss = require('xss-clean')
const rateLimit = require("express-rate-limit");
const hpp = require('hpp')
var cors = require('cors')

// load env vars
dotenv.config({ path: './config/config.env' })

const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/review')

// connect to database
connectDB()

const app = express()

// Body parser
app.use(express.json())

// cookie parser
app.use(cookieParser())

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// File uploading 
app.use(fileUpload())

// sanitize data
app.use(mongoSanitize())

// set security headers
app.use(helmet())

// prevent xss attacks
app.use(xss())

// rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// apply to all requests
app.use(limiter);

// prevent http param pollution
app.use(hpp())

// enable cors
app.use(cors())

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

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