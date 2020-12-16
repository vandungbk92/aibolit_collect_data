import Joi from "joi";
import bcrypt from "bcryptjs";

export default {
  validateLogin(body) {
    const schema = Joi.object({
      username: Joi.string()
        .label("Tài khoản")
        .required()
        .error(errors => {
          return {
            template: "không được bỏ trống"
          };
        }),
      password: Joi.string()
        .label("Mật khẩu")
        .required()
        .error(errors => {
          return {
            template: "không được bỏ trống"
          };
        })
    });
    const { value, error } = Joi.validate(body, schema);
    if (error && error.details) {
      return { error };
    }
    return { value };
  },
  comparePassword(plainText, encrypedPassword) {
    return bcrypt.compareSync(plainText, encrypedPassword);
  }
};
