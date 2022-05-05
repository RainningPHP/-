import request from '@/utils/requestPhp'

export function kypfAdd(data) {
  return request({
    url: '/php/admin/file/kypfAdd',
    method: 'post',
    data
  })
}
export function xmhzAdd(data) {
  return request({
    url: '/php/admin/file/xmhzAdd',
    method: 'post',
    data
  })
}

// 新增项目
export function addProject(data) {
  return request({
    url: '/php/admin/Project/save',
    method: 'post',
    data
  })
}
// 更新项目
export function updateProject(data) {
  return request({
    url: '/php/admin/Project/save',
    method: 'put',
    data
  })
}

// 获取项目信息
export function getProjectInfo(params) {
  return request({
    url: '/php/admin/Project/getInfo',
    method: 'get',
    params: {
      id: params
    }
  })
}

// 责任人列表
export function listZrr(data) {
  return request({
    url: '/php/admin/ProjectZrr/list',
    method: 'post',
    data
  })
}
// 责任人修改
export function updateZrr(data) {
  return request({
    url: '/php/app/ProjectZrr/personLiableEdit',
    method: 'post',
    data
  })
}
// 责任人删除
export function delZrr(data) {
  return request({
    url: '/php/app/ProjectZrr/personLiableDel',
    method: 'post',
    data
  })
}
// banner list
export function bannerList(params) {
  return request({
    url: '/php/app/project/bannerList',
    method: 'get',
    params: {
      project_id: params
    }
  })
}
// banner添加
export function addBanner(data) {
  return request({
    url: '/php/admin/project/bannerAdd',
    method: 'post',
    data
  })
}

// 行政许可手续列表
export function getXzxkList(data) {
  return request({
    url: '/php/app/PreliminaryDocuments/list',
    method: 'post',
    data
  })
}
// 行政许可手续添加
export function addXzxk(data) {
  return request({
    url: '/php/app/PreliminaryDocuments/save',
    method: 'post',
    data
  })
}

// 行政许可手续添加
export function getXzxkName(data) {
  return request({
    url: '/php/app/PreliminaryDocuments/nameList',
    method: 'post',
    data
  })
}


