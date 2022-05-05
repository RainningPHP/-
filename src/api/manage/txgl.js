import request from '@/utils/request'
import requestPhp from '@/utils/requestPhp'
// 下载模板文件
export function downloadDefault() {
    return request({
        url: '/system/txglConfig/importTemplate',
        method: 'get'
    })
}
// // 查询列表
// export function getList(data) {
//     return request({
//         url: '/system/txglConfig/list',
//         method: 'post',
//         data
//     })
// }
// // 更新
// export function updateList(data) {
//     return request({
//         url: '/system/txglConfig',
//         method: 'put',
//         data
//     })
// }
// // 新增
// export function addList(data) {
//     return request({
//         url: '/system/txglConfig',
//         method: 'post',
//         data
//     })
// }
// // 删除
// export function delList(ids) {
//     return request({
//         url: '/system/txglConfig/' + ids,
//         method: 'delete'
//     })
// }

// 查询列表
export function getList(data) {
  return requestPhp({
    url: '/php/admin/ProjectTxglConfig/list',
    method: 'post',
    data
  })
}
// 更新
export function updateList(data) {
  return requestPhp({
    url: '/php/admin/ProjectTxglConfig/update',
    method: 'put',
    data
  })
}
// 新增
export function addList(data) {
  return requestPhp({
    url: '/php/admin/ProjectTxglConfig/add',
    method: 'post',
    data
  })
}
// 删除
export function delList(ids) {
  return requestPhp({
    url: '/php/admin/ProjectTxglConfig/delete',
    method: 'delete',
    data: {
      ids: ids.join(',')
    }
  })
}
