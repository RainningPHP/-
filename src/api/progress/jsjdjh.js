import request from '@/utils/request'

// 下载模板文件
export function downloadDefaultBdz() {
    return request({
        url: '/system/plan/importTemplate_bdz',
        method: 'get'
    })
}
// 下载模板文件
export function downloadDefaultXl() {
    return request({
        url: '/system/plan/importTemplate_xl',
        method: 'get'
    })
}
// 查询列表
export function getList(params) {
    return request({
        url: '/system/plan/list',
        method: 'get',
        params
    })
}
// 查询列表
export function exportList(data) {
    return request({
        url: '/system/plan/export',
        method: 'get',
        data
    })
}
// // 新增计划
export function addList(data) {
    return request({
        url: '/system/plan',
        method: 'post',
        data
    })
}
// 更新计划
export function updateList(data) {
    return request({
        url: '/system/plan',
        method: 'put',
        data
    })
}
// 删除计划
export function delList(ids) {
    console.log(ids)
    return request({
        url: '/system/plan/' + ids,
        method: 'delete'
    })
}