import express from 'express';

import userRouter from './api/resources/user/user.router';
import { phuongxaRouter } from './api/resources/danhmuc/phuongxa/phuongxa.router';
import { quanhuyenRouter } from './api/resources/danhmuc/quanhuyen/quanhuyen.router';
import { tinhthanhRouter } from './api/resources/danhmuc/tinhthanh/tinhthanh.router';
import { imgUploadRouter } from './api/resources/imgUpload/imgUpload.router';
import { trieuchungRouter } from './api/resources/danhmuc/trieuchung/trieuchung.router';
import { benhRouter } from './api/resources/danhmuc/benh/benh.router';
import { noisoitaiRouter } from './api/resources/noisoitai/noisoitai.router';
import { nghephoiRouter } from './api/resources/nghephoi/nghephoi.router';
import { noisoihongRouter } from './api/resources/noisoihong/noisoihong.router';
import { soidaRouter } from './api/resources/soida/soida.router';
import { uploadsRouter } from './api/resources/uploads/uploads.router';
import { benhnhanRouter } from './api/resources/benhnhan/benhnhan.router';
import { SpO2Router } from './api/resources/spo2/spo2.router.';
import { settingRouter } from './api/resources/setting/setting.router';
import { quanlydulieuRouter } from './api/resources/quanlydulieu/quanlydulieu.router';
import { dataSetRouter } from './api/resources/dataSet/dataSet.router';
import { labelRouter } from './api/resources/label/label.router';
import { imageRouter } from './api/resources/image/image.router';
import { videoRouter } from './api/resources/video/video.router';
import { audioRouter } from './api/resources/audio/audio.router';

const router = express.Router();
router.use('/users', userRouter);
router.use('/tinh-thanh', tinhthanhRouter);
router.use('/quan-huyen', quanhuyenRouter);
router.use('/phuong-xa', phuongxaRouter);
router.use('/files', imgUploadRouter);
router.use('/trieu-chung', trieuchungRouter);
router.use('/benh', benhRouter);
router.use('/noi-soi-tai', noisoitaiRouter);
router.use('/nghe-phoi', nghephoiRouter);
router.use('/noi-soi-hong', noisoihongRouter);
router.use('/soi-da', soidaRouter);
router.use('/uploads', uploadsRouter);
router.use('/benh-nhan', benhnhanRouter);
router.use('/pulse-oximeter', SpO2Router)
router.use('/setting', settingRouter)
router.use('/quan-ly-du-lieu', quanlydulieuRouter);
router.use('/dataset', dataSetRouter);
router.use('/label', labelRouter)
router.use('/image-data', imageRouter)
router.use('/video-data', videoRouter)
router.use('/audio-data', audioRouter)

module.exports = router;
