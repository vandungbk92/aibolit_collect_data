import Setting from './setting.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../utils/filterRequest'

export default {
  async create(req, res) {
    try {
      const data = await Setting.create(req.body);
      return res.json(data);
    } catch (err) {
      responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)
      let options = optionsRequest(req.query)
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      const data = await Setting.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findSettingByUser(req, res) {
    try {
      let _id = req.user._id;
      // lấy thông tin Setting của người dùng.
      let data = await Setting.findOne({user_id: _id});
      if(!data){
        data = await Setting.create({user_id: _id, oximeter_min: 90, oximeter_max: 100, oximeter_monitor: 96, pulse_max: 100, pulse_min: 60})
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async putSettingByUser(req, res) {
    try {
      let _id = req.user._id;
      const data = await Setting.findOneAndUpdate({ user_id: _id }, req.body, { new: true })
      if (!data) {
        return responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },


  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await Setting.findOne({is_deleted: false, _id: id})
      if (!data) {
          responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await Setting.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });
      if (!data) {
          responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await Setting.findOneAndUpdate({ _id: id }, req.body, { new: true })
      if (!data) {
          responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      responseAction.error(res, 500, err.errors)
    }
  },
};
