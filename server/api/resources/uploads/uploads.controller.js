export default {

  async uploadFiles(req, res) {
    try {
      const files = req.files
      if (!files) {
        return res.status(404).send({success: false, message: 'Dữ liệu tải lên không hợp lệ!'});
      }
      res.send({files, success: true})
    } catch (err) {
      return res.status(404).json({
        success: false,
        message: 'Không thể tải video lên, vui lòng kiểm tra và thử lại',
      });
    }
  },
};


