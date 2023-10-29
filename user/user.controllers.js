const UserSchema = require('../model/user.model')
const logger = require('../logger/logger')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// create user
const CreateUser = async (req, res) => {
    try {
        const userFromReq = req.body
        const existingUser = await UserSchema.findOne({ email: userFromReq.email })
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists',
            })
        }
        const user = await UserSchema.create({
            name: userFromReq.name,
            email: userFromReq.email,
            password: userFromReq.password,
        })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        if (user) {
            return res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: { user, token }
            })
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// login user
const LoginUser = async (req, res) => {
    try{
    logger.info('[CreateUser] => login process started')
    const userFromReq = req.body
    const user = await UserSchema.findOne({ email: userFromReq.email })
    if (!user){
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }
    const validPassword = await user.validatePassword(userFromReq.password)
    if (!validPassword){
        return res.status(400).json({
            success: false,
            message: 'Invalid password'
        })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    logger.info('[CreateUser] => login process done')
    return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: { user, token }
    })
}
catch (error) {
    logger.error(error.message);
    res.status(500).json({
        success: false,
        message: error.message,
    })
}
}


module.exports = {
    CreateUser,
    LoginUser
}