import request from '@/utils/request'

// 查询人员列表
export function getList(data) {
    return request({
        url: '/system/txglConfig/getPcZrrList',
        method: 'post',
        data
    })
}
// 查询当日在场人数列表
export function getCall(data) {
    return request({
        url: '/system/project/call_api',
        method: 'post',
        data
    })
}