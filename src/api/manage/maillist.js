import request from '@/utils/requestPhp'

export function mailList(data) {
  return request({
    url: '/php/admin/phone/index',
    method: 'post',
    data
  })
}

export function addMail(data) {
    return request({
        url: '/php/admin/phone/add',
        method: 'post',
        data
    })
}

export function updateMail(data) {
  return request({
    url: '/php/admin/phone/update',
    method: 'post',
    data
  })
}

export function delMail(data) {
  return request({
    url: '/php/admin/phone/del',
    method: 'post',
    data
  })
}
