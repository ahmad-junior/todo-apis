import Joi from "joi";

const todoSchema = Joi.object({
    todoTitle: Joi.string().required(),
});

export default todoSchema;