import request from '@/utils/request'

// 下载e安全考勤模板文件
export function downloadDefault() {
    return request({
        url: '/system/gjjd/importTemplate',
        method: 'get'
    })
}
// 查询项目信息表列表
export function getList(params) {
    return request({
        url: '/system/gjjd/list',
        method: 'get',
        params
    })
}
// 导出项目信息表列表
export function exportList(data) {
    return request({
        url: '/system/gjjd/export',
        method: 'post',
        data
    })
}
// 新增项目信息表
export function addList(data) {
    return request({
        url: '/system/gjjd',
        method: 'post',
        data
    })
}
// 更新项目信息表
export function updateList(data) {
    return request({
        url: '/system/gjjd',
        method: 'put',
        data
    })
}
// 删除项目信息表
export function delList(ids) {
    return request({
        url: '/system/gjjd/' + ids,
        method: 'delete'
    })
}