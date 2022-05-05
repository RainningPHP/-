import request from '@/utils/request'
// 下载违章库模板文件
export function downloadWzkDefault() {
    return request({
        url: '/system/peccancy/importTemplate',
        method: 'get'
    })
}
// 查询违章库列表
export function getWzkList(data) {
    return request({
        url: '/system/peccancy/list',
        method: 'post',
        data
    })
}
// 更新违章库
export function updateWzkList(data) {
    return request({
        url: '/system/peccancy',
        method: 'put',
        data
    })
}
// 新增违章库
export function addWzkList(data) {
    return request({
        url: '/system/peccancy',
        method: 'post',
        data
    })
}
// 删除违章库
export function delWzkList(ids) {
    return request({
        url: '/system/peccancy/' + ids,
        method: 'delete'
    })
}