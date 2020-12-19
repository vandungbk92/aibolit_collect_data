import express from "express";

import userRouter from "./api/resources/user/user.router";
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

const router = express.Router();
router.use("/users", userRouter);
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

module.exports = router;
