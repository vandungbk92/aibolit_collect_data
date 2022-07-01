import React, { Component } from 'react';
import {
  Divider,
  Tag,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Slider,
  Tooltip,
  Checkbox,
  Upload,
  Image,
} from 'antd';
import {
  HistoryOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  UploadOutlined, DeleteOutlined,
} from '@ant-design/icons';

import ReactPlayer from 'react-player';
import captureVideoFrame from 'capture-video-frame';
import AudioPlayer from 'react-h5-audio-player';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import moment from 'moment';
import { API } from '../../../../constants/API';
import 'react-h5-audio-player/lib/styles.css';
import { updateById } from '@services/quanlydulieuServices';

const styleImg = {
  borderRadius: 8,
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '35%',
};

const btnStyle = {
  margin: 10,
  float: 'right',
};

class DrawImageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      playing: false,
      image: [],
      dataRes: {},
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
    };
    this.formRef = React.createRef();
    this.player = React.createRef();
  }

  async componentDidUpdate(prevProps) {
    const { showModal, dataRes } = this.props;
    if (showModal && showModal !== prevProps.showModal) {
      if (dataRes) {
        await this.setState({ dataRes });
      }
    }
  }

  toggleModal = async () => {
    const { setShowModal, showModal } = this.props;
    await setShowModal(!showModal);
    this.setState({ image: [] });
  };

  handleSaveData() {

  }

  drawRetangle = () => {

  };

  getMyVideo(image) {
    const canvas = document.getElementById('viewport');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
      // ctx.drawImage(img, 0, 0);
      // ctx.beginPath();
      // ctx.moveTo(30, 96);
      // ctx.lineTo(70, 66);
      // ctx.lineTo(103, 76);
      // ctx.lineTo(170, 15);
      // ctx.stroke();
    };
    img.src = 'backdrop.png';
  }

  async deleteImg() {
    const { loading, showModal, imageModal, index } = this.props;
    const { dataRes } = this.state;
    dataRes.anhchupvideo?.splice(index, 1);
    const newRes = await updateById(dataRes._id, dataRes);
    if (newRes) {
      this.toggleModal();
    }
  }

  render() {
    const { width, height } = this.state;
    const { loading, showModal, dataRes, imageModal } = this.props;
    const uriImg = API.FILE + '/file/' + dataRes?.nhanvien_id?._id + '---' + moment(dataRes?.ngayupload).format('YYYY-MM-DD') + '---' + moment(dataRes?.ngayupload).format('HH.mm.ss') +
      '---' + imageModal;
    return (
      <Modal
        title={<b>Chi tiết hình ảnh</b>}
        visible={showModal}
        width={1000}
        onCancel={loading ? () => null : this.toggleModal}
        footer={[
          <div key={1}>
            {dataRes.video && <Button
              size="medium"
              danger
              type="primary"
              onClick={() => this.deleteImg()}
              form="formModalBaocao"
              loading={loading}
              icon={<DeleteOutlined/>}
            >
              Xóa
            </Button>}
            <Button
              size="medium"
              type="primary"
              htmlType="submit"
              form="formModalBaocao"
              loading={loading}
              icon={<SaveOutlined/>}
            >
              Lưu
            </Button>
          </div>,
        ]}
      >
        <Button style={btnStyle} onClick={() => this.drawRetangle()}>Draw</Button>
        <div style={{ justifyContent: 'center' }}>

          {/*<canvas id="viewport">*/}
          <img
            width={210}
            src={uriImg}
            style={styleImg}
            alt={'image'}
          />
          {/*</canvas>*/}
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});

const withConnect = connect(mapStateToProps);

export default withConnect(DrawImageModal);

