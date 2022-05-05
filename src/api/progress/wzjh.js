import request from '@/utils/request'

// 下载e安全考勤模板文件
export function downloadDefault() {
    return request({
        url: '/system/wzjh/importTemplate',
        method: 'get'
    })
}
// 查询预算计划列表
export function getList(params) {
    return request({
        url: '/system/wzjh/list',
        method: 'get',
        params
    })
}
// 查询预算计划列表
export function exportList(data) {
    return request({
        url: '/system/wzjh/export',
        method: 'get',
        data
    })
}
// 新增预算计划
export function addList(data) {
    return request({
        url: '/system/wzjh',
        method: 'post',
        data
    })
}
// 更新预算计划
export function updateList(data) {
    return request({
        url: '/system/wzjh',
        method: 'put',
        data
    })
}
// 删除预算计划
export function delList(ids) {
    return request({
        url: '/system/wzjh/' + ids,
        method: 'delete'
    })
}