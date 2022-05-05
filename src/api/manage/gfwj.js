import requestPhp from '@/utils/requestPhp'
import request from '@/utils/request'

// 查询经验分享列表
export function getGfwjList(data) {
  return requestPhp({
    url: '/php/admin/ProjectGfwj/list',
    method: 'post',
    data
  })
}
// 新增经验分享
export function addGfwjList(data) {
  return requestPhp({
    url: '/php/admin/ProjectGfwj/add',
    method: 'post',
    data
  })
}
// 更新经验分享
export function updateGfwjList(data) {
  return requestPhp({
    url: '/php/admin/ProjectGfwj/update',
    method: 'put',
    data
  })
}
// 删除经验分享
export function delGfwjList(ids) {
  return requestPhp({
    url: '/php/admin/ProjectGfwj/delete',
    method: 'post',
    data: {
      ids: ids.join(',')
    }
  })
}

// 阅读统计
export function downloadCount(data) {
  return request({
    url: '/download_count',
    method: 'get',
    params: data
  })
}

// // 查询经验分享列表
// export function getGfwjList(data) {
//     return request({
//         url: '/system/gfwj/list',
//         method: 'post',
//         data
//     })
// }
// // 新增经验分享
// export function addGfwjList(data) {
//     return request({
//         url: '/system/gfwj',
//         method: 'post',
//         data
//     })
// }
// // 更新经验分享
// export function updateGfwjList(data) {
//     return request({
//         url: '/system/gfwj',
//         method: 'put',
//         data
//     })
// }
// // 删除经验分享
// export function delGfwjList(ids) {
//     return request({
//         url: '/system/gfwj/' + ids,
//         method: 'delete'
//     })
// }
// // 阅读统计
// export function downloadCount(data) {
//     return request({
//         url: '/download_count',
//         method: 'get',
//         params: data
//     })
// }
