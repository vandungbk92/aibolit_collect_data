import React, { Component, Fragment } from 'react';
import { Input, Button, Form, Table, Popconfirm, message, Modal, InputNumber, Card, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, UnorderedListOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';

import { add, getById, getAll, delById, updateById } from '@services/danhmuc/tinhthanhService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search  from "@components/Search/Search";
import { stringify } from 'qs';
import queryString from 'query-string';

class TinhThanh extends Component {

  columns = [

    {
      title: 'Tên tỉnh',
      dataIndex: 'tentinh',
    },
    {
      title: 'Mã tỉnh',
      dataIndex: 'matinh',
      align: 'center',
      width: 150,
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
      thutu: 0
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
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
    queryStr += `${search.matinh ? '&matinh[like]={0}'.format(search.matinh) : ''}`
    queryStr += `${search.tentinh ? '&tentinh[like]={0}'.format(search.tentinh) : ''}`
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
      message.success('Xoá tỉnh/thành thành công');
    }
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal, _id: '' });
    this.formRef.current.resetFields();
  }

  handleSaveData = async (data) => {
    let matinh = data.matinh
    let tentinh = data.tentinh
    if (!tentinh.trim() || !matinh.trim()) {
      this.formRef.current.setFieldsValue({ matinh: matinh.trim(), tentinh: tentinh.trim()  });
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
        message.success('Chỉnh sửa tỉnh/thành thành công');
      }

    } else {
      // create
      const apiResponse = await add(data);
      if (apiResponse) {
        this.setState({ showModal: false });
        this.getDataFilter();
        message.success('Thêm mới tỉnh/thành thành công');
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
    this.formRef.current.setFieldsValue(data);
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
    const { dataRes, totalDocs, page, limit, _id } = this.state;
    const dataSearch = [
      {
        type: 'text',
        operation: 'like',
        name: 'tentinh',
        label: 'Tên tỉnh'
      },{
      type: 'text',
      operation: 'like',
      name: 'matinh',
      label: 'Mã tỉnh'
    }]
    return <div>

      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách tỉnh/thành
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
                 total: totalDocs,
               }}
               onChange={this.onChangeTable}/>
      </Card>

      <Modal title={_id ? 'Chỉnh sửa tỉnh/thành' : 'Thêm mới tỉnh/thành'}
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
          <Form.Item label="Mã tỉnh/thành" name="matinh" hasFeedback labelCol={{ span: 6 }} validateTrigger={['onChange', 'onBlur']}
                     rules={[{ required: true, whitespace: true, message: 'Mã tỉnh/thành không được để trống' }]}>
            <Input placeholder='Nhập tỉnh thành' disabled={loading}/>
          </Form.Item>

          <Form.Item label="Tên tỉnh/thành" name="tentinh" hasFeedback labelCol={{ span: 6 }} validateTrigger={['onChange', 'onBlur']}
                     rules={[{ required: true, whitespace: true, message: 'Tên tỉnh/thành không được để trống' }]}>
            <Input placeholder='Nhập tỉnh/thành' disabled={loading}/>
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

export default withConnect(TinhThanh);


