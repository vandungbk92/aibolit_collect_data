import React, { Component, Fragment } from 'react';
import { Input, Button, Form, Table, Popconfirm, message, Modal, Tooltip, Card, Select } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, UnorderedListOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';

import { add, getById, getAll, delById, updateById } from '@services/danhmuc/quanhuyenService';
import {getAll as getAllTinh} from '@services/danhmuc/tinhthanhService'
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search  from "@components/Search/Search";
import { stringify } from 'qs';
import queryString from 'query-string';
import produce from 'immer'

class QuanHuyen extends Component {

  columns = [
    {
      title: 'Tỉnh/thành Phố',
      render: (value) => this.formatTinhThanh(value),
    },
    {
      title: 'Tên quận/huyện',
      dataIndex: 'tenqh',
    },
    {
      title: 'Mã quận/huyện',
      dataIndex: 'maqh',
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
      tinhthanh: []
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
    queryStr += `${search.maqh ? '&maqh[like]={0}'.format(search.maqh) : ''}`
    queryStr += `${search.tenqh ? '&tenqh[like]={0}'.format(search.tenqh) : ''}`
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
      message.success('Xoá quận/huyện thành công');
    }
  }

  formatTinhThanh(value) {
    return value && value.tinhthanh_id ? value.tinhthanh_id.tentinh : '';
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal, _id: '' });
    this.formRef.current.resetFields();
  }

  handleSaveData = async (data) => {
    let maqh = data.maqh
    let tenqh = data.tenqh
    if (!maqh.trim() || !tenqh.trim()) {
      this.formRef.current.setFieldsValue({ maqh: maqh.trim(), tenqh: tenqh.trim()  });
      this.formRef.current.validateFields();
      return;
    }

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
        message.success('Chỉnh sửa quận/huyện thành công');
      }

    } else {
      // create
      const apiResponse = await add(data);
      if (apiResponse) {
        this.setState({ showModal: false });
        this.getDataFilter();
        message.success('Thêm mới quận/huyện thành công');
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
      draft.tinhthanh_id = draft.tinhthanh_id._id
    })
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

  render() {
    const { loading } = this.props;
    const { dataRes, totalDocs, page, limit, _id, tinhthanh } = this.state;
    const dataSearch = [
      {
        type: 'select',
        name: 'tinhthanh_id',
        label: 'Tỉnh/thành',
        options: tinhthanh,
        key: '_id',
        value: 'tentinh'
      },
      {
        type: 'text',
        operation: 'like',
        name: 'tenqh',
        label: 'Tên Q.huyện'
      },
      {
        type: 'text',
        operation: 'like',
        name: 'maqh',
        label: 'Mã Q.huyện'
      },
    ]
    return <div>

      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách quận/huyện
      </span>} md="24" bordered extra={<div>
        <Button type="primary" onClick={this.toggleModal} className='pull-right' size="small" icon={<PlusOutlined/>}>Thêm</Button>
      </div>}>
        <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch}/>
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

      <Modal title={_id ? 'Chỉnh sửa quận/huyện' : 'Thêm mới quận/huyện'}
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
                    filterOption={(input, option) => {
              return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }}>
              {tinhthanh.map((data, idx) => {
                return <Select.Option key={data._id} value={data._id}>{data.tentinh}</Select.Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item label="Mã quận/huyện" name="maqh" hasFeedback labelCol={{ span: 6 }} validateTrigger={['onChange', 'onBlur']}
                     rules={[{ required: true, whitespace: true, message: 'Mã quận/huyện không được để trống' }]}>
            <Input placeholder='Mã quận/huyện' disabled={loading}/>
          </Form.Item>
          <Form.Item label="Tên quận/huyện" name="tenqh" labelCol={{ span: 6 }} validateTrigger={['onChange', 'onBlur']}
                     rules={[{ required: true, whitespace: true, message: 'Tên quận/huyện không được để trống' }]}
                     hasFeedback>
            <Input placeholder='Tên quận/huyện' disabled={loading}/>
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

export default withConnect(QuanHuyen);


