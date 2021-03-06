/*
    routes of rating 
    author - @Faiz Khan
*/

const express = require('express')
const {
    getReviews,
    getReview,
    createReview,
} = require('../controllers/review')
const advancedResults = require('../middleware/advancedResults')
const Review = require('../models/Review')
const { protect, authorize } = require('../middleware/auth')

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
    .post(protect, authorize('user', 'admin'), createReview)

router
    .route('/:id')
    .get(getReview)

module.exports = router 