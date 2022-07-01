import axios from 'axios';

function uploadFiles(files) {
  const config = {
    headers: {'content-type': 'multipart/form-data'}
  }
  let path = '/api/files'
  let dataRes = []
  const uploaders = files.map((file, index) => {
    // Initial FormData
    const formData = new FormData();
    formData.append("file", file);
    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
    return axios.post(path, formData, config).then(response => {
      const data = response.data;
      if(data && data.file_id){
        dataRes = [...dataRes, data.file_id]
      }

    }).catch(error => {
      console.log(index, 'upload k thành công')
    });
  });

  return axios.all(uploaders).then(axios.spread(function (res1, res2) {
    return dataRes
  }));
}

function uploadImages(images) {
  const config = {
    headers: {'content-type': 'multipart/form-data'}
  }
  let path = '/api/files/'
  let dataRes = []
  const uploaders = images.map((file, index) => {
    // Initial FormData
    const formData = new FormData();
    formData.append("image", file);
    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
    return axios.post(path, formData, config).then(response => {
      const data = response.data;
      if(data){
        dataRes = [...dataRes, data.image_id]
      }
    }).catch(error => {
      console.log(error, 'upload k thành công')
    });
  });

  return axios.all(uploaders).then(axios.spread(function (res1, res2) {
    return dataRes
  }));
}

function uploadImagesFrame(images, id, time) {
  const config = {
    headers: {'content-type': 'multipart/form-data'}
  }
  let path = `/api/uploads/${id}?time=${time}`
  let dataRes = []
  const uploaders = images.map((file, index) => {
    // Initial FormData
    const formData = new FormData();
    formData.append("files", file);
    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
    return axios.post(path, formData, config).then(response => {
      const {files} = response.data?.files;
      if(files){
        files.forEach(image => {
          dataRes.push(image);
        });
      }
    }).catch(error => {
      console.log(error, 'upload k thành công')
    });
  });

  return axios.all(uploaders).then(axios.spread(function (res1, res2) {
    return dataRes
  }));
}

function deleteProcess(processId) {
  return axios.delete(`/api/unit-process/${processId}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

function deleteCombine(processId) {
  return axios.delete(`/api/unit-combine/${processId}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

function deleteImages(idReq, images) {
  return axios.delete(`/api/unit-process/${idReq}/img/${images}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

function deleteImagesUnitCombine(idReq, images) {
  return axios.delete(`/api/unit-combine/${idReq}/img/${images}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

function deleteFiles(idReq, file) {
  return axios.delete(`/api/unit-process/${idReq}/file/${file}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

function deleteFilesUnitCombine(idReq, file) {
  return axios.delete(`/api/unit-combine/${idReq}/file/${file}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

function deleteImagesPublic(requestId, imgId) {
  return axios.delete(`/api/request/${requestId}/img/${imgId}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

async function uploadImagesPublic(images, requestId) {
  const config = {
    headers: {'content-type': 'multipart/form-data'}
  }
  let path = `/api/request/${requestId}/img`
  let dataRtn = []

  for (let i = 0; i < images.length; i++) {
    // Initial FormData
    let formData = new FormData();
    formData.append("image", images[i]);
    let dataRes = await axios.post(path, formData, config)
    dataRtn = [...dataRtn, dataRes.data.image_id]
  }

  return dataRtn

  /*const uploaders = images.map((file, index) => {
    // Initial FormData
    const formData = new FormData();
    formData.append("image", file);
    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
    return axios.post(path, formData, config).then(response => {
      const data = response.data;
      dataRes = [...dataRes, data]
    }).catch(error => {
      console.log(index, 'upload k thành công')
    });
  });

  return axios.all(uploaders).then(axios.spread(function (res1, res2) {
    return dataRes
  }));*/
}

function deleteFilePublic(requestId, fileId) {
  return axios.delete(`/api/request/${requestId}/file/${fileId}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

async function uploadFilePublic(fileUpload, requestId) {
  const config = {
    headers: {'content-type': 'multipart/form-data'}
  }
  let path = `/api/request/${requestId}/file`
  let dataRtn = []

  for (let i = 0; i < fileUpload.length; i++) {
    // Initial FormData
    let formData = new FormData();
    formData.append("image", fileUpload[i]);
    let dataRes = await axios.post(path, formData, config)
    dataRtn = [...dataRtn, dataRes.data.file_id]
  }

  return dataRtn
  /*const uploaders = fileUpload.map((file, index) => {
    // Initial FormData
    const formData = new FormData();
    formData.append("image", file);
    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
    let dataRes = await axios.post(path, formData, config).then(response => {
      const data = response.data;
      dataRes = [...dataRes, data]
    }).catch(error => {
      console.log(index, 'upload k thành công')
    });
  });

  return axios.all(uploaders).then(axios.spread(function (res1, res2) {
    return dataRes
  }));*/
}

export {
  uploadFiles,
  uploadImages,
  deleteProcess,
  deleteCombine,
  deleteImages,
  deleteFiles,
  uploadImagesPublic,
  deleteImagesPublic,
  deleteFilePublic,
  uploadFilePublic,
  deleteImagesUnitCombine,
  deleteFilesUnitCombine,
  uploadImagesFrame,
}
