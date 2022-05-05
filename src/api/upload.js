import request from '@/utils/requestPhp'

// app版本列表
export function upload(data) {
  return request({
    url: '/php/app/upload',
    method: 'post',
    data
  })
}
