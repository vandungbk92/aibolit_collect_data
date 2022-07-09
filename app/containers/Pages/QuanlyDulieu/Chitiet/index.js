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
  Tabs,
  Card,
} from 'antd';
import {
  HistoryOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  UploadOutlined, UnorderedListOutlined,
  PlusOutlined,
  FullscreenOutlined,
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
import { compose } from 'redux';
import { getById, updateById } from '@services/quanlydulieuServices';
import { uploadImages, uploadImagesFrame } from '@services/uploadServices';
import DrawImageModal from './DrawImageModal';

const { TabPane } = Tabs;
const videoStyle = {
  margin: 'auto',
};

const btnStyle = {
  marginLeft: 10,
};

const styleImg = {
  display: 'block',
  marginLeft: 20,
  marginRight: 20,
};


class ChitietDulieu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      playing: false,
      image: [],
      imageSelect: [],
      imageVideo: [],
      imageModal: {},
      indexImageModal: '',
      width: '',
      height: '',
      _id: this.props.match.params.id,
      dataRes: {},
      refreshPage: false,
    };
    this.formRef = React.createRef();
    this.player = React.createRef();
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.dataRes !== this.state.dataRes) {
      // this.getData();
    }
  }

  async componentDidMount() {
    this.getData();
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  async getData() {
    const { _id } = this.state;
    if (_id) {
      let apiRequest = await getById(_id);
      if (apiRequest) {
        if (apiRequest.video) {
          this.setState({ imageVideo: apiRequest.anhchupvideo });
        }
        this.setState({ dataRes: apiRequest });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  async saveImageFrame() {
    const { dataRes, imageSelect, imageVideo } = this.state;
    if (imageSelect.length > 0) {
      let fileUpload = [];
      imageSelect.forEach(image => {
        const a = this.dataURLtoFile(image, 'imageFrame.jpg');
        fileUpload.push(a);
      });
      let images = await uploadImagesFrame(fileUpload, dataRes.nhanvien_id?._id, dataRes.ngayupload);
      if (images) {
        message.success('Lưu ảnh thành công.');
        let arrNameImage = [...imageVideo];
        images.forEach(image => {
          arrNameImage.push(image.filename);
        });
        const paramsUpdate = {
          ...dataRes,
          anhchupvideo: arrNameImage
          ,
        };

        const newRes = await updateById(dataRes._id, paramsUpdate);
        if (newRes) {
          this.setState({ imageVideo: newRes.anhchupvideo, imageSelect: [], image: [] });
        }
      }
    }
  }

  checkImage(i) {
    const newImageSelect = [...this.state.imageSelect, i];
    this.setState({ imageSelect: newImageSelect });
  }

  toggleModal(data, index) {
    const { showModal } = this.state;
    this.setState({
      showModal: !showModal,
      imageModal: data,
      indexImageModal: index,
    });
  };

  onfullScreen() {

  }


  render() {
    const { dataRes, imageVideo, showModal, imageModal, indexImageModal } = this.state;
    return (
      <div>
        <Card size="small"
              title={<span> <UnorderedListOutlined className="icon-card-header"/> &nbsp;Chi tiết dữ liệu </span>}
              md="24"
              bordered
              extra={<div>
                {dataRes.video && <Button type="primary" className="pull-right" size="small" icon={<SaveOutlined/>}
                                          onClick={() => this.saveImageFrame()}>
                  Lưu
                </Button>}
              </div>}
        >
          <Row className={"row-content"}>
            <Col xxl={6} xl={6} md={6}></Col>
            <Col xxl={6} xl={6} md={6} className={"content-data"}>
              <Row>
                <b>Tên dữ liệu: </b>
                <div>
                  &nbsp;&nbsp;{dataRes.tendulieu}
                </div>
              </Row>
              <Row>
                <b>Tên nhân viên: </b>
                <div>
                  &nbsp;&nbsp;{dataRes.nhanvien_id?.full_name}
                </div>
              </Row>
            </Col>

            <Col xxl={6} xl={6} md={6}>
              <Row>
                <b>Loại dữ liệu: </b>
                <div>
                  {dataRes.video && <b>&nbsp;&nbsp;Video</b>}
                  {dataRes.audio && <b>&nbsp;&nbsp;Audio</b>}
                  {dataRes.hinhanh?.length > 0 && <b>&nbsp;&nbsp;Hình ảnh</b>}
                </div>
              </Row>
              <Row>
                <b>Ngày tạo: </b>
                <div>
                  &nbsp;&nbsp;{moment(dataRes.ngayupload).format('DD/MM/YYYY')}
                </div>
              </Row>
            </Col>
            <Col xxl={6} xl={6} md={6}></Col>
          </Row>

          <Divider/>

          <Tabs defaultActiveKey="1">
            <TabPane
              tab={<span>Dữ liệu</span>}
              key="1"
            >
              <Row>
                <Col xxl={24} xl={24} md={24}>
                  <Col xxl={24} xl={24} md={24}>
                    {dataRes.hinhanh?.length > 0 &&
                    <Col>
                      <Row>
                        {dataRes.hinhanh?.map((data, index) => {
                          const uriImg = API.FILE + '/file/' + dataRes.nhanvien_id._id + '---' + moment(dataRes.ngayupload).format('YYYY-MM-DD') + '---' + moment(dataRes.ngayupload).format('HH.mm.ss') +
                            '---' + data;
                          return (
                            <div key={index} style={{ display: 'flex', flex: 1, marginRight: 5 }}
                                 onClick={() => this.toggleModal(data, index)}
                            >
                              <img
                                src={uriImg}
                                alt={'image'}
                                style={{ borderRadius: 8, width: '40%' }}
                              />
                            </div>
                          );
                        })}
                      </Row>
                    </Col>
                    }

                    {dataRes.video &&
                    <Col xxl={24} xl={24} md={24}>
                      <div className="video-style">
                        <ReactPlayer
                          ref={player => {
                            this.player = player;
                          }}
                          url={API.FILE + '/file/' + dataRes.nhanvien_id?._id + '---' + moment(dataRes.ngayupload).format('YYYY-MM-DD') + '---' + moment(dataRes.ngayupload).format('HH.mm.ss') + '---' + dataRes.video}
                          playing={this.state.playing}
                          width="480px"
                          height="400px"
                          style={videoStyle}
                          config={
                            {
                              file: {
                                attributes: {
                                  crossOrigin: 'anonymous',
                                },
                              },
                            }
                          }
                        />
                      </div>

                      <Row gutter={10} className="btn-group">
                        <Button style={btnStyle} onClick={() => this.setState({ playing: true })}>Phát</Button>
                        <Button style={btnStyle} onClick={() => this.setState({ playing: false })}>Tạm dừng</Button>
                        {/*<Button style={btnStyle} onClick={() => this.onfullScreen()}><FullscreenOutlined /></Button>*/}
                        <Button style={btnStyle} onClick={() => {
                          const frame = captureVideoFrame(this.player.getInternalPlayer(), 'jpeg');
                          const newImages = [...this.state.image];
                          console.log(frame.dataUri, 'frame.dataUriframe.dataUri')
                          newImages.push(frame.dataUri);
                          this.setState({ image: newImages });
                        }}>Chụp màn hình</Button>
                      </Row>
                    </Col>
                    }

                    {dataRes.audio && (
                      <div style={styleImg}>
                        <AudioPlayer
                          src={API.FILE + '/file/' + dataRes.nhanvien_id?._id + '---' + moment(dataRes.ngayupload).format('YYYY-MM-DD') + '---' + moment(dataRes.ngayupload).format('HH.mm.ss') + '---' + dataRes.audio}
                        />
                        <br/>
                      </div>
                    )}
                  </Col>
                </Col>
              </Row>
            </TabPane>
            {dataRes.video && <TabPane
              tab={<span>Hình ảnh</span>}
              key="2"
            >
              <Col xxl={24} xl={24} md={24}>
                <Col>
                  <div>
                    <b>Ảnh mới chụp</b>
                    <Row>
                      {this.state.image?.length > 0 ? this.state.image?.map((i, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          marginLeft: 10,
                          marginTop: 5,
                          padding: 5,
                          position: 'relative',
                        }}>
                          <Checkbox onChange={() => this.checkImage(i)}
                                    style={{ margin: 5, position: 'absolute', bottom: 5, left: 10 }}></Checkbox>
                          <img
                            width={150}
                            src={i}
                            style={{ borderRadius: 8 }}
                          />
                          <DrawImageModal
                            setShowModal={(e) => this.setState({ showModal: e })}
                            showModal={this.state.showModal}
                          />
                        </div>
                      )) : (
                        <div style={{ alignItems: 'center', color: 'grey' }}>
                          <i>Không có hình ảnh nào</i>
                        </div>
                      )}
                    </Row>
                  </div>
                  <Divider/>
                  <div>
                    <b>Ảnh đã lưu</b>
                    <Row>
                      {this.state.imageVideo?.length > 0 ? this.state.imageVideo?.map((i, index) => {
                        const uriImg = API.FILE + '/file/' + dataRes.nhanvien_id._id + '---' + moment(dataRes.ngayupload).format('YYYY-MM-DD') + '---' + moment(dataRes.ngayupload).format('HH.mm.ss') +
                          '---' + i;
                        return (
                          <div key={index} style={{ padding: 5, marginLeft: 15, marginRight: 5, marginTop: 5 }}
                               onClick={() => this.toggleModal(i, index)}>
                            <img
                              width={200}
                              src={uriImg}
                              alt={'image'}
                              style={{ borderRadius: 8 }}
                            />
                          </div>
                        );
                      }) : (
                        <div style={{ alignItems: 'center', color: 'grey' }}>
                          <i>Không có hình ảnh nào</i>
                        </div>
                      )}
                    </Row>
                  </div>
                </Col>
              </Col>
            </TabPane>}
          </Tabs>
        </Card>
        <DrawImageModal
          setShowModal={(e) => this.setState({ showModal: e })}
          showModal={showModal}
          dataRes={dataRes}
          imageModal={imageModal}
          index={indexImageModal}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector(
  {
    loading: makeGetLoading(),
  },
);


const withConnect = connect(mapStateToProps);
export default compose(withConnect)(ChitietDulieu);
