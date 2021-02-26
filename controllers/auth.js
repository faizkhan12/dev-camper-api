const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body

    // create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendTokenResponse(user, 200, res)

    // if (user) {
    //     res.status(400).json({
    //         success: false,
    //         msg: 'user already exist'
    //     })
    // }
    res.status(200).json({
        success: true,
        token: token,
    })

})

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    // validate email and password 
    if (!email || !password) {
        return next(new ErrorResponse('Please provide and email and password', 400))
    }

    // check for user
    const user = await User.findOne({ email }).select('+password')

    // check for existing user
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    // check if password matches
    const isMatched = await user.matchPassword(password)

    if (!isMatched) {
        return next(new ErrorResponse('Invalid credentials', 401))

    }

    sendTokenResponse(user, 200, res)

})

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.
        status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}

// @desc    get current logged in user
// @route   POST /api/v1/auth/me
// @access  private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})