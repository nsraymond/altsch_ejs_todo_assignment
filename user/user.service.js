const UserSchema = require('../model/user.model')
const logger = require('../logger/logger')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// sign up
const Signup = async({name,email,password,}) => {
    const userFromReq = {name,email,password,}
        const existingUser = await UserSchema.findOne({ email: userFromReq.email })
        if (existingUser) {
            return {
                message: 'User already exists',
                success: false,
            }
        }
        const user = await UserSchema.create({
            name: userFromReq.name,
            email: userFromReq.email,
            password: userFromReq.password,
        })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
                if (user) {
                    return {
                        message: 'User Created successfully',
                        success: true,
                        data: { user, token }
                    }
                }
        };


// login
const Login = async ({email, password}) => {
    logger.info('[CreateUser] => login process started')
        const userFromReq = {email, password}
        const user = await UserSchema.findOne({ email: userFromReq.email })
        if (!user){
            return {
                message: 'User not found',
                success: false
            }
        }
        const validPassword = await user.validatePassword(userFromReq.password)
        if (!validPassword){
            return{
                message: 'Invalid password or email',
                success: false
            }
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        return {
            message: 'User logged in successfully',
            success: true,
            data: { user, token }
        }
    }
  


module.exports = {
    Signup,
    Login
}