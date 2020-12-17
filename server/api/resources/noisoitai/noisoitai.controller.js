import DataEko from './noisoitai.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../utils/filterRequest'

export default {
  async create(req, res) {
    try {
      const dataEko = await DataEko.create(req.body);
      let dataRtn = await dataEko.populate({path: 'posture_id', select: 'name'})
        .populate({path: 'positon_id', select: 'name'})
        .populate({path: 'body_part_id', select: 'name'}).execPopulate()
      return res.json(dataRtn);
    } catch (err) {
      responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)
      if(req.query.limit && req.query.limit === '0'){
        const totalQuery = await DataEko.paginate(query, {limit: 0})
        req.query.limit = totalQuery.total
      }

      let options = optionsRequest(req.query)

      const dataEko = await DataEko.paginate(query, options)
      return res.json(dataEko);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },


  async findOne(req, res) {
    try {
      const { id } = req.params;
      const dataEko = await DataEko.findOne({is_deleted: false, _id: id});
      if (!dataEko) {
          responseAction.error(res, 404, '')
      }
      return res.json(dataEko);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      const dataEko = await DataEko.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });
      if (!dataEko) {
          responseAction.error(res, 404, '')
      }
      return res.json(dataEko);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const { id } = req.params;
      const dataEko = await DataEko.findOneAndUpdate({ _id: id }, req.body, { new: true })
        .populate({path: 'posture_id', select: 'name'})
        .populate({path: 'positon_id', select: 'name'})
        .populate({path: 'body_part_id', select: 'name'});
      if (!dataEko) {
          responseAction.error(res, 404, '')
      }
      return res.json(dataEko);
    } catch (err) {
      console.error(err);
      responseAction.error(res, 500, err.errors)
    }
  },
};
