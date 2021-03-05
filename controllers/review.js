const Review = require('../models/Review')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')
const User = require('../models/User')

// @desc    GET reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public

exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const review = await Review.find({
            bootcamp: req.params.bootcampId
        })
        return res.status(200).json({
            success: true,
            count: review.length,
            data: review
        })
    } else {
        res.status(200).json(res.advancedResults)
    }
})
