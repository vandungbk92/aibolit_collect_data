import React, { Component, Fragment } from 'react';
import { Input, Button, Form, Table, Popconfirm, message, Modal, Card, Select, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, UnorderedListOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';

import { add, getAll, delById, updateById } from '@services/danhmuc/phuongxaService';
import {getAll as getAllTinh, getAllQuanHuyenById} from '@services/danhmuc/tinhthanhService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search  from "@components/Search/Search";
import { stringify } from 'qs';
import queryString from 'query-string';
import produce from 'immer'

class PhuongXa extends Component {

  columns = [
    {
      title: 'Tỉnh/thành Phố',
      render: (value) => this.formatTinhThanh(value),
      dataIndex: 'tinhthanh_id',
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'quanhuyen_id',
      render: (value) => this.formatQuanHuyen(value),
    },
    {
      title: 'Tên phường/xã',
      dataIndex: 'tenphuongxa',
    },
    {
      title: 'Mã phường/xã',
      dataIndex: 'maphuongxa',
      width: 150,
      align: 'center'
    },
    {
      title: 'Hành động',
      render: (value) => this.formatActionCell(value),
      width: 150,
      align: 'center'
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
      _id: '',
      tongiao: '',
      thutu: 0,
      tinhthanh: [],
      quanhuyen: [],
      quanhuyenFilter: []
    };
    this.formRef = React.createRef();
  }

  async componentDidMount() {
    let tinhthanhApi = await getAllTinh(1, 0)
    if(tinhthanhApi){
      this.setState({tinhthanh: tinhthanhApi.docs})
    }
    this.getDataFilter();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getDataFilter()
    }
  }

  async getDataFilter() {
    let search = queryString.parse(this.props.location.search);
    let page = parseInt(search.page ? search.page : this.state.page);
    let limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = ''
    queryStr += `${search.tinhthanh_id ? '&tinhthanh_id={0}'.format(search.tinhthanh_id) : ''}`
    queryStr += `${search.quanhuyen_id ? '&quanhuyen_id={0}'.format(search.quanhuyen_id) : ''}`
    queryStr += `${search.maphuongxa ? '&maphuongxa[like]={0}'.format(search.maphuongxa) : ''}`
    queryStr += `${search.tenphuongxa ? '&tenphuongxa[like]={0}'.format(search.tenphuongxa) : ''}`

    const apiResponse = await getAll(page, limit, queryStr);
    if (apiResponse) {
      const dataRes = apiResponse.docs;
      this.setState({
        dataRes,
        totalDocs: apiResponse.totalDocs,
        limit: apiResponse.limit,
        page: apiResponse.page,
      });
    }
  }

  async handleDelete(value) {
    const apiResponse = await delById(value._id);
    if (apiResponse) {
      this.getDataFilter();
      message.success('Xoá phường/xã thành công');
    }
  }

  formatTinhThanh(value) {
    return value ? value.tentinh : '';
  }

  formatQuanHuyen(value) {
    return value ? value.tenqh : '';
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal, _id: '' });
    this.formRef.current.resetFields();
  }

  handleSaveData = async (data) => {
    let maphuongxa = data.maphuongxa
    let tenphuongxa = data.tenphuongxa
    if (!maphuongxa.trim() || !tenphuongxa.trim()) {
      this.formRef.current.setFieldsValue({ maphuongxa: maphuongxa.trim(), tenphuongxa: tenphuongxa.trim()  });
      this.formRef.current.validateFields();
      return;
    }

    data.maphuongxa = maphuongxa.trim()
    data.tenphuongxa = tenphuongxa.trim()

    const { _id } = this.state;
    if (_id) {
      // edit
      const apiResponse = await updateById(_id, data);
      if(apiResponse){
        const dataRes = this.state.dataRes.map(data => {
          if (data._id === apiResponse._id) {
            return apiResponse
          }
          return data;
        });
        await this.setState({ dataRes, showModal: false });
        message.success('Chỉnh sửa phường/xã thành công');
      }

    } else {
      // create
      const apiResponse = await add(data);
      if (apiResponse) {
        this.setState({ showModal: false });
        this.getDataFilter();
        message.success('Thêm mới phường/xã thành công');
      }
    }
  }

  formatActionCell(value) {
    return <Fragment>
      <Tooltip placement="left" title={'Cập nhật thông tin'} color="#2db7f5">
        <Button icon={<EditOutlined/>} size='small' type="primary" className='mr-1' //ant-tag-cyan
                onClick={() => this.edit(value)}></Button>
      </Tooltip>

      <Popconfirm key={value._id} title="Bạn chắc chắn muốn xoá?"
                  onConfirm={() => this.handleDelete(value)}
                  cancelText='Huỷ' okText='Xoá' okButtonProps={{ type: 'danger' }}>
        <Tooltip placement="right" title={'Xóa dữ liệu'} color="#f50">
          <Button icon={<DeleteOutlined/>} type='danger' size='small' className="mr-1"></Button>
        </Tooltip>
      </Popconfirm>
    </Fragment>;
  }

  async edit(data) {
    await this.setState({ showModal: true, _id: data._id });
    const newData = produce(data, draft => {
      draft.tinhthanh_id = draft.tinhthanh_id ? draft.tinhthanh_id._id : '';
      draft.quanhuyen_id = draft.quanhuyen_id._id;
    })

    // nếu có tinhthanh_id thì gọi danh sách quận/huyện.
    if(newData.tinhthanh_id){
      let quanhuyen = await getAllQuanHuyenById(newData.tinhthanh_id)
      if(quanhuyen){
        this.setState({quanhuyen})
      }
    }
    this.formRef.current.setFieldsValue(newData);
  }

  handleRefresh = (newQuery, changeTable) => {
    const { location, history } = this.props;
    const { pathname } = location;
    let {page, limit} = this.state;
    let objFilterTable = {page, limit }
    if(changeTable){
      newQuery = queryString.parse(this.props.location.search)
      delete newQuery.page
      delete newQuery.limit
    }
    newQuery = Object.assign(objFilterTable, newQuery);
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: "repeat" })
    });
  };

  onChangeTable = (page) => {
    this.setState({page: page.current, limit: page.pageSize},
      () => {this.handleRefresh({},true)})
  }

  onChangeTinh = async (value) => {
    // lấy danh sách huyện của tỉnh.
    let quanhuyen = await getAllQuanHuyenById(value);
    this.formRef.current.setFieldsValue({ quanhuyen_id: '' });
    this.formRef.current.validateFields();
    if(quanhuyen){
      this.setState({quanhuyen})
    }
  }

  onChangeFilter = async (value, key) => {
    if(key === 'tinhthanh_id'){
      if(value){
        let quanhuyenFilter = await getAllQuanHuyenById(value);
        if(quanhuyenFilter){this.setState({quanhuyenFilter})};
      }else{
        this.setState({quanhuyenFilter: []})
      }
    }
  }

  render() {
    const { loading } = this.props;
    const { dataRes, totalDocs, page, limit, _id, tinhthanh, quanhuyen, quanhuyenFilter } = this.state;
    const dataSearch = [
      {
        type: 'select',
        name: 'tinhthanh_id',
        label: 'Tỉnh/thành',
        options: tinhthanh,
        key: '_id',
        value: 'tentinh',
        children: { quanhuyen_id: '' },
        onChange: this.onChangeFilter
      },
      {
        type: 'select',
        name: 'quanhuyen_id',
        label: 'Quận/huyện',
        options: quanhuyenFilter,
        key: '_id',
        value: 'tenqh'
      },
      {
        type: 'text',
        operation: 'like',
        name: 'tenphuongxa',
        label: 'Phường xã'
      },
      {
        type: 'text',
        operation: 'like',
        name: 'maphuongxa',
        label: 'Mã phường xã'
      },

    ]
    return <div>

      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách phường/xã
      </span>} md="24" bordered extra={<div>
        <Button type="primary" onClick={this.toggleModal} className='pull-right' size="small" icon={<PlusOutlined/>}>Thêm</Button>
      </div>}>
        <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch} layoutBtn={{xs: 24}} classNameBtn="pull-right mr-2"/>
        <Table loading={loading} bordered columns={this.columns} dataSource={dataRes}
               size="small" rowKey="_id"
               pagination={{
                 ...PAGINATION_CONFIG,
                 current: page,
                 pageSize: limit,
                 total: totalDocs
               }}
               onChange={this.onChangeTable}/>
      </Card>

      <Modal title={_id ? 'Chỉnh sửa phường/xã' : 'Thêm mới phường/xã'}
             visible={this.state.showModal}
             onCancel={loading ? () => null : this.toggleModal}
             footer={[
               <Button key={1} size="small" onClick={this.toggleModal} disabled={loading} type="danger" icon={<CloseOutlined />}>Huỷ</Button>,
               <Button key={2} size="small" type="primary" htmlType="submit" form="formModal" loading={loading} icon={<SaveOutlined />}>
                 {_id ? 'Lưu' : 'Thêm'}
               </Button>,
             ]}>
        <Form ref={this.formRef} id="formModal" name='formModal' autoComplete='off'
              onFinish={this.handleSaveData} labelAlign="right">

          <Form.Item label="Tỉnh/thành" name="tinhthanh_id" labelCol={{ span: 6 }}
                     hasFeedback validateTrigger={['onChange', 'onBlur']}
                     rules={[{ required: true, message: 'Tỉnh/thành không được để trống' }]}>
            <Select showSearch placeholder='Chọn tỉnh/thành' disabled={loading} showSearch
                    onChange={this.onChangeTinh}
                    filterOption={(input, option) => {
              return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }}>
              {tinhthanh.map((data, idx) => {
                return <Select.Option key={data._id} value={data._id}>{data.tentinh}</Select.Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item label="Quận/huyện" name="quanhuyen_id" labelCol={{ span: 6 }}
                     hasFeedback validateTrigger={['onChange', 'onBlur']}
                     rules={[{ required: true, message: 'Quận/huyện không được để trống' }]}>
            <Select showSearch placeholder='Chọn quận/huyện' disabled={loading} showSearch
                    filterOption={(input, option) => {
                      return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }}>
              {quanhuyen.map((data, idx) => {
                return <Select.Option key={data._id} value={data._id}>{data.tenqh}</Select.Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item label="Mã phường/xã" name="maphuongxa" hasFeedback labelCol={{ span: 6 }} validateTrigger={['onChange', 'onBlur']}
                     rules={[{ required: true, whitespace: true, message: 'Mã phường/xã không được để trống' }]}>
            <Input placeholder='Mã phường/xã' disabled={loading}/>
          </Form.Item>
          <Form.Item label="Tên phường/xã" name="tenphuongxa" labelCol={{ span: 6 }} validateTrigger={['onChange', 'onBlur']}
                     rules={[{ required: true, whitespace: true, message: 'Tên phường/xã không được để trống' }]}
                     hasFeedback>
            <Input placeholder='Tên phường/xã' disabled={loading}/>
          </Form.Item>
        </Form>
      </Modal>
    </div>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});

const withConnect = connect(mapStateToProps);

export default withConnect(PhuongXa);


