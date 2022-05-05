import request from '@/utils/requestPhp'

// 下载停电计划文件
export function downloadDefault() {
    return request({
        url: '/system/td/importTemplate',
        method: 'get'
    })
}
// 查询停电计划列表
export function getList(params) {
    return request({
        url: '/php/admin/ProjectPower/list',
        method: 'get',
        params
    })
}
// 导出设计计划列表
export function exportList(data) {
    return request({
        url: '/system/td/export',
        method: 'get',
        data
    })
}
// 新增停电计划
export function addList(data) {
    return request({
        url: '/php/admin/ProjectPower/add',
        method: 'post',
        data
    })
}
// 更新停电计划
export function updateList(data) {
    return request({
        url: '/php/admin/ProjectPower/update',
        method: 'put',
        data
    })
}
// 删除停电计划
// export function delList(ids) {
//     return request({
//         url: '/system/td/' + ids,
//         method: 'delete'
//     })
// }
export function delList(ids) {
  return request({
    url: '/php/admin/ProjectPower/delete',
    method: 'delete',
    data: {
      ids: ids.join(',')
    }
  })
}

export function getProjects(params) {
  return request({
    url: '/php/admin/Project/projectQuery',
    method: 'get',
    params
  })
}

