import request from '@/utils/request'

// 下载停电计划文件
export function downloadTdjhDefault() {
    return request({
        url: '/system/td/importTemplate',
        method: 'get'
    })
}


// 查询停电计划列表
export function getTdjhList(data) {
    return request({
        url: '/system/td/list',
        method: 'post',
        data
    })
}
// 新增预算计划
// export function addYsjhList(data) {
//     return request({
//         url: '/system/budget',
//         method: 'post',
//         data
//     })
// }
// 更新停电计划
export function updateTdjhList(data) {
    return request({
        url: '/system/td',
        method: 'put',
        data
    })
}
// 删除停电计划
export function delTdjhList(ids) {
    return request({
        url: '/system/td/' + ids,
        method: 'delete'
    })
}
