import React, { Component, Fragment } from 'react';
import { Input, Button, Form, Table, Popconfirm, message, Card, Tooltip } from "antd";
import { DeleteOutlined, PrinterOutlined, PlusOutlined, UnorderedListOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { add, getById, getAll, delById, updateById } from '@services/noisoihongService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search  from "@components/Search/Search";
import { stringify } from 'qs';
import queryString from 'query-string';
import { URL } from "../../../constants/URL";
import {dateFormatter} from '@commons/dateFormat';
import { withDanhMuc } from "@reduxApp/DanhMuc/connect";
import { compose } from 'redux';

class NoiSoiHong extends Component {

  columns = [
    {
      title: 'Mã khám',
      dataIndex: 'makham',
      width: 100,
    },
    {
      title: 'Thông tin',
      dataIndex: 'tinhthanh_id',
      width: 150,
      render: (value, rowData, rowIndex) => {
        return <>
          <div>-Tuổi: {rowData.tuoi}</div>
          <div>-Giới tính: {rowData.gioitinh}</div>
          <div>-Địa chỉ: {rowData?.phuongxa_id?.tenphuongxa}-{rowData?.quanhuyen_id?.tenqh}-{rowData?.tinhthanh_id?.tentinh}</div>
        </>
      }
    },
    {
      title: 'Lý do khám',
      dataIndex: 'tinhthanh_id',
      width: 150,
      render: (value, rowData, rowIndex) => {
        return <>
          {
            !!rowData.lydokham && <div>-{rowData.lydokham}</div>
          }
          {
            !!rowData?.trieuchung_id.length && <div>
              - Triệu chứng: <strong>{rowData.trieuchung_id.map(data => {
                return data.trieuchung + ','
            })}</strong>
            </div>
          }
        </>
      }
    },
    {
      title: 'Kết quả',
      dataIndex: 'tinhthanh_id',
      width: 150,
      render: (value, rowData, rowIndex) => {
        return <>
          {
            !!rowData.ketluan && <div>-{rowData.ketluan}</div>
          }
          {
            !!rowData?.benh_id.length && <div>
              - Bệnh: <strong>{rowData.benh_id.map(data => {
              return data.benh + ','
            })}</strong>
            </div>
          }
        </>
      }
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
      totalDocs: 0
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

  async getDataFilter() {
    let search = queryString.parse(this.props.location.search);
    let page = parseInt(search.page ? search.page : this.state.page);
    let limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = ''
    queryStr += `${search.makham ? '&makham[like]={0}'.format(search.makham) : ''}`
    queryStr += `${search.from_date ? '&created_at[from]={0}'.format(search.from_date) : ''}`
    queryStr += `${search.to_date ? '&created_at[to]={0}'.format(search.to_date) : ''}`
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
      message.success('Xoá thành công');
    }
  }

  formatChiTiet(value) {
    return <>
      <span className="">Tổng số khám: {value ? value.tongsokham : 0}</span>
      <ul>
        <li className="text-success">Đã khám: {value ? value.dakham : 0}</li>
        <li className="text-warning">Đang khám: {value ? value.dangkham : 0}</li>
        <li className="text-danger">Chưa khám: {value ? value.chuakham : 0}</li>
      </ul>
    </>
  }
  formatActionCell(value) {
    return <>
      <Link to={URL.NOI_SOI_HONG_ID.format(value._id)}>
        <Tooltip title={'Xem chi tiết'} color="#2db7f5">
          <Button icon={<EyeOutlined/>} size='small' type="primary" className='mr-1'></Button>
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
    const dataSearch = [{
      type: 'text',
      name: 'makham',
      label: 'Mã dữ liệu'
    },
      {
        type: 'date',
        name: 'from_date',
        label: 'Từ ngày'
      },
      {
        type: 'date',
        name: 'to_date',
        label: 'Đến ngày'
      }
    ]
    return <div>

      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách khám định kỳ
      </span>} md="24" bordered extra={<Link to={URL.NOI_SOI_HONG_ADD}>
        <Button type="primary" className='pull-right' size="small" icon={<PlusOutlined/>}>Thêm</Button>
      </Link>}>
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
    </div>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading()
});


const withConnect = connect(mapStateToProps);
export default compose(withConnect)(NoiSoiHong);


