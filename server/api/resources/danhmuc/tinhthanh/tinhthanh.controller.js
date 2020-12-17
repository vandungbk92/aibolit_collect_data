import TinhThanh from './tinhthanh.model';
import QuanHuyen from '../quanhuyen/quanhuyen.model';

import * as responseAction from '../../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';
import tinhthanhService from "./tinhthanh.service";

export default {
  async create(req, res) {
    try {
      const {value, error} = tinhthanhService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }

      // kiểm tra dantoc đã tồn tại chưa, nếu tồn tại thì không cho tạo mới.
      let dataCheck = await TinhThanh.findOne({is_deleted: false, $or: [{matinh: value.matinh}, {tentinh: value.tentinh}]});
      if(dataCheck){
        if(dataCheck.matinh === value.matinh){
          return res.status(400).json({success: false, message: 'Mã tỉnh đã tồn tại, vui lòng kiểm tra và thử lại.'})
        }
        if(dataCheck.tentinh === value.tentinh){
          return res.status(400).json({success: false, message: 'Tên tỉnh tỉnh đã tồn tại, vui lòng kiểm tra và thử lại.'})
        }
      }

      const tinhthanh = await TinhThanh.create(value);
      return res.json(tinhthanh);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async getAll(req, res) {
    try {
      let query = filterRequest(req.query, true);

      let options = optionsRequest(req.query);
      options.select = '-is_deleted';
      options.sort = {matinh: 1}
      if (req.query.limit && req.query.limit === '0') {
        options.pagination = false;
      }
      // return res.json({success: true})
      const tinhthanhs = await TinhThanh.paginate(query, options);
      return res.json(tinhthanhs);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const {id} = req.params;
      const tinhthanh = await TinhThanh.findById(id);
      if (!tinhthanh) {
        return responseAction.error(res, 404, '')

      }
      return res.json(tinhthanh);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async delete(req, res) {
    try {
      const {id} = req.params;
      const tinhthanh = await TinhThanh.findOneAndUpdate({_id: id}, {is_deleted: true}, {new: true});

      if (!tinhthanh) {
        return responseAction.error(res, 404, '')

      }
      return res.json(tinhthanh);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const {id} = req.params;

      const { value, error } = tinhthanhService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }

      // kiểm tra dantoc đã tồn tại chưa, nếu tồn tại thì không cho tạo mới.
      if(value.matinh){
        let dataCheck = await TinhThanh.findOne({_id: {$ne: id}, is_deleted: false, matinh: value.matinh});
        if(dataCheck){
          return res.status(400).json({success: false, message: 'Mã tỉnh đã tồn tại, vui lòng kiểm tra và thử lại.'})
        }
      }

      // kiểm tra dantoc đã tồn tại chưa, nếu tồn tại thì không cho tạo mới.
      if(value.tentinh){
        let dataCheck = await TinhThanh.findOne({_id: {$ne: id}, is_deleted: false, tentinh: value.tentinh});
        if(dataCheck){
          return res.status(400).json({success: false, message: 'Tên tỉnh tỉnh đã tồn tại, vui lòng kiểm tra và thử lại.'})
        }
      }

      const tinhthanh = await TinhThanh.findOneAndUpdate({_id: id}, value, {new: true});
      if (!tinhthanh) {
        return responseAction.error(res, 404, '');
      }
      return res.json(tinhthanh);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async dsQuanHuyenByTinh(req, res) {
    const {id} = req.params;
    let district = await QuanHuyen.find({is_deleted: false, tinhthanh_id: id}).sort({name: 1});
    return res.json(district)
  }
};
