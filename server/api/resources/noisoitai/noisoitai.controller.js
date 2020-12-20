import NoiSoiTai from './noisoitai.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../utils/filterRequest'

export default {
  async create(req, res) {
    try {

      // lấy mã số lớn nhất của ngày hnay.
      let dateFormat = new Date();
      let yyyymmdd = `${dateFormat.getFullYear()}${('0' + (dateFormat.getMonth() + 1)).slice(-2)}${('0' + dateFormat.getDate()).slice(-2)}`;
      let filterDate = `^${yyyymmdd}`
      let dataCheck = await NoiSoiTai.findOne({
        makham: new RegExp(filterDate)
      }).sort({makham: -1})

      let makham = yyyymmdd + '0001'
      if(dataCheck){
        makham = parseInt(dataCheck.makham) + 1
      }
      req.body.makham = makham
      req.body.user_id = req.user._id

      const data = await NoiSoiTai.create(req.body);
      let dataRtn = await data.populate({path: 'tinhthanh_id', select: 'tentinh'})
        .populate({path: 'quanhuyen_id', select: 'tenqh'})
        .populate({path: 'phuongxa_id', select: 'tenphuongxa'})
        .populate({path: 'trieuchung_id', select: 'trieuchung'})
        .populate({path: 'benh_id', select: 'benh'}).execPopulate()
      return res.json(dataRtn);
    } catch (err) {
      responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)
      if(req.user.role === 'QUAN_LY'){
        query.user_id = req.user._id
      }
      let options = optionsRequest(req.query)
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      options.populate = [
        {path: 'tinhthanh_id', select: 'tentinh'},
        {path: 'quanhuyen_id', select: 'tenqh'},
        {path: 'phuongxa_id', select: 'tenphuongxa'},
        {path: 'trieuchung_id', select: 'trieuchung'},
        {path: 'benh_id', select: 'benh'}
      ]
      const data = await NoiSoiTai.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },


  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await NoiSoiTai.findOne({is_deleted: false, _id: id})
        .populate({path: 'tinhthanh_id', select: 'tentinh'})
        .populate({path: 'quanhuyen_id', select: 'tenqh'})
        .populate({path: 'phuongxa_id', select: 'tenphuongxa'})
        .populate({path: 'trieuchung_id', select: 'trieuchung'})
        .populate({path: 'benh_id', select: 'benh'})
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
      const data = await NoiSoiTai.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });
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
      const data = await NoiSoiTai.findOneAndUpdate({ _id: id }, req.body, { new: true })
        .populate({path: 'tinhthanh_id', select: 'tentinh'})
        .populate({path: 'quanhuyen_id', select: 'tenqh'})
        .populate({path: 'phuongxa_id', select: 'tenphuongxa'})
        .populate({path: 'trieuchung_id', select: 'trieuchung'})
        .populate({path: 'benh_id', select: 'benh'})
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
