import request from '@/utils/request'


// 查询项目列表
export function getProjectList(params) {
    return request({
        url: '/system/project/list',
        method: 'get',
        params
    })
}

// 新增项目
export function addProject(data) {
    return request({
        url: '/system/project',
        method: 'post',
        data
    })
}
// 更新项目
export function updateProject(data) {
    return request({
        url: '/system/project',
        method: 'put',
        data
    })
}
// 获取项目用户列表
export function getUserList() {
    return request({
        url: '/system/user/list',
        method: 'get'
    })
}
// 更新项目用户列表
export function updateUserList(data) {
    return request({
        url: '/system/project',
        method: 'put',
        data
    })
}
// 获取项目信息
export function getProjectInfo(params) {
    return request({
        url: '/system/project/getInfo/' + params,
        method: 'get'
    })
}
// 获取文件url
export function getFileUrl(params) {
    return request({
        url: '/system/info/' + params,
        method: 'get'
    })
}
// 更新可研评审
export function updateKypsList(data) {
    return request({
        url: '/system/kyps',
        method: 'post',
        data
    })
}
// 获取可研评审
export function getKypsList(id) {
    return request({
        url: '/system/kyps/list/' + id,
        method: 'get'
    })
}
// 更新项目核准
export function updateXmhzList(data) {
    return request({
        url: '/system/xmhz',
        method: 'post',
        data
    })
}
// 获取项目核准
export function getXmhzList(id) {
    return request({
        url: '/system/xmhz/list/' + id,
        method: 'get'
    })
}
// 更新支撑性文件
export function updateZcxwjList(data) {
    return request({
        url: '/system/zcxwj',
        method: 'post',
        data
    })
}
// 获取支撑性文件
export function getZcxwjList(id) {
    return request({
        url: '/system/zcxwj/list/' + id,
        method: 'get'


    })
}
//获取支撑性文件附件列表
export function getZcxwjListDoc(data) {
    return request({
        url: '/system/zcxwj/list_detail',
        method: 'post',
        data
    })
}
// 更新初步设计
export function updateCbsjList(data) {
    return request({
        url: '/system/cbsj',
        method: 'post',
        data
    })
}
// 获取初步设计
export function getCbsjList(id) {
    return request({
        url: '/system/cbsj/list/' + id,
        method: 'get'
    })
}
// 获取进度管理
export function getJdglList(params) {
    return request({
        url: '/system/lz/list',
        method: 'get',
        params
    })
}
// 获取会议详情
// {projectid, meetingTime)
export function getHyList(params) {
    return request({
        url: '/system/meeting/list',
        method: 'get',
        params
    })
}
// 获取打卡详情
// {projectid, dkTimeIn)

export function getDkList(params) {
    return request({
        url: '/system/dk/list',
        method: 'get',
        params
    })
}
// 获取检查详情
// {projectid, checkTime)

export function getJcList(params) {
    return request({
        url: '/system/check/list',
        method: 'get',
        params
    })
}
// 根据角色获取列表
export function getInfoByLoginUser(data) {
    return request({
        url: '/system/project/list',
        method: 'post',
        data
    })
}
// // 根据角色获取列表
// export function getInfoByLoginUser(params) {
//     return request({
//         url: '/system/project/list',
//         method: 'get',
//         params
//     })
// }
// 根据项目id获取子项目
export function getChildrenProject(params) {
    return request({
        url: '/system/project/getInfo_children/' + params,
        method: 'get'
    })
}
// 下载文件
export function commonDownload(id) {
    window.location.href = process.env.VUE_APP_BASE_API + "/common/download_new?id=" + id + "&delete=" + false;

}
// 下载停电模板文件
export function downloadTdDefault() {
    return request({
        url: '/system/td/importTemplate',
        method: 'get'
    })
}
// 获取停电列表信息
export function getTdjhList(data) {
    return request({
        url: '/system/td/list',
        method: 'post',
        data
    })
}

// 批量删除物资文件
export function delTdjhFile(ids) {
    return request({
        url: '/system/td/' + ids,
        method: 'delete'
    })
}
// 下载物资模板文件
export function downloadWzjhDefault() {
    return request({
        url: '/system/wz/importTemplate',
        method: 'get'
    })
}
// 获取物资列表信息
export function getWzjhList(data) {
    return request({
        url: '/system/wz/list',
        method: 'post',
        data
    })
}

