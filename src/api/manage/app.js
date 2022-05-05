import request from '@/utils/requestPhp'
// app版本列表
export function getAppList(data) {
    return request({
        url: '/php/admin/appVersion/list',
        method: 'get',
        data
    })
}

export function addApp(data) {
  return request({
    url: '/php/admin/appVersion/add',
    method: 'post',
    data
  })
}
