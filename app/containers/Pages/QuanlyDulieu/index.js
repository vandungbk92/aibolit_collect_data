import React, { Component, Fragment } from 'react';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DeleteOutlined, EyeOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL } from '@url';
import {API} from '../../../constants/API';
import { stringify } from 'qs';

import { Button, Card, message, Popconfirm, Table, Tooltip } from 'antd';
import Search from '@components/Search/Search';
import { PAGINATION_CONFIG } from '@constants';
import { getAll, delById } from '@services/quanlydulieuServices';
import queryString from 'query-string';
import moment from 'moment';

class QuanlyDulieu extends Component {
  columns = [
    {
      title: "Tên dữ liệu",
      dataIndex: "tendulieu",
      width: 100,
    },
    {
      title: 'Tên nhân viên',
      width: 100,
      render: (value) => (
        <div>
          <span style={{ textAlign: "start" }}>
            {value.nhanvien_id?.full_name}
          </span>
        </div>)
    },
    {
      title: 'Ngày upload',
      width: 100,
      render: (value) => (
        <div>
          <span style={{ textAlign: "start" }}>
            {moment(value.ngayupload).format("DD/MM/YYYY")}
          </span>
        </div>
      )

    },
    {
      title: 'Ghi chú',
      dataIndex: "ghichu",
      width: 100,
    },
    {
      title: 'Loại dữ liệu',
      width: 100,
      render: value => this.formatType(value),
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
      showDuyet: false,
      dataSelect: {},
    };
  }

  componentDidMount() {
    this.getDataFilter();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getDataFilter()
    }
  }

  formatType(value) {
    if (value.hinhanh.length > 0) {
      return <b>Hình ảnh</b>
    } else if (value.video) {
      return <b>Video</b>
    } else {
      return <b>Audio</b>
    }
  }

  formatAudio(value) {
    return <>
      {value.audio && (
        <div>
          <b>Audio</b>
          <audio controls>
            <source src={API.FILE + "/file/" + value.nhanvien_id._id + "---" + moment(value.ngayupload).format("YYYY-MM-DD") + "---" + value.audio} type="audio/m4a"/>
          </audio>
        </div>
      )}
    </>
  }

  async getDataFilter() {
    let search = queryString.parse(this.props.location.search);
    let page = parseInt(search.page ? search.page : this.state.page);
    let limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = ''
    queryStr += `${search.from_date ? '&ngayupload[from]={0}'.format(search.from_date) : ''}`;
    queryStr += `${search.tendulieu ? '&tendulieu[like]={0}'.format(search.tendulieu) : ''}`;

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

  formatActionCell(value) {
    return <>
      <Link to={URL.CHI_TIET_DU_LIEU.format(value._id)}>
        <Tooltip title={'Xem chi tiết'} color="#2db7f5">
          <Button icon={<EyeOutlined/>} size='small' type="primary" className='mr-1' onClick={() => this.toggleChitiet(value)}/>
        </Tooltip>
      </Link>

      <Popconfirm key={value._id} title="Bạn chắc chắn muốn xoá?"
                  onConfirm={() => this.handleDelete(value)}
                  cancelText='Huỷ' okText='Xoá' okButtonProps={{ type: 'danger' }}>
        <Tooltip title={'Xóa dữ liệu'} color="#f50">
          <Button icon={<DeleteOutlined/>} type='danger' size='small' className="mr-1"></Button>
        </Tooltip>
      </Popconfirm>
    </>;
  }

  async handleDelete(value) {
    const apiResponse = await delById(value._id);
    if (apiResponse) {
      this.getDataFilter();
      message.success('Xoá thành công');
    }
  }

  toggleChitiet(value) {
    const { showDuyet } = this.state;
    this.setState({ showDuyet: !showDuyet , dataSelect: value});
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
    const { loading} = this.props;
    const {dataRes, page, limit, totalDocs,dataSelect} = this.state;

    const dataSearch = [
      {
        type: 'text',
        name: 'tendulieu',
        label: 'Tên dữ liệu'
      },
      {
        type: 'date',
        name: 'from_date',
        label: 'Từ ngày'
      },
    ]
    return(
      <div>
        <Card size="small"
              title={<span> <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách dữ liệu </span>}
              md="24"
        >
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
      </div>
    )
  }
}
const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading()
});


const withConnect = connect(mapStateToProps);
export default compose(withConnect)(QuanlyDulieu);
