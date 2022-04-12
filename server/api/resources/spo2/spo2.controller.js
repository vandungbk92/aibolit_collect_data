import {filterRequest, optionsRequest} from '../../utils/filterRequest'
import SpO2 from './spo2.model';

export default {
  async create(req, res) {
    try {
      const data = await SpO2.create(req.body);
      return res.json(data);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async getAll(req, res) {
    try {
      let query = filterRequest(req.query, true);

      let options = optionsRequest(req.query);
      if (req.query.limit && req.query.limit === '0') {
        options.pagination = false;
      }

      const data = await SpO2.paginate({},options);
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
};
