import request from '@/utils/requestPhp'
export function getLiberaryList(data) {
  return request({
    url: '/php/app/project_meetting/list',
    method: 'post',
    data
  })
}
// 根据项目图纸列表
export function getLiberaryDrawingsList(data) {
  return request({
    url: '/php/app/ConstructionDrawings/list',
    method: 'get',
    data
  })
}
// 根据图纸ID获取图纸文件列表
export function getLiberaryDrawingsFileList(data) {
  return request({
    url: '/php/app/ConstructionDrawingsFile/list',
    method: 'post',
    data
  })
}
// 根据项目获取会议
export function getLiberaryListmeetingList(data) {
  return request({
    url: '/php/app/ProjectMeetting/meetingList',
    method: 'post',
    data
  })
}
// 根据项目添加会议
export function getLiberaryListadd(data) {
  return request({
    url: '/php/app/project_meetting/add',
    method: 'post',
    data
  })
}
// 根据ID获取会议
export function getLiberaryListdetails(data) {
  return request({
    url: '/php/app/project_meetting/details',
    method: 'post',
    data
  })
}
// 新增经验分享
export function addLiberaryList(data) {
  return request({
    url: '/php/admin/ProjectLiberary/add',
    method: 'post',
    data
  })
}

// 更新经验分享
export function updateLiberaryList(data) {
  return request({
    url: '/php/app/ProjectMeetting/edit',
    method: 'put',
    data
  })
}

// 删除经验分享
export function delLiberaryList(ids) {
  return request({
    url: '/php/admin/ProjectLiberary/delete',
    method: 'delete',
    data: {
      ids: ids.join(',')
    }
  })
}


