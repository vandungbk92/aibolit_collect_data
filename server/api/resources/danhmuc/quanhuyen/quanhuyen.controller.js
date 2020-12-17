import QuanHuyen from './quanhuyen.model';
import PhuongXa from '../phuongxa/phuongxa.model';

import * as responseAction from '../../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';
import quanhuyenService from "./quanhuyen.service";

export default {
  async create(req, res) {
    try {
      const {value, error} = quanhuyenService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }
      const quanhuyen = await QuanHuyen.create(value);
      return res.json(quanhuyen);
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
      options.sort = {tenqh: 1}
      if (req.query.limit && req.query.limit === '0') {
        options.pagination = false;
      }
      options.populate = {path: 'tinhthanh_id',select:'tentinh'}
      const quanhuyens = await QuanHuyen.paginate(query, options);
      return res.json(quanhuyens);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const {id} = req.params;
      const quanhuyen = await QuanHuyen.findById(id);
      if (!quanhuyen) {
        return responseAction.error(res, 404, '');
      }
      return res.json(quanhuyen);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async delete(req, res) {
    try {
      const {id} = req.params;
      const quanhuyen = await QuanHuyen.findOneAndUpdate({_id: id}, {is_deleted: true}, {new: true});

      if (!quanhuyen) {
        return responseAction.error(res, 404, '');
      }
      return res.json(quanhuyen);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const {id} = req.params;

      const { value, error } = quanhuyenService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }

      const quanhuyen = await QuanHuyen.findOneAndUpdate({_id: id}, value, {new: true})
        .populate({path: 'tinhthanh_id',select:'tentinh'});

      if (!quanhuyen) {
        return responseAction.error(res, 404, '');
      }
      return res.json(quanhuyen);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async dsPhuongXaByHuyen(req, res) {
    const {id} = req.params;
    let phuongxa = await PhuongXa.find({is_deleted: false, quanhuyen_id: id}).sort({name: 1})
    return res.json(phuongxa)
  }
};
