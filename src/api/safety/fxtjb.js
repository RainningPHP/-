import request from '@/utils/requestPhp'

export function getList(data) {
  return request({
    url: '/php/admin/ProjectRisk/list',
    method: 'post',
    data
  })
}

export function getProjectList(data) {
  return request({
    url: '/php/app/project/projects',
    method: 'post',
    data
  })
}

export function addList(data) {
  return request({
    url: '/php/admin/ProjectRisk/add',
    method: 'post',
    data
  })
}

export function updateList(data) {
  return request({
    url: '/php/admin/ProjectRisk/update',
    method: 'post',
    data
  })
}

export function delList(ids) {
  return request({
    url: '/php/admin/ProjectRisk/delete',
    method: 'delete',
    data: {
      ids: ids.join(',')
    }
  })
}

// export function importData(ids) {
//   return request({
//     url: '/php/admin/ProjectRisk/importData',
//     method: 'delete',
//     data: {
//       ids: ids.join(',')
//     }
//   })
// }

// // 下载e安全考勤模板文件
// export function downloadDefault() {
//     return request({
//         url: '/system/risk/importTemplate',
//         method: 'get'
//     })
// }
// // 查询风险等级列表
// export function getList(data) {
//     return request({
//         url: '/system/risk/list',
//         method: 'post',
//         data
//     })
// }
// // 更新风险等级
// export function updateList(data) {
//     return request({
//         url: '/system/risk',
//         method: 'put',
//         data
//     })
// }
// // 删除风险等级
// export function delList(ids) {
//     return request({
//         url: '/system/risk/' + ids,
//         method: 'delete'
//     })
// }
