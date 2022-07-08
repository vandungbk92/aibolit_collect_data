import Dataset from './dataSet.model';
import Image from '../image/image.model';
import Label from '../label/label.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../utils/filterRequest'
import dataSetService from './dataSet.service';


export default {
  async create(req, res) {
    try {
      const {value, error} = dataSetService.validateBody(req.body, 'POST');
      if (error && error.details) {
        responseAction.error(res, 400, error.details[0]);
      }
      const dataAdd = await Dataset.create(value);
      let data;

      if (dataAdd) {
        data = await Dataset.findOne({is_deleted: false, _id: dataAdd._id})
          .populate({ path: 'images' })
          .populate({ path: 'video' })
          .populate({ path: 'audio' })
          .populate({ path: 'label_cate'})
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
        const totalQuery = await Dataset.paginate(query, { limit: 0 });
        req.query.limit = totalQuery.total;
      }

      const options = optionsRequest(req.query);
      options.lean = true;
      options.sort = { created_at: -1 };
      options.populate = [
        { path: 'images' },
        { path: 'video' },
        { path: 'audio' },
        { path: 'label_cate'}
      ];

      let data = await Dataset.paginate(query, options);
      return res.json(data);
    } catch (e) {
      console.error(e);
      responseAction.error(res, 500, e.errors)
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await Dataset.findOne({ is_deleted: false, _id: id })
        .populate({ path: 'images' })
        .populate({ path: 'video' })
        .populate({ path: 'audio' })
        .populate({ path: 'label_cate'})
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

  async getAllImage(req, res) {
    try {
      const { id } = req.params;
      const data = await Image.find({ is_deleted: false, datasetId: id }).lean();
      return res.json(data);
    } catch (e) {
      console.error(e);
      return responseAction.error(res, 500, e.errors)
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await Dataset.findOneAndUpdate({ _id: id }, { is_deleted: true }, { new: true });
      if (!data) {
        responseAction.error(res, 404, '');
      }
      // xóa dữ liệu label.
      await Label.updateMany({datasetId: id}, {$set: {is_deleted: true}}, {multi: true});
      return res.json(data);
    } catch (e) {
      console.error(e);
      responseAction.error(res, 500, e.errors)
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const {value, error} = dataSetService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        responseAction.error(res, 400, error.details[0]);
      }
      const data = await Dataset.findOneAndUpdate({ _id: id }, value, { new: true })
        .populate({ path: 'images' })
        .populate({ path: 'video' })
        .populate({ path: 'audio' })
        .populate({ path: 'label_cate' }).lean();

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
