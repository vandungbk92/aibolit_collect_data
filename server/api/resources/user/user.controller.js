import jwt from "../../helpers/jwt";

import User from "./user.model";
import userService from "./user.service";

export default {
  async authenticate(req, res) {
    return res.status(200).json(req.user);
  },

  async login(req, res) {
    try {
      const { value, error } = userService.validateLogin(req.body);
      if (error) {
        return res.status(400).json(error);
      }

      // Đầu tiên kiểm tra xem có phải tài khoản của giáo viên không.
      const user = await User.findOne({ username: value.username, is_deleted: false });
      if (!user) {
        return res.status(401).json({ success: false, message: "Tài khoản hoặc mật khẩu không đúng" });
      }
      // nếu giáo viên tồn tại và đúng mật khẩu thì trả về.
      if (user) {
        const authenticted = userService.comparePassword(value.password, user.password);
        if (authenticted) {
          if (!user.active) {
            return res
              .status(401)
              .json({ success: false, message: "Tài khoản đã tạm khóa, vui lòng liên hệ quản trị viên." });
          }
          const token = jwt.issue({ id: user._id, isUser: true }, "10d");
          return res.json({ token });
        }
        return res.status(401).json({ success: false, message: "Tài khoản hoặc mật khẩu không đúng" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  }
};
