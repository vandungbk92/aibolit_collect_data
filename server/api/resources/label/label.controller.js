import Label from './label.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../utils/filterRequest'
import labelService from "./label.service"
import moment from 'moment';
import path from 'path';
import DataSet from '../dataSet/dataSet.model';

export default {
  async create(req, res) {
    try {
      const {value, error} = labelService.validateBody(req.body, 'POST');
      if (error && error.details) {
        responseAction.error(res, 400, error.details[0]);
      }
      const dataAdd = await Label.create(value);
      let data;

      if (dataAdd) {
        data = await Label.findOne({is_deleted: false, _id: dataAdd._id})
          .populate({path:'datasetId'})
          .lean()

        let dataSetbyId = await DataSet.findOne({ is_deleted: false, _id: dataAdd.datasetId })
          .lean()
        const newlabel = dataSetbyId.label_cate ? dataSetbyId.label_cate : []
        newlabel.push(data?._id);
        await DataSet.findOneAndUpdate({ _id: dataAdd.datasetId }, newlabel, { new: true })
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
        const totalQuery = await Label.paginate(query, { limit: 0 });
        req.query.limit = totalQuery.total;
      }

      const options = optionsRequest(req.query);
      options.lean = true;
      options.sort = { created_at: -1 };
      options.populate = [
        {path:'datasetId'},
      ];

      let data = await Label.paginate(query, options);
      return res.json(data);
    } catch (e) {
      console.error(e);
      responseAction.error(res, 500, e.errors)
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await Label.findOne({ is_deleted: false, _id: id })
        .populate({path:'datasetId'})
        .lean()

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
      const data = await Label.findOneAndUpdate({ _id: id }, { is_deleted: true }, { new: true });

      if (!data) {
        responseAction.error(res, 404, '');
      }
      if (data) {
        let dataSetbyId = await DataSet.findOne({ is_deleted: false, _id: data.datasetId })
        const newlabel = dataSetbyId.label_cate ? dataSetbyId.label_cate : []
        const indexLabel = newlabel.findIndex((label) => label._id === data._id)
        newlabel.split(indexLabel, 1)
        await DataSet.findOneAndUpdate({ _id: dataAdd.datasetId }, newlabel, { new: true })
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
      const {value, error} = labelService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        responseAction.error(res, 400, error.details[0]);
      }
      const data = await Label.findOneAndUpdate({ _id: id }, value, { new: true })
        .populate({path:'datasetId'})
        .lean()

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
