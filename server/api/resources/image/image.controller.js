import Image from './image.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../utils/filterRequest'
import ImageService from "./image.service"
import moment from 'moment';
import path from 'path';
import DataSet from '../dataset/dataSet.model';

export default {
  async create(req, res) {
    try {
      const {value, error} = ImageService.validateBody(req.body, 'POST');
      if (error && error.details) {
        responseAction.error(res, 400, error.details[0]);
      }
      const dataAdd = await Image.create(value);
      let data;

      if (dataAdd) {
        data = await Image.findOne({is_deleted: false, _id: dataAdd._id})
          .populate({ path: 'datasetId' })
          .populate({ path: "labels.labelId" })
          .lean();
        let dataSetbyId = await DataSet.findOne({ is_deleted: false, _id: dataAdd.datasetId })
          .lean()
        const newImages = dataSetbyId.images ? dataSetbyId.images : []
        newImages.push(data?._id);
        await DataSet.findOneAndUpdate({ _id: dataAdd.datasetId }, newImages, { new: true })
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

      if (req.query.limit && req.query.limit === '0') {
        const totalQuery = await Image.paginate(query, { limit: 0 });
        req.query.limit = totalQuery.total;
      }

      const options = optionsRequest(req.query);
      options.lean = true;
      options.sort = { created_at: -1 };
      options.populate = [
        { path: 'datasetId' },
        { path: "labels.labelId" }
      ];

      let data = await Image.paginate(query, options);
      return res.json(data);
    } catch (e) {
      console.error(e);
      responseAction.error(res, 500, e.errors)
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await Image.findOne({ is_deleted: false, _id: id })
        .populate({ path: 'datasetId' })
        .populate({ path: "labels.labelId" })
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
      const data = await Image.findOneAndUpdate({ _id: id }, { is_deleted: true }, { new: true });
      if (data) {
        let dataSetbyId = await DataSet.findOne({ is_deleted: false, _id: data.datasetId })
        const newImages = dataSetbyId.images ? dataSetbyId.images : []
        const indexImg = newImages.findIndex((img) => img._id === data._id)
        newImages.split(indexImg, 1)
        await DataSet.findOneAndUpdate({ _id: dataAdd.datasetId }, newImages, { new: true })
      }
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
      const {value, error} = ImageService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        responseAction.error(res, 400, error.details[0]);
      }
      const data = await Image.findOneAndUpdate({ _id: id }, value, { new: true })
        .populate({ path: 'datasetId' })
        .populate({ path: "labels.labelId" })
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
