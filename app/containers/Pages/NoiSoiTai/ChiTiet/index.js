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
import { DeleteOutlined, EditOutlined, UploadOutlined, SaveOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { add, getById, getAll, delById, updateById } from "@services/noisoitaiService";
import { getAllQuanHuyenById } from "@services/danhmuc/tinhthanhService";
import { getAllPhuongXaById } from "@services/danhmuc/quanhuyenService";
import { CONSTANTS, GENDER_OPTIONS, PAGINATION_CONFIG } from "@constants";
import { createStructuredSelector } from "reselect";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { connect } from "react-redux";
import { stringify } from "qs";
import { URL } from "@url";
import Box from "@containers/Box";
import moment from 'moment';
import produce from "immer";
import { withDanhMuc } from "@reduxApp/DanhMuc/connect";
import { compose } from 'redux';


const layoutCol = { "xs": 24, "sm": 12, "md": 12, "lg": 12, "xl": 4, "xxl": 4 };


function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class NoiSoiTai extends Component {

  constructor(props) {
    super(props);
    let { match } = this.props;
    this.state = {
      gioitinh: '',
      quanhuyen: [],
      xaphuong: [],
      fileList: [],
      uploading: false,
      previewVisible: false,

    }
    this.formRef = React.createRef();
  }

  onFinish = async (values) => {

  };

  onFieldsChange = async (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('tinhthanh_id')) {
      this.formRef.current.setFieldsValue({ quanhuyen_id: '', phuongxa_id: '' });

      const quanhuyen = await getAllQuanHuyenById(changedValues['tinhthanh_id']);
      if (quanhuyen) {
        console.log(quanhuyen, 'quanhuyen')
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

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  render() {
    const { loading, tinhthanh, benh, trieuchung } = this.props;
    const { quanhuyen, xaphuong, fileList } = this.state;
    const { previewVisible, previewImage, previewTitle } = this.state;

    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        console.log(file, 'filefilefilefilefile')
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      previewFile : async file => {
        let src = file.url;
        // console.log(file, 'srcsrcsrcsrcsrc')
        if (!src) {
          src = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
          });
        }
        console.log(src, 'srcsrcsrc')
        return src;
      },
      // fileList,
    };
    console.log(fileList, 'fileListfileList')
    return <Box title='Nội soi tai'>
      <Form ref={this.formRef} layout='vertical' size='small' autoComplete='off' onFinish={this.onFinish}
            onValuesChange={this.onFieldsChange}>
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
            <Form.Item label="Tuổi" name="tuoi">
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
            <Form.Item label="Hình ảnh" name="hinhanh" className="text-center">
              <Upload {...props}
                accept="image/*"
                multiple={true}
                listType="picture"
                // fileList={fileList}
                className="upload-list-inline"
                // showUploadList={true}
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



        </Row>
      </Form>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => {}}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>

      <Divider orientation="left" className='custom-divider mt-0'>
      </Divider>



    </Box>
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading()
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect, withDanhMuc)(NoiSoiTai);


