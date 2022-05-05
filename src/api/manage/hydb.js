import request from '@/utils/request'
// 查询会议列表
export function getHydbMeetingList(data) {
    return request({
        url: '/system/meetingTask/analysis',
        method: 'post',
        data
    })
}
// 查询待办列表
export function getHydbTaskList(data) {
    return request({
        url: '/system/meetingTask/list',
        method: 'post',
        data
    })
}
//获取管理人员列表
export function getManagerList() {
    return request({
        url: '/system/user/list',
        method: 'get'
    })
}
// 下载模板文件
export function downloadHydbDefault() {
    return request({
        url: '/system/meetingTask/importTemplate',
        method: 'get'
    })
}
// 新增
export function addHydbList(data) {
    return request({
        url: '/system/meetingTask',
        method: 'post',
        data
    })
}
// 更新
export function updateHydbList(data) {
    return request({
        url: '/system/meetingTask',
        method: 'put',
        data
    })
}
// 删除
export function delHydbList(ids) {
    return request({
        url: '/system/meetingTask/' + ids,
        method: 'delete'
    })
}

// 下发指派
export function addDb(data) {
    return request({
        url: '/system/yj/add_db',
        method: 'post',
        data
    })
}