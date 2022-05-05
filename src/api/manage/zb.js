import request from '@/utils/request'

// 下载模板文件
export function downloadDefault() {
    return request({
        url: '/system/report/importTemplate',
        method: 'get'
    })
}
// 查询列表
export function getList(params) {
    return request({
        url: '/system/report/pc_list',
        method: 'get',
        params
    })
}
// 新增
export function addList(data) {
    return request({
        url: '/system/report',
        method: 'post',
        data
    })
}
// 更新
export function updateList(data) {
    return request({
        url: '/system/report',
        method: 'put',
        data
    })
}
// 删除
export function delList(ids) {
    return request({
        url: '/system/report/' + ids,
        method: 'delete'
    })
}