import request from '@/utils/requestPhp'



export function getProjectList(data) {
  return request({
    url: '/php/app/project/projects',
    method: 'post',
    data
  })
}

export function getList(data) {
  return request({
    url: '/php/admin/Project_week_report/list',
    method: 'post',
    data
  })
}

export function addList(data) {
  return request({
    url: '/php/admin/ProjectRisk/add',
    method: 'post',
    data
  })
}

export function updateList(data) {
  return request({
    url: '/php/admin/ProjectRisk/update',
    method: 'post',
    data
  })
}

export function delList(ids) {
  return request({
    url: '/php/admin/ProjectRisk/delete',
    method: 'delete',
    data: {
      ids: ids.join(',')
    }
  })
}