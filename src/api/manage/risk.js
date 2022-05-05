import request from '@/utils/request'
// 下载e安全考勤模板文件
export function downloadFxdjDefault() {
    return request({
        url: '/system/risk/importTemplate',
        method: 'get'
    })
}
// 查询风险等级列表
export function getFxdjList(data) {
    return request({
        url: '/system/risk/list',
        method: 'post',
        data
    })
}
// 更新风险等级
export function updateFxdjList(data) {
    return request({
        url: '/system/risk',
        method: 'put',
        data
    })
}
// 删除风险等级
export function delFxdjList(ids) {
    return request({
        url: '/system/risk/' + ids,
        method: 'delete'
    })
}