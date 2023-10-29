const joi = require('joi')

// validating user creation with joi
const ValidateUserCreation = async (req, res, next) => {
    try {
        const schema = joi.object({
            name: joi.string().required().min(3).messages({
                'string.min': 'name must be at least 3 characters long',
                'any.required': 'name is required',
            }),
            password: joi.string().min(6).required().messages({
                'string.min': 'password must be at least 6 characters long',
                'any.required': 'password is required',
            }),
            email: joi.string().email().required().messages({
                'string.email': 'invalid email format',
                'any.required': 'email is required',
            })
        })
        await schema.validateAsync(req.body, { abortEarly: true })
        next()
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}

// validating user login with joi
const ValidateUserLogin = async (req, res, next) => {
    try {
        const schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required()
        })
        await schema.validateAsync(req.body, { abortEarly: true })
        next()
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}


module.exports = {
    ValidateUserCreation,
    ValidateUserLogin
}