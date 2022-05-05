
import request from '@/utils/requestPhp'
// 获取
export function getControlList(data) {
    return request({
        url: '/php/app/project_paper/list',
        method: 'get',
        data
    })
}
// 添加
export function addControl(data) {
    return request({
        url: '/php/app/project_paper/add',
        method: 'get',
        data
    })
}
