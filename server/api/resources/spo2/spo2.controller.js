import { filterRequest, optionsRequest } from '../../utils/filterRequest';
import SpO2 from './spo2.model';
import moment from 'moment';
import { now } from 'lodash';

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

      const data = await SpO2.paginate({}, options);
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async getDate(req, res) {
    try {
      const SPO2_MIN = 90;
      const id = req.params.id;
      const filterDate = req.query.date;

      let start = moment(filterDate).startOf('day').format();
      let end = moment(filterDate).endOf('day').format();
      let query = { created_at: { $gte: start, $lt: end } };

      const data = await SpO2.find(query);

      let underThresh = [];
      let subArray = [];
      let totalPulseRate = 0;
      let minPulseRate = 200;
      let maxPulseRate = 0;
      let totalPI = 0;
      let minPI = 100;
      let maxPI = 0;
      let totalSpO2 = 0;

      for (let i = 0; i < data.length; i++) {
        totalSpO2 += data[i].oxigenSaturation;
        totalPulseRate += data[i].pulseRate;
        if (maxPulseRate < data[i].pulseRate) maxPulseRate = data[i].pulseRate;
        if (minPulseRate > data[i].pulseRate) minPulseRate = data[i].pulseRate;


        totalPI += data[i].perfussionIndex;
        if (maxPI < data[i].perfussionIndex) maxPI = data[i].perfussionIndex;
        if (minPI > data[i].perfussionIndex) minPI = data[i].perfussionIndex;

        if (data[i].oxigenSaturation <= SPO2_MIN) {
          subArray.push(data[i]);
        } else {
          if (subArray.length > 0) {
            underThresh.push(subArray);
            subArray = [];
          }
        }
      }

      let underThreshRange = [];
      let totalTime = 0;
      let maxTimeRange = 0;
      for (let i = 0; i < underThresh.length; i++) {

        let d1 = new Date(underThresh[i][0].created_at);
        let d2 = new Date(underThresh[i][underThresh[i].length - 1].created_at);
        let diffTime = d2 - d1;
        if(diffTime === 0) diffTime = 1000
        if (diffTime > maxTimeRange) maxTimeRange = diffTime;
        underThreshRange.push({
          index: i + 1,
          averageTime: diffTime / underThresh[i].length,
          time: diffTime,
          value: underThresh[i],
        });
        totalTime += diffTime;
      }

      return res.json({
        averageSpO2: parseInt(totalSpO2 / data.length),
        averagePI: parseInt(totalPI / data.length),
        minPI: minPI,
        maxPI: maxPI,
        averagePulseRate: parseInt(totalPulseRate / data.length),
        maxPulseRate: maxPulseRate,
        minPulseRate: minPulseRate,
        totalTime: totalTime,
        maxTimeRange: maxTimeRange,
        eachTime: underThreshRange,
      });
    } catch (err) {
      console.log(err);
    }
  },

  async getAllDates(req, res) {
    try {
      const data = await SpO2.find().sort({ created_at: 'desc' });
      console.log(data.length);
      let currentDate = data[0].created_at;
      let totalDates = []
      let spo2 = 0;
      let count = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].created_at.getFullYear() === currentDate.getFullYear() &&
          data[i].created_at.getMonth() === currentDate.getMonth() &&
          data[i].created_at.getDate() === currentDate.getDate()) {
          spo2 += data[i].oxigenSaturation
          count++;
        }else{
          totalDates.push({
            spo2: parseInt(spo2 / count),
            date: currentDate
          })
          currentDate = data[i].created_at
          spo2 = data[i].oxigenSaturation
          count = 1
        }
      }
      if(count > 0){
        totalDates.push({
          spo2: parseInt(spo2 / count),
          date: currentDate
        })
      }

      return res.json({ data: totalDates });
    } catch (err) {
      console.log(err);
    }
  },
};
