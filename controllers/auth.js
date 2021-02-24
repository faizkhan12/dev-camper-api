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

    // create token 
    const token = user.getSignedJwtToken()

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