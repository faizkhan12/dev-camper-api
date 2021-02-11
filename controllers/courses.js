/*
    course controller to get all courses, get all courses for specific bootcamp
    author - @Faiz Khan
*/

const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')

// @desc    GET all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query

    if (req.params.bootcampId) {
        query = Course.find({
            bootcamp: req.params.bootcampId
        })
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        })
    }
    const courses = await query

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})

// @desc    GET single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: course
    })
})

// @desc    Create new course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`bootcamp not found with id of ${req.params.bootcampId}`, 404))
    }

    // create new course
    const course = await Course.create(req.body)
    res.status(200).json({
        success: true,
        data: course
    })
})
