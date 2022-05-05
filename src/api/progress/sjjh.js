import request from '@/utils/request'

// 下载e安全考勤模板文件
export function downloadDefault() {
    return request({
        url: '/system/paper/importTemplate',
        method: 'get'
    })
}
// 查询设计计划列表
export function getList(params) {
    return request({
        url: '/system/paper/list',
        method: 'get',
        params
    })
}
// 导出设计计划列表
export function exportList(data) {
    return request({
        url: '/system/paper/export',
        method: 'get',
        data
    })
}
// 新增设计计划
export function addList(data) {
    return request({
        url: '/system/paper',
        method: 'post',
        data
    })
}
// 更新设计计划
export function updateList(data) {
    return request({
        url: '/system/paper',
        method: 'put',
        data
    })
}
// 删除设计计划
export function delList(ids) {
    return request({
        url: '/system/paper/' + ids,
        method: 'delete'
    })
}