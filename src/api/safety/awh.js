
import request from '@/utils/requestPhp'
// 获取安委会项目列表
export function getControlList(data) {
    return request({
        url: '/php/project_safe_meet/index',
        method: 'get',
        data
    })
}
// 添加
export function addControl(data) {
    return request({
        url: '/php/project_safe_meet/add',
        method: 'post',
        data
    })
}


