import request from '@/utils/requestPhp'
// // 查询经验分享列表
// export function getLiberaryList(data) {
//     return request({
//         url: '/system/liberary/list',
//         method: 'post',
//         data
//     })
// }
// // 新增经验分享
// export function addLiberaryList(data) {
//     return request({
//         url: '/system/liberary',
//         method: 'post',
//         data
//     })
// }
// // 更新经验分享
// export function updateLiberaryList(data) {
//     return request({
//         url: '/system/liberary',
//         method: 'put',
//         data
//     })
// }
// // 删除经验分享
// export function delLiberaryList(ids) {
//     return request({
//         url: '/system/liberary/' + ids,
//         method: 'delete'
//     })
// }

export function getLiberaryList(data) {
  return request({
    url: '/php/admin/ProjectLiberary/list',
    method: 'post',
    data
  })
}

// 新增经验分享
export function addLiberaryList(data) {
  return request({
    url: '/php/admin/ProjectLiberary/add',
    method: 'post',
    data
  })
}

// 更新经验分享
export function updateLiberaryList(data) {
  return request({
    url: '/php/admin/ProjectLiberary/update',
    method: 'put',
    data
  })
}

// 删除经验分享
export function delLiberaryList(ids) {
  return request({
    url: '/php/admin/ProjectLiberary/delete',
    method: 'delete',
    data: {
      ids: ids.join(',')
    }
  })
}


