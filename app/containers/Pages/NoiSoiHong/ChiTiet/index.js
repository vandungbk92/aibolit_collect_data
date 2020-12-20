import React, { Component, Fragment } from "react";
import {
  Input,
  InputNumber,
  Button,
  Form,
  Table,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  DatePicker,
  Skeleton,
  Divider,
  Modal,
  Select,
  Radio,
  Checkbox,
  Upload
} from "antd";
import { DeleteOutlined, EditOutlined, UploadOutlined, SaveOutlined, DownloadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { add, getById, getAll, delById, updateById } from "@services/noisoihongService";
import { getAllQuanHuyenById } from "@services/danhmuc/tinhthanhService";
import { getAllPhuongXaById } from "@services/danhmuc/quanhuyenService";
import { CONSTANTS, GENDER_OPTIONS, PAGINATION_CONFIG } from "@constants";
import { createStructuredSelector } from "reselect";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { connect } from "react-redux";
import axios from "axios";
import { URL } from "@url";
import Box from "@containers/Box";
import moment from 'moment';
import produce from "immer";
import { withDanhMuc } from "@reduxApp/DanhMuc/connect";
import { compose } from 'redux';
import {uploadImages} from "@services/uploadServices";
const layoutCol = { "xs": 24, "sm": 12, "md": 12, "lg": 12, "xl": 4, "xxl": 4 };

class NoiSoiHong extends Component {

  constructor(props) {
    super(props);
    let { match } = this.props;
    this.state = {
      gioitinh: '',
      quanhuyen: [],
      xaphuong: [],

      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileListVideo: [],
      fileListKetQua: [],
      fileList: [],
      _id: this.props.match.params.id
    }
    this.formRef = React.createRef();
    console.log(this.props.match.params.id, 'this.props.match.params.id')
  }

  async componentDidMount() {
    try {
      let { _id } = this.state;
      if (_id) {
        let apiRequest = await getById(_id);
        if (apiRequest) {
          let fileList = this.convertUrlToList(apiRequest.hinhanh)
          let fileListVideo = this.convertUrlToList(apiRequest.video)
          let fileListKetQua = this.convertUrlToList(apiRequest.hinhanhkq)
          let trieuchung_id = apiRequest.trieuchung_id.map(data => data._id)
          let benh_id = apiRequest.benh_id.map(data => data._id)
          const newData = produce(apiRequest, draft => {
            // draft.fileList = fileList
            // draft.fileListVideo = fileListVideo
            // draft.fileListKetQua = fileListKetQua
            // draft.fileListKetQua = fileListKetQua

            draft.tinhthanh_id = draft.tinhthanh_id ? draft.tinhthanh_id._id : undefined;
            draft.quanhuyen_id = draft.quanhuyen_id ? draft.quanhuyen_id._id : undefined;
            draft.phuongxa_id = draft.phuongxa_id ? draft.phuongxa_id._id : undefined;

            draft.trieuchung_id = trieuchung_id
            draft.benh_id = benh_id

          })

          this.formRef.current.setFieldsValue(newData);

          this.setState({fileList, fileListVideo, fileListKetQua})
          let apiRequestTT = [
            newData.tinhthanh_id ? getAllQuanHuyenById(newData.tinhthanh_id) : null,
            newData.quanhuyen_id ? getAllPhuongXaById(newData.quanhuyen_id) : null
          ]

          let apiResponse = await axios.all(apiRequestTT).then(axios.spread(function (quanhuyen, xaphuong) {
            return {
              quanhuyen: quanhuyen,
              xaphuong: xaphuong
            }
          }));
          let quanhuyen = apiResponse.quanhuyen ? apiResponse.quanhuyen : this.state.quanhuyen
          let xaphuong = apiResponse.xaphuong ? apiResponse.xaphuong : this.state.xaphuong
          this.setState({quanhuyen, xaphuong})

        }
      }
    }catch (e) {
      console.log(e)
    }
  }

  convertUrlToList = (list) => {
    let arr = list.map((data, idx) => {
      return {
        uid: idx,
        name: data,
        status: 'done',
        url: data,
      }
    })

    return arr
  }

  onFinish = async (values) => {

    let {fileList, fileListVideo, fileListKetQua} = this.state;
    // console.log(fileList, fileListVideo, fileListKetQua, 'fileList, fileListVideo, fileListKetQua')
    let [originFileNm, fileUpload] = this.getfileDetail(fileList)
    if(fileUpload.length){
      let files = await uploadImages(fileUpload);
      if (files && files.length) {
        originFileNm = [...originFileNm, ...files]
      }
    }

    let [originFileNmVideo, fileUploadVideo] = this.getfileDetail(fileListVideo)
    if(fileUploadVideo.length){
      let files = await uploadImages(fileUploadVideo);
      if (files && files.length) {
        originFileNmVideo = [...originFileNmVideo, ...files]
      }
    }

    let [originFileNmKq, fileUploadKq]= this.getfileDetail(fileListKetQua)
    if(fileUploadKq.length){
      let files = await uploadImages(fileUploadKq);
      if (files && files.length) {
        originFileNmKq = [...originFileNmKq, ...files]
      }
    }

    values.hinhanh = originFileNm;
    values.video = originFileNmVideo;
    values.hinhanhkq = originFileNmKq;
    if(this.state._id){
      let apiRes = await updateById(this.state._id, values);
      if(apiRes){
        let fileList = this.convertUrlToList(apiRes.hinhanh)
        let fileListVideo = this.convertUrlToList(apiRes.video)
        let fileListKetQua = this.convertUrlToList(apiRes.hinhanhkq)
        this.setState({fileList, fileListVideo, fileListKetQua})
        message.success("Cập nhật dữ liệu thành công.");
      }
    }else{
      let apiRes = await add(values);
      if(apiRes){
        message.success("Thêm dữ liệu thành công.");
        this.props.history.push(URL.NOI_SOI_TAI_ID.format(apiRes._id));
      }
    }


  };

  getfileDetail = (listFile) => {
    console.log(listFile, 'listFilelistFilelistFile')
    let originFileNm = []
    let fileUpload = []
    listFile.filter(data => {
      if(data.url){
        originFileNm = [...originFileNm, data.url]
      }else{
        fileUpload = [...fileUpload, data.originFileObj]
      }
    })
    return [originFileNm, fileUpload]
  }

  onFieldsChange = async (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('tinhthanh_id')) {
      this.formRef.current.setFieldsValue({ quanhuyen_id: '', phuongxa_id: '' });

      const quanhuyen = await getAllQuanHuyenById(changedValues['tinhthanh_id']);
      if (quanhuyen) {
        this.setState({quanhuyen, xaphuong: []});
      }
    }else if (changedValues.hasOwnProperty('quanhuyen_id')) {
      this.formRef.current.setFieldsValue({ phuongxa_id: '' });
      const xaphuong = await getAllPhuongXaById(changedValues['quanhuyen_id']);
      if (xaphuong) {
        this.setState({ xaphuong });
      }
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });
  handleChangeVideo = ({ fileList }) => this.setState({ fileListVideo : fileList });
  handleChangeKq = ({ fileList }) => this.setState({ fileListKetQua : fileList });

  render() {
    const { loading, tinhthanh, benh, trieuchung } = this.props;
    const { quanhuyen, xaphuong, fileList } = this.state;
    const { previewVisible, previewImage, previewTitle } = this.state;
    console.log()

    return <Form ref={this.formRef} layout='vertical' size='small' autoComplete='off' onFinish={this.onFinish}
          onValuesChange={this.onFieldsChange} id="myForm">
    <Box title='Nội soi tai'
                boxActions={<Button key="submit" htmlType="submit" form="myForm" icon={<SaveOutlined/>} size='small' type="primary">Lưu dữ liệu</Button>}>

        <Row gutter={10}>
          <Col sm={24}>
            <strong>1. Thông tin bệnh nhân</strong>
          </Col>
          <Col {...layoutCol}>
            <Form.Item label="Mã dữ liệu" name="makham">
              <Input placeholder=''
                     disabled={true}/>
            </Form.Item>
          </Col>

          <Col {...layoutCol}>
            <Form.Item label="Tuổi" name="tuoi" validateTrigger={['onChange', 'onBlur']}
                       rules={[{ required: true, type: 'number', message: 'Tuổi là bắt buộc nhập' }]}>
              <InputNumber placeholder='Tuổi' disabled={loading}/>
            </Form.Item>
          </Col>

          <Col {...layoutCol}>
            <Form.Item label="Tỉnh" name="tinhthanh_id">
              <Select placeholder='Chọn tỉnh thành' disabled={loading} dropdownClassName='small' showSearch
                      filterOption={(input, option) => {
                        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}>
                {tinhthanh.map(data => {
                  return <Select.Option key={data._id} value={data._id}>
                    {data.tentinh}
                  </Select.Option>;
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col {...layoutCol}>
            <Form.Item label="Quận huyện" name="quanhuyen_id">
              <Select placeholder='Chọn quận huyện' disabled={loading} dropdownClassName='small' showSearch
                      filterOption={(input, option) => {
                        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}>
                {quanhuyen.map(data => {
                  return <Select.Option key={data._id} value={data._id}>
                    {data.tenqh}
                  </Select.Option>;
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col {...layoutCol}>
            <Form.Item label="Xã phường" name="phuongxa_id">
              <Select placeholder='Chọn xã phường' disabled={loading} dropdownClassName='small' showSearch
                      filterOption={(input, option) => {
                        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}>
                {xaphuong.map(data => {
                  return <Select.Option key={data._id} value={data._id}>
                    {data.tenphuongxa}
                  </Select.Option>;
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col {...layoutCol}>
            <Form.Item label="Giới tính" name="gioitinh">
              <Radio.Group>
                <Radio value="MALE">Nam</Radio>
                <Radio value="FEMALE">Nữ</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col sm={24}>
            <strong>2. Khám bệnh</strong>
          </Col>
          <Col xs={24}>
            <Form.Item label="Lý do đi khám" name="lydokham" className='m-0'>
              <Input.TextArea autoSize={ {minRows: 1, maxRows: 6} } rows={5}
                              placeholder='Lý do đi khám' disabled={loading}/>
            </Form.Item>
          </Col>

          <Col xs={24} xxl={24}>
            <Form.Item label="Triệu chứng" name="trieuchung_id">
              <Checkbox.Group className="w-full">
                <Row>
                  {trieuchung.map(data => (
                    <Col key={data._id} xs={4}>
                      <Checkbox value={data._id}>{data.trieuchung}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
          <Col xs={24} xxl={24}>
            <Form.Item label="Hình ảnh" name="hinhanh" className="">
              <Upload
                action={false}
                accept="image/*"
                listType="picture-card"
                fileList={fileList}
                multiple={true}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                beforeUpload={file => {return false}}
                showUploadList={{
                  showPreviewIcon: true,
                  showDownloadIcon: true,
                  showRemoveIcon: true,
                  downloadIcon: (file) => <a download href={file.url}><DownloadOutlined /></a>
                }}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24} xxl={24}>
            <Form.Item label="Video" name="video" className="">


              <Upload
                action={false}
                accept="video/*, audio/*"
                onChange={this.handleChangeVideo}
                fileList={this.state.fileListVideo}
                beforeUpload={file => {return false}}
                showUploadList={{
                  // showPreviewIcon: false,
                  showDownloadIcon: true,
                  showRemoveIcon: true,
                  downloadIcon: (file) => <a download href={file.url}><DownloadOutlined /></a>
                }}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col sm={24}>
            <strong>3. Kết luận</strong>
            <Col xs={24}>
              <Form.Item label="Kết luận" name="ketluan">
                <Input.TextArea autoSize={ {minRows: 1, maxRows: 6} } rows={5}
                                placeholder='Kết luận' disabled={loading}/>
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item label="Bệnh" name="benh_id">
                <Select mode="multiple" placeholder='Chọn bệnh' disabled={loading} dropdownClassName='small' showSearch
                        filterOption={(input, option) => {
                          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }}>
                  {benh.map(data => {
                    return <Select.Option key={data._id} value={data._id}>
                      {data.benh}
                    </Select.Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Col>
          <Col xs={24} xxl={24}>
            <Form.Item label="Hình ảnh kết quả" name="hinhanhkq" className="">
              <Upload
                action={false}
                accept="image/*"
                listType="picture-card"
                fileList={this.state.fileListKetQua}
                multiple={true}
                onPreview={this.handlePreview}
                onChange={this.handleChangeKq}
                beforeUpload={file => {return false}}
                showUploadList={{
                  showPreviewIcon: true,
                  showDownloadIcon: true,
                  showRemoveIcon: true,
                  downloadIcon: (file) => <a download href={file.url}><DownloadOutlined /></a>
                }}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>



        </Row>


      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={this.handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>

      <Divider orientation="left" className='custom-divider mt-0'>
      </Divider>



    </Box>
    </Form>
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading()
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect, withDanhMuc)(NoiSoiHong);


