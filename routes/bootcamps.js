/*
    routes of bootcamp 
    author - @Faiz Khan
*/

const express = require('express')
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    uploadBootcampPhoto,
} = require('../controllers/bootcamps')
const advancedResults = require('../middleware/advancedResults')
const Bootcamp = require('../models/Bootcamp')

// Include other resourses routers
const courseRouter = require('./courses')

const router = express.Router()

const { protect } = require('../middleware/auth')

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router
    .route('/:id/photo')
    .put(protect, uploadBootcampPhoto)

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, updateBootcamp)
    .delete(protect, deleteBootcamp)

module.exports = router