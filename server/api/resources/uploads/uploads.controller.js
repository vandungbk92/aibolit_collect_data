import Image from '../image/image.model';
import { getConfig } from "../../../config/config";
const config = getConfig(process.env.NODE_ENV);

export default {

  async uploadFiles(req, res) {
    try {
      const {files} = req.files;
      console.log(req.body.type, 'files')
      // const body = req.body
      // console.log('files',files.length);
      // console.log('body',body);
      let {type} = req.body;

      if (!files || !files?.length) {
        return res.status(404).send({success: false, message: 'Dữ liệu tải lên không hợp lệ!'});
      }
      if(type === 'image'){
        let dataImage = files?.map(data => {
          let path = data?.path.split("\\");
          let img_path = '';
          let idxStart = false
          path.forEach(curr => {
            if(curr === 'server') idxStart = true
            if(idxStart) img_path += '/' + curr
          });
          return {
            img_name: data?.filename,
            img_originalname : data?.originalname,
            img_desc: config.host_admin + '/',
            img_uri: config.host_admin + img_path,
            img_path: img_path,
            datasetId : '',
          }
        })
        console.log(dataImage, 'dataImage')
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


