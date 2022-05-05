import request from '@/utils/requestPhp'

// app版本列表
export function file(data) {
  return request({
    url: '/php/app/file/info',
    method: 'post',
    data
  })
}

export function fileDownLoad(data) {
  return request({
    url: '/php/app/file/forceDownload',
    method: 'post',
    data
  })
}
