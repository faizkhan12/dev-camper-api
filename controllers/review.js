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

// @desc    GET single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if (!review) {
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: review
    })
})

// @desc    Add new review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`bootcamp not found with id of ${req.params.bootcampId}`, 404))
    }

    // create new course
    const review = await Review.create(req.body)
    res.status(201).json({
        success: true,
        data: review
    })
})