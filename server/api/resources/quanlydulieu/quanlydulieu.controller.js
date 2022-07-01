import QuanlyDulieu from './quanlydulieu.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../utils/filterRequest'
import quanlycongviecService from './quanlydulieu.service';
import moment from 'moment';
import path from 'path';

export default {
  async create(req, res) {
    try {
      const {value, error} = quanlycongviecService.validateBody(req.body, 'POST');
      if (error && error.details) {
        responseAction.error(res, 400, error.details[0]);
      }
      const dataAdd = await QuanlyDulieu.create(value);
      let data;

      if (dataAdd) {
        data = await QuanlyDulieu.findOne({is_deleted: false, _id: dataAdd._id})
          .populate({ path: 'nhanvien_id', select: 'full_name' })
          .lean();
      }
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
        {
          path: 'nhanvien_id',
          select: 'full_name',
        },
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
        .lean();

      if (!data) {
        responseAction.error(res, 404, '');
      }

      return res.json(data);
    } catch (e) {
      console.error(e);
      responseAction.error(res, 500, e.errors)
    }
  }
}
