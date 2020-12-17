import Joi from 'joi';

export default {
  validateBody(body, method) {
    let objSchema = {
      quanhuyen_id: Joi.string().required().label('Mã quận huyện').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      }),
      tinhthanh_id: Joi.string().required().label('Mã tỉnh thành').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      }),
      maphuongxa: Joi.string().required().label('Mã phường xã').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      }),
      tenphuongxa: Joi.string().required().label('Tên phường xã').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      })
    }

    let newSchema = {}
    if(method === 'POST'){
      newSchema = Object.assign({}, objSchema)
    }else{
      for (let key in objSchema) {
        if (objSchema.hasOwnProperty(key) && body.hasOwnProperty(key)) {
          newSchema[key] = objSchema[key]
        }
      }
    }

    let schema = Joi.object().keys(newSchema);
    const { value, error } = Joi.validate(body, schema, {allowUnknown: true , abortEarly: true});
    if (error && error.details) {
      return { error };
    }
    return { value };
  },
};
