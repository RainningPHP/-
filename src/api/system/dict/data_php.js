import request from '@/utils/requestPhp'

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/php/admin/sysDictData/getDict',
    method: 'get',
    params: {
      type: dictType
    }
  })
}
