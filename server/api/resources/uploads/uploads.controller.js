import Image from '../image/image.model';
import Audio from '../audio/audio.model';
import Video from '../video/video.model';
import { getConfig } from "../../../config/config";
const config = getConfig(process.env.NODE_ENV);

export default {

  async uploadFiles(req, res) {
    try {
      const {files} = req.files;
      let {type, datasetId} = req.body;
      console.log(type,'type');
      console.log(datasetId,'datasetId');

      if (!files || !files?.length || !type) {
        return res.status(404).send({success: false, message: 'Dữ liệu tải lên không hợp lệ!'});
      }
      let dataRtn
      if(type === 'image'){
        let dataImage = files?.map(data => {
          console.log(data, 'dataImage');
          let path = data?.path.split("\\");
          let img_path = '';
          let idxStart = false
          path.forEach(curr => {
            console.log(curr,'curr');
            if(curr === 'server') idxStart = true
            if(idxStart) img_path += '/' + curr
          });
          console.log(img_path,'img_path');
          return {
            img_name: data?.filename,
            img_originalname : data?.originalname,
            img_desc: config.host_admin + '/',
            img_uri: config.host_admin + img_path,
            img_path: img_path,
            datasetId : datasetId || null,
          }
        })
        dataRtn = await Image.create(dataImage)
      }else if(type === 'video'){
        let dataImage = files?.map(data => {
          let path = data?.path.split("\\");
          let img_path = '';
          let idxStart = false
          path.forEach(curr => {
            if(curr === 'server') idxStart = true
            if(idxStart) img_path += '/' + curr
          });
          return {
            video_name: data?.filename,
            video_originalname : data?.originalname,
            video_desc: "",
            video_uri: config.host_admin + img_path,
            video_path: img_path,
            datasetId : datasetId || null,
          }
        })
        dataRtn = await Video.create(dataImage)
      }else if(type === 'audio'){
        let dataImage = files?.map(data => {
          let path = data?.path.split("\\");
          let img_path = '';
          let idxStart = false
          path.forEach(curr => {
            if(curr === 'server') idxStart = true
            if(idxStart) img_path += '/' + curr
          });
          return {
            audio_name: data?.filename,
            audio_originalname : data?.originalname,
            audio_desc: "",
            audio_uri: config.host_admin + img_path,
            audio_path: img_path,
            datasetId : datasetId || null,
          }
        })
        dataRtn = await Audio.create(dataImage)
      }
      res.send(dataRtn)
    } catch (err) {
      return res.status(404).json({
        success: false,
        message: 'Không thể tải video lên, vui lòng kiểm tra và thử lại',
      });
    }
  },
};


