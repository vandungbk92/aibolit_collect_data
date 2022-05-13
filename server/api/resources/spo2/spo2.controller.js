import { filterRequest, optionsRequest } from "../../utils/filterRequest";
import SpO2 from "./spo2.model";
import moment from "moment";
import OximeterHistory from "./history.model";
import * as fs from "fs";

export default {
  async oximeterFile(req, res) {
    try {
      const id = req.params.id;
      const oximeter = req.files && req.files.oximeter ? req.files.oximeter : "";
      if (!oximeter) {
        return res.status(404).send({ success: false, message: "Dữ liệu của files hoặc ảnh tải lên không tồn tại." });
      }

      const dataArray = fs.readFileSync(oximeter.path, "utf8").split("\n");

      const SPO2_MIN = 98;
      let underThresh = [];
      let subArray = [];
      let totalPulseRate = 0;
      let minPulseRate = 200;
      let maxPulseRate = 0;
      let totalPI = 0;
      let minPI = 100;
      let maxPI = 0;
      let totalSpO2 = 0;

      let details = [];

      for (let i = 0; i < dataArray.length - 1; i++) {
        const json = JSON.parse(dataArray[i]);
        const { time, data } = json;

        details.push({
          oxigenSaturation: data.oxigenSaturation,
          pulseRate: data.pulseRate,
          perfussionIndex: data.perfussionIndex,
          time: new Date(time)
        });

        totalSpO2 += data.oxigenSaturation;
        totalPulseRate += data.pulseRate;
        if (maxPulseRate < data.pulseRate) maxPulseRate = data.pulseRate;
        if (minPulseRate > data.pulseRate) minPulseRate = data.pulseRate;

        totalPI += data.perfussionIndex;
        if (maxPI < data.perfussionIndex) maxPI = data.perfussionIndex;
        if (minPI > data.perfussionIndex) minPI = data.perfussionIndex;

        if (data.oxigenSaturation <= SPO2_MIN) {
          subArray.push(json);
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
        let d1 = new Date(underThresh[i][0].time);
        let d2 = new Date(underThresh[i][underThresh[i].length - 1].time);
        let diffTime = d2 - d1;
        if (diffTime === 0) diffTime = 1000;
        if (diffTime > maxTimeRange) maxTimeRange = diffTime;
        underThreshRange.push({
          index: i + 1,
          averageTime: diffTime / underThresh[i].length,
          time: diffTime
        });
        totalTime += diffTime;
      }

      await SpO2.create({
        data: details,
        id_benhnhan: id
      });

      const insertedDate = await OximeterHistory.create({
        avgSpO2: parseInt(totalSpO2 / dataArray.length),
        avgPulseRate: parseInt(totalPulseRate / dataArray.length),
        avgPI: parseInt(totalPI / dataArray.length),
        minPI: minPI,
        maxPI: maxPI,
        maxPulseRate: maxPulseRate,
        minPulseRate: minPulseRate,
        totalTime: totalTime,
        maxTimeRange: maxTimeRange,
        eachTime: underThreshRange,
        id_benhnhan: id
      });

      return res.json({ insertedDate });
    } catch (e) {
      return res.status(500).send(e);
    }
  },

  async getDate(req, res) {
    try {
      const id = req.params.id;
      const filterDate = req.query.date;

      let start = moment(filterDate)
        .startOf("day")
        .format();
      let end = moment(filterDate)
        .endOf("day")
        .format();
      let query = { created_at: { $gte: start, $lt: end }, id_benhnhan: id };

      const spo2_data = await SpO2.find(query).sort({ created_at: "asc" });
      const history_data = await OximeterHistory.find(query).sort({ created_at: "asc" });

      let data = [];

      for (let i = 0; i < spo2_data.length; i++) {
        data.push({
          spo2_data: spo2_data[i],
          history_data: history_data[i]
        });
      }

      if (spo2_data && history_data)
        return res.json({
          data: data
        });

      return res.status(404).json({
        message: "Dữ liệu không tồn tại"
      });
    } catch (err) {
      console.log(err);
    }
  },

  async getAllDates(req, res) {
    try {
      const data = await OximeterHistory.find().sort({ created_at: "desc" });
      if (Array.isArray(data) && data.length) {
        let currentDate = data[0].created_at;
        let totalDates = [];
        let spo2 = 0;
        let count = 0;
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].created_at.getFullYear() === currentDate.getFullYear() &&
            data[i].created_at.getMonth() === currentDate.getMonth() &&
            data[i].created_at.getDate() === currentDate.getDate()
          ) {
            spo2 += data[i].avgSpO2;
            count++;
          } else {
            totalDates.push({
              spo2: parseInt(spo2 / count),
              date: currentDate
            });
            currentDate = data[i].created_at;
            spo2 = data[i].avgSpO2;
            count = 1;
          }
        }
        if (count > 0) {
          totalDates.push({
            spo2: parseInt(spo2 / count),
            date: currentDate
          });
        }

        return res.json({ data: totalDates });
      }
      return res.status(404).json({
        message: "Chưa có dữ liệu"
      });
    } catch (err) {
      console.log(err);
    }
  }
};
