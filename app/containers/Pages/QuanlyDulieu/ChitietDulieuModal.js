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
  UploadOutlined,
} from '@ant-design/icons';

import ReactPlayer from "react-player";
import captureVideoFrame from "capture-video-frame";
import AudioPlayer from 'react-h5-audio-player';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import moment from 'moment';
import {API} from "../../../constants/API";
import 'react-h5-audio-player/lib/styles.css';

const videoStyle = {
  margin:  'auto',
};

const btnStyle = {
  marginLeft: 10
};

class ChitietDulieuModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      playing: false,
      image: [],
      width: '',
      height: '',
    }
    this.formRef = React.createRef();
    this.player = React.createRef();
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  async componentDidUpdate(prevProps) {
    const { showModal, dataRes } = this.props;
    if (showModal && showModal !== prevProps.showModal) {
      this.formRef?.current?.setFieldsValue({
        ...dataRes,
        ngayupload: moment(dataRes.ngayupload).format('DD/MM/YYYY'),
      })
    }
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  toggleModal = async () => {
    const { setShowModal, showModal } = this.props;
    await setShowModal(!showModal);
    this.setState({image: []})
    this.formRef?.current.resetFields();
  };

  handleSaveData() {

  }
  drawRetangle = () => {

  }

  render() {
    const {width, height} = this.state;
    const { loading, showModal, dataRes} = this.props;

    return  (
      <Modal
        title={<b>Chi tiết dữ liệu</b>}
        visible={showModal}
        width={1000}
        onCancel={loading ? () => null : this.toggleModal}
        footer={[
          <Button
            key={2}
            size="medium"
            type="primary"
            htmlType="submit"
            form="formModalBaocao"
            loading={loading}
            icon={<SaveOutlined/>}
          >
            Lưu
          </Button>
        ]}
      >
        <Form
          ref={this.formRef}
          id="formModalChitiet"
          name="formModalChitiet"
          autoComplete="off"
          onFinish={this.handleSaveData}
          labelAlign="left"
        >
          <Row gutter={10}>
            <Col xxl={12} xl={12} md={12}>
              <Col xxl={24} xl={24} md={24}>
                <Form.Item
                  labelCol={{ xxl: 8, xl: 8, md: 24 }}
                  label={<b>Tên nhân viên</b>}
                  validateTrigger={["onChange", "onBlur"]}
                >
                  <div>
                    {dataRes.nhanvien_id?.full_name}
                  </div>
                </Form.Item>
              </Col>
              <Col xxl={24} xl={24} md={24}>
                <Form.Item
                  labelCol={{ xxl: 8, xl: 8, md: 24 }}
                  label={<b>Ngày upload</b>}
                  validateTrigger={["onChange", "onBlur"]}
                >
                  <div>
                    {moment(dataRes.ngayupload).format("DD-MM-YYYY")}
                  </div>
                </Form.Item>
              </Col>
              <Divider />
              <Col xxl={24} xl={24} md={24}>
                {dataRes.hinhanh?.length > 0 &&
                  <Col>
                    <b>Hình ảnh</b>
                    <Row>
                      {dataRes.hinhanh?.map((data, index) => {
                        const uriImg = API.FILE + '/file/' + dataRes.nhanvien_id._id + '---' + moment(dataRes.ngayupload).format('YYYY-MM-DD') + '---' + data
                        return (
                          <div key={index} style={{ display: 'flex', flex: 1, marginRight: 5 }}
                               onClick={() => {
                                 const newImages = [...this.state.image];
                                 newImages.push(uriImg);
                                 this.setState({image: newImages})
                               }}>
                            <img
                              src={uriImg}
                              alt={'image'}
                            />
                          </div>
                        );
                      })}
                    </Row>
                  </Col>
                }

                {dataRes.video &&
                <Col xxl={24} xl={24} md={24}>
                  <b>Video</b>
                  <div className="video-style">
                    <ReactPlayer
                      ref={player => { this.player = player }}
                      url={API.FILE + "/file/" + dataRes.nhanvien_id._id + "---" + moment(dataRes.ngayupload).format("YYYY-MM-DD") + "---" + dataRes.video}
                      playing={this.state.playing}
                      width='420px'
                      height='380px'
                      style={videoStyle}
                      config={
                        { file: {
                            attributes: {
                              crossOrigin: 'anonymous'
                            }}
                        }
                      }
                    />
                  </div>

                  <Row gutter={10} className="btn-group">
                    <Button style={btnStyle} onClick={() => this.setState({ playing: true })}>Play</Button>
                    <Button style={btnStyle} onClick={() => this.setState({ playing: false })}>Pause</Button>
                    <Button style={btnStyle} onClick={() => {
                      const frame = captureVideoFrame(this.player.getInternalPlayer())
                      const newImages = [...this.state.image];
                      newImages.push(frame.dataUri);
                      this.setState({ image: newImages})
                    }}>Chụp màn hình</Button>
                  </Row>
                </Col>
                }

                {dataRes.audio && (
                  <Col xxl={24} xl={24} md={24}>
                    <b>Audio</b>
                    <AudioPlayer
                      src={API.FILE + "/file/" + dataRes.nhanvien_id._id + "---" + moment(dataRes.ngayupload).format("YYYY-MM-DD") + "---" + dataRes.audio}
                    />
                  </Col>
                )}
              </Col>
            </Col>
            {!dataRes.audio && <Col xxl={12} xl={12} md={12}>
              <Col className={'area-view-image'}>
                <Row>
                  {this.state.image && this.state.image?.map((i, index) => (
                    <div style={{display: "flex", flex: 1, padding: 5}}>
                      <Image
                        width={150}
                        src={i}
                      />
                    </div>
                  ))}
                </Row>
              </Col>
            </Col>}
          </Row>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});

const withConnect = connect(mapStateToProps);

export default withConnect(ChitietDulieuModal);

