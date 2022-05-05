import request from '@/utils/request'

// 下载模板文件
export function downloadDefault() {
    return request({
        url: '/system/yzxmb/importTemplate',
        method: 'get'
    })
}
// 查询列表
export function getList(params) {
    return request({
        url: '/system/yzxmb/list',
        method: 'get',
        params
    })
}
// 查询列表
export function exportList(data) {
    return request({
        url: '/system/yzxmb/export',
        method: 'get',
        data
    })
}
// // 新增计划
export function addList(data) {
    return request({
        url: '/system/yzxmb',
        method: 'post',
        data
    })
}
// 更新计划
export function updateList(data) {
    return request({
        url: '/system/yzxmb',
        method: 'put',
        data
    })
}
// 删除计划
export function delList(ids) {
    console.log(ids)
    return request({
        url: '/system/yzxmb/' + ids,
        method: 'delete'
    })
}