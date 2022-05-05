import request from '@/utils/requestPhp'
export function addControl(data) {
    return request({
        url: '/php/app/project_manage/typeAdd',
        method: 'post',
        data
    })
}
export function getControlList() {
    return request({
        url: '/php/app/project_manage/typeList',
        method: 'get'
    })
}
