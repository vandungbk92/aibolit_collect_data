import path from 'path';
import * as fileUtils from '../../utils/fileUtils';

import { getConfig } from '../../../config/config';
const config = getConfig(process.env.NODE_ENV);
const conf = config.cos.credentials;
const {bucketName} = config.cos;

export default {
  findFileById(req, res) {
    // return res.redirect(fileUtils.getUrlFile(req.params.id));
  },
  async uploadFile(req, res) {
    try {
      const image = req.files && req.files.image ? req.files.image : '';
      if (!image) {
        return res.status(404).send({ success: false, message: 'Dữ liệu của files hoặc ảnh tải lên không tồn tại.' });
      }

      const {originalFilename} = image;

      const extension = path.extname(originalFilename);
      const fileWithoutExtension = fileUtils.formatFileName(path.basename(originalFilename, extension));
      const date_val = new Date();
      const timestam = date_val.getTime();
      const fileStorage = `${fileWithoutExtension  }_${  timestam  }${extension}`;
      const uri = `${conf.endpoint  }/${  bucketName  }/${  fileStorage}`;
      const a = await fileUtils.createByName(req.files.image.path, fileStorage)
        /* .then(filename => {
          console.log(filename, 'fileUtils.createByName');
        })
        .catch(err => {
          console.log(err, '1');
        }); */
      console.log(a, 'aa')
      return res.status(200).send({ success: true, image_id: uri });
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  }
};
