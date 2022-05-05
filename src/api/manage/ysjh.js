import request from '@/utils/request'

// 下载e安全考勤模板文件
export function downloadYsjhDefault() {
    return request({
        url: '/system/budget/importTemplate',
        method: 'get'
    })
}
// 查询预算计划列表
export function getYsjhList(data) {
    return request({
        url: '/system/budget/list',
        method: 'post',
        data
    })
}
// 新增预算计划
export function addYsjhList(data) {
    return request({
        url: '/system/budget',
        method: 'post',
        data
    })
}
// 更新预算计划
export function updateYsjhList(data) {
    return request({
        url: '/system/budget',
        method: 'put',
        data
    })
}
// 删除预算计划
export function delYsjhList(ids) {
    return request({
        url: '/system/budget/' + ids,
        method: 'delete'
    })
}