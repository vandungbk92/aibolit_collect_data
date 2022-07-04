import Video from './video.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../utils/filterRequest'
import VideoService from "./video.service"
import moment from 'moment';
import path from 'path';

export default {
  async create(req, res) {
    try {
      const {value, error} = VideoService.validateBody(req.body, 'POST');
      if (error && error.details) {
        responseAction.error(res, 400, error.details[0]);
      }
      const dataAdd = await Video.create(value);
      let data;

      if (dataAdd) {
        data = await Video.findOne({is_deleted: false, _id: dataAdd._id})
          .populate({ path: 'datasetId' })
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
      // if(req.user.role === 'QUAN_LY'){
      //   query.user_id = req.user._id
      // }
      if (req.query.limit && req.query.limit === '0') {
        const totalQuery = await Video.paginate(query, { limit: 0 });
        req.query.limit = totalQuery.total;
      }

      const options = optionsRequest(req.query);
      options.lean = true;
      options.sort = { created_at: -1 };
      options.populate = [
        { path: 'datasetId' },
      ];

      let data = await Video.paginate(query, options);
      return res.json(data);
    } catch (e) {
      console.error(e);
      responseAction.error(res, 500, e.errors)
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await Video.findOne({ is_deleted: false, _id: id })
        .populate({ path: 'datasetId' })
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
      const data = await Video.findOneAndUpdate({ _id: id }, { is_deleted: true }, { new: true });

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
      const {value, error} = VideoService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        responseAction.error(res, 400, error.details[0]);
      }
      const data = await Video.findOneAndUpdate({ _id: id }, value, { new: true })
        .populate({ path: 'datasetId' })
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