// 批量删除物资文件
export function delWzjhFile(ids) {
    return request({
        url: '/system/wz/' + ids,
        method: 'delete'
    })
}
// 下载坐标信息模板文件
export function downloadZbxxDefault() {
    return request({
        url: '/system/tower/importTemplate',
        method: 'get'
    })
}
// 获取坐标信息列表信息
export function getZbxxList(data) {
    return request({
        url: '/system/tower/list',
        method: 'post',
        data
    })
}
// 批量删除坐标信息文件
export function delZbxxFile(ids) {
    return request({
        url: '/system/tower/' + ids,
        method: 'delete'
    })
}
// 更新坐标信息
export function updateZbxxList(data) {
    return request({
        url: '/system/tower',
        method: 'put',
        data
    })
}
// 下载e安全考勤模板文件
export function downloadEaqkqDefault() {
    return request({
        url: '/system/data/importTemplate',
        method: 'get'
    })
}
// 获取e安全考勤列表信息
export function getEaqkqList(data) {
    return request({
        url: '/system/data/list',
        method: 'post',
        data
    })
}

// 批量删除e安全考勤文件
export function delEaqkqFile(ids) {
    return request({
        url: '/system/data/' + ids,
        method: 'delete'
    })
}

// 获取合同
export function getHtList(data) {
    return request({
        url: '/system/ht/list',
        method: 'post',
        data
    })
}
// 更新合同
export function updateHtList(data) {
    return request({
        url: '/system/ht',
        method: 'put',
        data
    })
}
// 添加合同
export function addHtList(data) {
    return request({
        url: '/system/ht',
        method: 'post',
        data
    })
}

// 查询图纸交付列表
export function getTzjfList(data) {
    return request({
        url: '/system/paper/list',
        method: 'get',
        data
    })
}
// 新增图纸交付
export function addTzjfList(data) {
    return request({
        url: '/system/paper',
        method: 'post',
        data
    })
}
// 更新图纸交付
export function updateTzjfList(data) {
    return request({
        url: '/system/paper',
        method: 'put',
        data
    })
}
// 删除图纸交付
export function delTzjfList(ids) {
    return request({
        url: '/system/paper/' + ids,
        method: 'delete'
    })
}

// 查询建设进度计划列表
export function getJsjdjhList(data) {
    return request({
        url: '/system/plan/list',
        method: 'post',
        data
    })
}
// 新增建设进度计划
export function addJsjdjhList(data) {
    return request({
        url: '/system/plan',
        method: 'post',
        data
    })
}
// 更新建设进度计划
export function updateJsjdjhList(data) {
    return request({
        url: '/system/plan',
        method: 'put',
        data
    })
}
// 删除建设进度计划
export function delJsjdjhList(ids) {
    return request({
        url: '/system/plan/' + ids,
        method: 'delete'
    })
}
// 获取检查列表
// 根据checkType区分，质量检查，安全检查
// 根据checkSource区分,监督检查,质量抽查
export function getCheckList(data) {
    return request({
        url: '/system/check/list',
        method: 'post',
        data
    })
}
// 第一次工地例会接口, 会议信息
// 根据meetingType区分
export function getMeetingsList(data) {
    return request({
        url: '/system/meeting/list',
        method: 'post',
        data
    })
}
// 实时进度
export function getScheduleList(data) {
    return request({
        url: '/system/schedule/list',
        method: 'post',
        data
    })
}

// 安全责任人-队伍管理数据录入
// 获取列表
export function getZrrList(data) {
    return request({
        url: '/system/zrr/list',
        method: 'post',
        data
    })
}
// 新增
export function addZrrList(data) {
    return request({
        url: '/system/zrr',
        method: 'post',
        data
    })
}
// 修改
export function updateZrrList(data) {
    return request({
        url: '/system/zrr',
        method: 'put',
        data
    })
}
// 新增
export function delZrrList(ids) {
    return request({
        url: '/system/zrr/' + ids,
        method: 'delete',
    })
}
