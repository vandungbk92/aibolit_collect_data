import SpO2 from './spo2.model';
import Setting from '../setting/setting.model';
import moment from 'moment';
import OximeterHistory from './history.model';
import * as fs from 'fs';
import { filterRequest, optionsRequest } from '../../utils/filterRequest';
const carbone = require("carbone");
var pdf = require('html-pdf');
import mongoose from 'mongoose';
import { dateFormatterFromDate } from '../../utils/convertDateTime';

export default {

  async oximeterFile(req, res) {
    try {
      const id = req.user._id;
      let {typeRecord} = req.body;

      // Thông tin của file được gửi lên từ client.
      const oximeter = req.files && req.files.oximeter ? req.files.oximeter : '';

      if (!oximeter) {
        return res.status(404).send({ success: false, message: 'Dữ liệu của files hoặc ảnh tải lên không tồn tại.' });
      }

      // đọc dữ liệu từ file.
      let dataArray = fs.readFileSync(oximeter.path, 'utf8').split('\n');
      dataArray.pop();

      // lấy thông tin của Setting của người dùng.
      let setting = await Setting.findOne({user_id: id}).lean();
      if(!setting){
        setting = await Setting.create({user_id: _id, oximeter_min: 90, oximeter_max: 100, oximeter_monitor: 96, pulse_max: 100, pulse_min: 60})
      }
      const SPO2_MIN = setting.oximeter_monitor; // % SP02 dưới ngưỡng cần kiểm soát.

      let firstRecord = JSON.parse(dataArray[0]);
      let measurementDate = moment(firstRecord.time)
      let oximeter_id = null;
      if(typeRecord === '3' || typeRecord === 3){
        let timeStart = moment(firstRecord.time).subtract(2, 'seconds');
        let timeEnd = moment(firstRecord.time);
        let timeStartDay = moment().startOf('days');
        if(timeStart.toISOString() < timeStartDay.toISOString()){
          timeStart = timeStartDay
        }

        // kiểm tra xem có bản ghi nào trước đó k và lần đo gần nhất là đo phân tích.
        let spo2 = await SpO2.findOne({user_id: id, time: {$gte: timeStart, $lt: timeEnd}}).lean();
        let oximeter = await OximeterHistory.findOne({}).sort({measurementDate: -1}).lean();

        if(spo2 && oximeter && oximeter.typeRecord === 3){
          oximeter_id = spo2.oximeter_id

          // lấy danh sách toàn bộ spo2 của các bản ghi trước đó.
          let dsSPO2 = await SpO2.find({oximeter_id: oximeter_id})

          dataArray = [...dsSPO2, ...dataArray]
        }
      }

      let underThresh = []; // thông tin những lần dưới ngưỡng trong toàn bộ dữ liệu file.
      let subArray = []; // Bảng tạm chứa, thông tin 1 khoảng liên tục, dưới ngưỡng.
      let totalPulseRate = 0; // tổng của toàn bộ nhịp tim trong file.
      let minPulseRate = 200; // nhịp tim nhỏ nhất
      let maxPulseRate = 0; // nhịp tim lớn nhất.

      let totalPI = 0; // tổng toàn bộ PI trong file
      let minPI = 100;  // chỉ số tưới máu nhỏ nhất
      let maxPI = 0;  // chỉ số tưới máu lớn nhất.
      let minOximeter = 100;
      let maxOximeter = 50;

      let totalSpO2 = 0; //tổng toàn bộ chỉ số SP02 trong file.
      let details = []; // lưu thông tin của mỗi 1s đo.

      let totalTimeBelowThreshold = 0; // tổng thời gian dưới ngưỡng.
      let totalBelowThreshold = 0; // Tổng số lần dưới ngưỡng.
      let avgTimeBelowThreshold = 0; // trung bình thời gian dưới ngưỡng = tổng thời gian dưới ngưỡng / số lần dưới ngưỡng.
      let maxTimeRange = 0; // khoảng thời gian dưới ngưỡng lớn nhất.

      let totalTime = dataArray.length;
      for (let i = 0; i < dataArray.length; i++) {
        let data = dataArray[i]
        if(data){
          if(typeof data === 'string'){
            data = JSON.parse(dataArray[i]);
          }
          details.push(data);
          totalSpO2 += data.oxigenSaturation;
          totalPulseRate += data.pulseRate;
          totalPI += data.perfussionIndex;

          // tìm giá trị lớn nhất, nhỏ nhất của nhịp tim và PI
          if (maxPulseRate < data.pulseRate) maxPulseRate = data.pulseRate;
          if (minPulseRate > data.pulseRate) minPulseRate = data.pulseRate;
          if (maxPI < data.perfussionIndex) maxPI = data.perfussionIndex;
          if (minPI > data.perfussionIndex) minPI = data.perfussionIndex;
          if (maxOximeter < data.oxigenSaturation) maxOximeter = data.oxigenSaturation;
          if (minOximeter > data.oxigenSaturation) minOximeter = data.oxigenSaturation;

          // kiểm tra dưới ngưỡng, mỗi khoảng dưới ngưỡng là 1 array trong mảng underThresh.
          if (data.oxigenSaturation <= SPO2_MIN) {
            console.log(data.oxigenSaturation, '111111111')
            subArray.push(data);
            if(i === dataArray.length - 1){
              underThresh.push(subArray);
              subArray = [];
            }
          } else {
            if (subArray.length > 0 || i === dataArray.length - 1) {
              underThresh.push(subArray);
              subArray = [];
            }
          }
        }else{
          console.log('1111')
        }
      }

      // loop underThresh
      for (let i = 0; i < underThresh.length; i++) {

        /*let startDate = moment(underThresh[i][0].time); // thời gian lần đầu của mỗi khoảng.
        let endDate = moment(underThresh[i][underThresh[i].length - 1].time); // thời gian cuối của mỗi khoảng.

        let diffTime = endDate.diff(startDate, 'seconds');*/
        let diffTime = underThresh[i].length

        // tìm khoảng thời gian dưới ngưỡng lớn nhất.
        if (diffTime > maxTimeRange) maxTimeRange = diffTime;

        totalTimeBelowThreshold += diffTime;
        totalBelowThreshold += 1
      }
      if(totalBelowThreshold > 0){
        avgTimeBelowThreshold = totalTimeBelowThreshold / totalBelowThreshold
      }

      if(oximeter_id){
        await OximeterHistory.findByIdAndUpdate(oximeter_id, {
          avgSpO2: parseInt(totalSpO2 / totalTime), // giá trị sp02 trung bình
          avgPulseRate: parseInt(totalPulseRate / totalTime), // giá trị Pulse trung bình
          avgPI: parseInt(totalPI / totalTime), // giá trị PI trung bình
          minPI: minPI,
          maxPI: maxPI,
          minOximeter,
          maxOximeter,
          maxPulseRate: maxPulseRate,
          minPulseRate: minPulseRate,
          totalTime,
          totalTimeBelowThreshold: totalTimeBelowThreshold, // tổng thời gian dưới ngưỡng.
          totalBelowThreshold,
          avgTimeBelowThreshold,
          maxTimeRange: maxTimeRange, // thời gian dưới ngưỡng dài nhất
          user_id: id,
          typeRecord
        }, {new: true});
      }else{
        const insertedDate = await OximeterHistory.create({
          avgSpO2: parseInt(totalSpO2 / totalTime), // giá trị sp02 trung bình
          avgPulseRate: parseInt(totalPulseRate / totalTime), // giá trị Pulse trung bình
          avgPI: parseInt(totalPI / totalTime), // giá trị PI trung bình
          minPI: minPI,
          maxPI: maxPI,
          minOximeter,
          maxOximeter,
          maxPulseRate: maxPulseRate,
          minPulseRate: minPulseRate,
          totalTime,
          totalTimeBelowThreshold: totalTimeBelowThreshold, // tổng thời gian dưới ngưỡng.
          totalBelowThreshold,
          avgTimeBelowThreshold,
          maxTimeRange: maxTimeRange, // thời gian dưới ngưỡng dài nhất
          user_id: id,
          typeRecord,
          measurementDate,
          oximeterMonitor: SPO2_MIN
        });
        oximeter_id = insertedDate._id
      }

      let dataAddSP02 = []
      details = details.filter(data => {
        if(!data.oximeter_id){
          data.oximeter_id = oximeter_id
          data.user_id = id
          dataAddSP02 = [...dataAddSP02, data]
        }
      })

      await SpO2.create(dataAddSP02)
      return res.json({ success: true });
    } catch (e) {
      console.log(e)
      return res.status(500).send(e);
    }
  },

  async getDate(req, res) {
    try {
      const id = req.params.id;
      const filterDate = req.query.date;

      let start = moment(filterDate)
        .startOf('day')
        .format();
      let end = moment(filterDate)
        .endOf('day')
        .format();
      let query = { created_at: { $gte: start, $lt: end }, id_benhnhan: id };

      const spo2_data = await SpO2.find(query).sort({ created_at: 'asc' });
      const history_data = await OximeterHistory.find(query).sort({ created_at: 'asc' });

      let data = [];

      for (let i = 0; i < spo2_data.length; i++) {
        data.push({
          spo2_data: spo2_data[i],
          history_data: history_data[i],
        });
      }

      if (spo2_data && history_data)
        return res.json({
          data: data,
        });

      return res.status(404).json({
        message: 'Dữ liệu không tồn tại',
      });
    } catch (err) {
      console.log(err);
    }
  },

  async getAllDates(req, res) {
    try {
      let {measurementDate} = req.query
      let query = filterRequest(req.query, false)
      let options = optionsRequest(req.query)
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }

      if(measurementDate){
        query.measurementDate = {
          $gte: moment(measurementDate).startOf('days').toDate(),
          $lte: moment(measurementDate).endOf('days').toDate()
        }
      }

      options.sort = {measurementDate: -1}
      query.user_id = req.user._id;
      console.log(query, 'query')
      const data = await OximeterHistory.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async phantichFunc(req, res) {
    try{
      // lấy thông tin phân tích.
      let {id} = req.params;

      let data = await OximeterHistory.findById(id).lean();
      let templatePath = 'server/api/templates/test1.html';

      data.measurementDate = moment(data.measurementDate).lang("vi").format('dd DD MMMM YYYY HH:mm')

      data.percentBelowThreshold = data.totalTimeBelowThreshold / data.totalTime * 100

      data.totalTime = dateFormatterFromDate(data.totalTime);

      data.totalTimeBelowThreshold = dateFormatterFromDate(data.totalTimeBelowThreshold);
      data.avgTimeBelowThreshold = dateFormatterFromDate(data.avgTimeBelowThreshold);
      data.maxTimeRange = dateFormatterFromDate(data.maxTimeRange);

      // danh sách SP02 vẽ biểu đồ.
      let spo2List = await SpO2.find({oximeter_id: id}).sort({time: 1}).lean();
      let xValues = [];
      let yOxiValues = [];
      let yPulseValues = [];
      spo2List.forEach(curr => {
        xValues.push(moment(curr.time).format('HH:mm:ss'))
        yOxiValues.push(curr.oxigenSaturation)
        yPulseValues.push(curr.pulseRate)
      })
      data.xValues = xValues.join(',');
      data.yOxiValues = yOxiValues.join(',');
      data.yPulseValues = yPulseValues.join(',');
      carbone.render(
        templatePath,
        data,
        async function (err, result) {
          if (err) {
            console.log(err);
          }
          // fs.writeFileSync('result.html', result);
          // return res.json({data: 1})
          res.send(Buffer.from(result).toString());
          // let a = await fs.createReadStream(result)
          // res.send(a)
        }
      );
    }catch (e) {
      return res.status(500).send({success: false, message: "Có lỗi hệ thống"});
    }
  },

  async phantichFunc2(req, res) {
    var html = fs.readFileSync('server/api/templates/test1.html', 'utf8');
    var options = {company: "Thinklabs JSC", renderDelay : 500}

    pdf.create(html, options).toFile('./businesscard.pdf', function(err, data) {
      if (err) return console.log(err);
      console.log(data); // { filename: '/app/businesscard.pdf' }
      return res.json(data)
    });
  },
  async getListDateByUser(req, res) {
    try {
      const id = req.user._id;
      let data = await OximeterHistory.aggregate([
        { $match: {user_id: mongoose.Types.ObjectId(id)}},
        {
          $group: {
            _id: { year: { $year: "$measurementDate" }, month: { $month: "$measurementDate" }, day: {$dayOfMonth :"$measurementDate" } },
            measurementDate: {$last: "$measurementDate"},
            totalSpO2: { $sum: { $multiply: [ "$avgSpO2", "$totalTime" ] } },
            totalPulseRate: { $sum: { $multiply: [ "$avgPulseRate", "$totalTime" ] } },
            totalPI: { $sum: { $multiply: [ "$avgPI", "$totalTime" ] } },
            totalTime: { $sum: "$totalTime" },
            minPI: { $min: "$minPI" },
            maxPI: { $min: "$maxPI" },
            minPulseRate: { $min: "$minPulseRate" },
            maxPulseRate: { $min: "$maxPulseRate" },
            minOximeter: { $min: "$minOximeter" },
            maxOximeter: { $min: "$maxOximeter" },
            oximeterMonitor: { $first: "$oximeterMonitor" },
            totalTimeBelowThreshold: { $sum: "$totalTimeBelowThreshold" },
            totalBelowThreshold: { $sum: "$totalBelowThreshold" },
            maxTimeRange: { $max: "$maxTimeRange" },
            total: {$sum: 1}
          }
        }
      ])

      data = data.map(dtail => {
        let avgTimeBelowThreshold = dtail.totalBelowThreshold === 0 ? 0 : (dtail.totalTimeBelowThreshold / dtail.totalBelowThreshold) * 100
        return {...dtail,
          measurementDate: dtail.measurementDate,
          totalTime: dateFormatterFromDate(dtail.totalTime),
          totalTimeBelowThreshold: dateFormatterFromDate(dtail.totalTimeBelowThreshold),
          maxTimeRange: dateFormatterFromDate(dtail.maxTimeRange),

          avgSpO2: dtail.totalSpO2 / dtail.totalTime,
          avgPulseRate: dtail.totalPulseRate / dtail.totalTime,
          avgPI: dtail.totalPI / dtail.totalTime,
          avgTimeBelowThreshold: dateFormatterFromDate(avgTimeBelowThreshold)
        }
      })
      return res.json(data)
    } catch (err) {
      console.log(err);
    }
  },

  async funcDetailHtml(req, res) {
    try {
      const id = req.params.id;
      const filterDate = req.query.date;

      let start = moment(filterDate)
        .startOf('day')
        .format();
      let end = moment(filterDate)
        .endOf('day')
        .format();
      let query = { created_at: { $gte: start, $lt: end }, id_benhnhan: id };

      const spo2_data = await SpO2.find(query).sort({ created_at: 'asc' });
      const history_data = await OximeterHistory.find(query).sort({ created_at: 'asc' });

      let data = [];

      for (let i = 0; i < spo2_data.length; i++) {
        data.push({
          spo2_data: spo2_data[i],
          history_data: history_data[i],
        });
      }

      if (spo2_data && history_data)
        return res.json({
          data: data,
        });

      return res.status(404).json({
        message: 'Dữ liệu không tồn tại',
      });
    } catch (err) {
      console.log(err);
    }
  },
};
