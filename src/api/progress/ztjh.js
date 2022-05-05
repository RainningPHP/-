import request from '@/utils/request'

// 查询列表
export function getList(data) {
    return request({
        url: '/system/project/getTotalJh',
        method: 'post',
        data
    })
} 