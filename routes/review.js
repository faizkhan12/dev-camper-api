/*
    routes of rating 
    author - @Faiz Khan
*/

const express = require('express')
const {
    getReviews
} = require('../controllers/review')
const advancedResults = require('../middleware/advancedResults')
const Review = require('../models/Review')

const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(
        advancedResults(Review, {
            path: 'bootcamp',
            select: 'name description'
        }),
        getReviews
    )

module.exports = router 