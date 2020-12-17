import PhuongXa from './phuongxa.model';
import * as responseAction from '../../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';
import phuongxaService from "./phuongxa.service";
import QuanHuyen from '../quanhuyen/quanhuyen.model';

export default {
  async create(req, res) {
    try {
      const {value, error} = phuongxaService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }
      const phuongxa = await PhuongXa.create(value);
      let dataRtn = await phuongxa.populate({path: 'tinhthanh_id',select:'tentinh'}).populate({path: 'quanhuyen_id',select:'tenqh'}).execPopulate();
      return res.json(dataRtn);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async getAll(req, res) {
    try {

      /*// lấy danh sách quan-huyen:
      let dspx = await PhuongXa.find({}).populate({path: 'quanhuyen_id', select: 'tinhthanh_id'}).lean();
      for(let i = 0; i<dspx.length; i++){
        let data = dspx[i]
        console.log(i, 'i');
        let upt = await PhuongXa.findByIdAndUpdate(data._id, {tinhthanh_id: data.quanhuyen_id.tinhthanh_id}, {new: true})
      }
      return res.json({success: true})*/
      let query = filterRequest(req.query, true);

      let options = optionsRequest(req.query);
      options.select = '-is_deleted';
      options.sort = {tenphuongxa: 1}
      if (req.query.limit && req.query.limit === '0') {
        options.pagination = false;
      }
      options.populate=[{path: 'quanhuyen_id',select:'tenqh'}, {path: 'tinhthanh_id',select:'tentinh'}]
      const phuongxas = await PhuongXa.paginate(query, options);
      return res.json(phuongxas);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const {id} = req.params;
      const phuongxa = await PhuongXa.findById(id).populate({path: 'tinhthanh_id',select:'tentinh'}).populate({path: 'quanhuyen_id',select:'tenqh'})
      if (!phuongxa) {
        return responseAction.error(res, 404, '');
      }
      return res.json(phuongxa);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async delete(req, res) {
    try {
      const {id} = req.params;
      const phuongxa = await PhuongXa.findOneAndUpdate({_id: id}, {is_deleted: true}, {new: true});

      if (!phuongxa) {
        return responseAction.error(res, 404, '');
      }
      return res.json(phuongxa);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const {id} = req.params;

      const { value, error } = phuongxaService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }

      const phuongxa = await PhuongXa.findOneAndUpdate({_id: id}, value, {new: true})
        .populate({path: 'quanhuyen_id',select:'tenqh'})
        .populate({path: 'tinhthanh_id',select:'tentinh'})
      if (!phuongxa) {
        return responseAction.error(res, 404, '');
      }
      return res.json(phuongxa);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  }
};
