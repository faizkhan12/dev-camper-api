const express = require('express')
const dotenv = require('dotenv')

// load env vars
dotenv.config({ path: './config/config.env' })

const app = express()

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Sever is up running at PORT ${process.env.PORT} `)
})