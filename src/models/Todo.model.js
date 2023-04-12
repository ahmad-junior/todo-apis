import Joi from "joi";

const todoSchema = Joi.object({
    todoTitle: Joi.string().required(),
    todoStartDate: Joi.date().required(),
    todoEndDate: Joi.date(),
    todoImp : Joi.boolean(),
    todoRecycle : Joi.boolean(),
    todoDone : Joi.boolean()
});

export default todoSchema;