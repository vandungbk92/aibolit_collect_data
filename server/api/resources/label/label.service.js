import Joi from 'joi';

export default {
  validateBody(body, method) {

    const objSchema = {
      datasetId: Joi.string().required().label('Mã Dataset').error((errors) => {
        return {
          template: 'không được bỏ trống',
          context: {
            errors: errors.length,
            codes: errors.map((err) => err.type)
          }
        };
      }),
    }

    let newSchema = {}
    if (method === 'POST') {
      newSchema = Object.assign({}, objSchema)
    } else {
      for (const key in objSchema) {
        if (objSchema.hasOwnProperty(key) && body.hasOwnProperty(key)) {
          newSchema[key] = objSchema[key]
        }
      }
    }

    const schema = Joi.object().keys(newSchema);
    const { value, error } = Joi.validate(body, schema, {allowUnknown: true , abortEarly: true});
    if (error && error.details) {
      return { error };
    }
    return { value };
  }
}
