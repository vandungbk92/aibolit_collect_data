import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
  query = query ? query : ''
  return axios.get(`${API.QUAN_LY_DU_LIEU_QUERY.format(page, limit, query)}`).then(res => {
    if (res.data) {
      return res.data;
    }
    else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

export function create(data) {
  return axios
    .post(`${API.QUAN_LY_DU_LIEU}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function delById(id) {
  return axios.delete(`${API.QUAN_LY_DU_LIEU_ID.format(id)}`).then(res => {
    if (res.data) {
      return res.data;
    }
    else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

export function getById(id) {
  return axios.get(`${API.QUAN_LY_DU_LIEU_ID.format(id)}`).then(res => {
    if (res.data) {
      return res.data;
    }
    else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

export function updateById(id, data) {
  return axios.put(`${API.QUAN_LY_DU_LIEU_ID.format(id)}`, data).then(res => {
    if (res.data) {
      return res.data;
    }
    else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}
