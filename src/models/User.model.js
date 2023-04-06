import joi from 'joi';

const userSchema = joi.object({
    userName: joi.string().lowercase().required(),
    userEmail: joi.string().email().required(),
    fullName: joi.string().lowercase().required(),
    userPassword: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/).required(),
});

export default userSchema;