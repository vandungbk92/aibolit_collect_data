import QuanlyDulieu from './quanlydulieu.model';
import Image from '../image/image.model';
import Video from '../video/video.model';
import Audio from '../audio/audio.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../utils/filterRequest'
import quanlycongviecService from './quanlydulieu.service';

export default {
  async create(req, res) {
    try {
      let {value, error} = quanlycongviecService.validateBody(req.body, 'POST');
      if (error && error.details) {
        responseAction.error(res, 400, error.details[0]);
      }

      value.nhanvien_id = req.user._id
      const dataAdd = await QuanlyDulieu.create(value);
      // if có datasetId thì cập nhật các Image, Video, Audio.
      let reqApi = [];
      if(value?.hinhanh?.length) reqApi.push(Image.updateMany({_id: {$in: value.hinhanh}}, {datasetId: value?.datasetId, dulieuId: dataAdd._id}, {multi: true}))
      if(value?.video?.length) reqApi.push(Video.updateMany({_id: {$in: value.video}}, {datasetId: value?.datasetId, dulieuId: dataAdd._id}, {multi: true}))
      if(value?.audio?.length) reqApi.push(Audio.updateMany({_id: {$in: value.audio}}, {datasetId: value?.datasetId, dulieuId: dataAdd._id}, {multi: true}))
      if(reqApi.length){
        await Promise.all(reqApi)
      }
      let data = await dataAdd
        .populate('hinhanh')
        .populate('video')
        .populate('audio')
        .populate({path: 'datasetId', select: 'dataset_name'})
        .populate({path: 'nhanvien_id', select: 'full_name'})
        .execPopulate()

      return res.json(data);
    } catch (e) {
      console.error(e);
      responseAction.error(res, 500, e.errors)
    }
  },

  async getAll(req, res) {
    try {
      let query = filterRequest(req.query, true);
      if(req.user.role === 'QUAN_LY'){
        query.user_id = req.user._id
      }
      if (req.query.limit && req.query.limit === '0') {
        const totalQuery = await QuanlyDulieu.paginate(query, { limit: 0 });
        req.query.limit = totalQuery.total;
      }

      const options = optionsRequest(req.query);
      options.lean = true;
      options.sort = { created_at: -1 };
      options.populate = [
        { path: 'nhanvien_id', select: 'full_name'},
        { path: 'hinhanh'},
        { path: 'video'},
        { path: 'audio'},
        {path: 'datasetId', select: 'dataset_name'}
      ];

      let data = await QuanlyDulieu.paginate(query, options);
      return res.json(data);
    } catch (e) {
      console.error(e);
      responseAction.error(res, 500, e.errors)
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await QuanlyDulieu.findOne({ is_deleted: false, _id: id })
        .populate({ path: 'nhanvien_id', select: 'full_name' })
        .populate('hinhanh')
        .populate('video')
        .populate('audio')
        .populate({path: 'datasetId', select: 'dataset_name'})
        .lean();
      if (!data) {
        responseAction.error(res, 404, '');
      }
      return res.json(data);
    } catch (e) {
      console.error(e);
      responseAction.error(res, 500, e.errors)
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await QuanlyDulieu.findOneAndUpdate({ _id: id }, { is_deleted: true }, { new: true });

      if (!data) {
        responseAction.error(res, 404, '');
      }

      return res.json(data);
    } catch (e) {
      console.error(e);
      responseAction.error(res, 500, e.errors)
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const {value, error} = quanlycongviecService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        responseAction.error(res, 400, error.details[0]);
      }
      const data = await QuanlyDulieu.findOneAndUpdate({ _id: id }, value, { new: true })
        .populate({ path: 'nhanvien_id', select: 'full_name' })
        .populate('hinhanh')
        .populate('video')
        .populate('audio')
        .populate({path: 'datasetId', select: 'dataset_name'})
        .lean();

      if (!data) {
        return responseAction.error(res, 404, '');
      }

      let reqApi = [];
      if(data?.hinhanh?.length) reqApi.push(Image.updateMany({_id: {$in: data.hinhanh}}, {datasetId: data?.datasetId}, {multi: true}))
      if(data?.video?.length) reqApi.push(Video.updateMany({_id: {$in: data.video}}, {datasetId: data?.datasetId}, {multi: true}))
      if(data?.audio?.length) reqApi.push(Audio.updateMany({_id: {$in: data.audio}}, {datasetId: data?.datasetId}, {multi: true}))
      if(reqApi.length){
        await Promise.all(reqApi)
      }


      return res.json(data);
    } catch (e) {
      console.error(e);
      responseAction.error(res, 500, e.errors)
    }
  }
}
