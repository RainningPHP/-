import request from '@/utils/requestPhp'

// 查询安全问题列表
export function getList(data) {
    return request({
        url: '/php/admin/ProjectCheck/list',
        method: 'post',
        data
    })
}
