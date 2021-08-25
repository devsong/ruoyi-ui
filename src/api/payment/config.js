import request from '@/utils/request'

// 查询支付配置列表
export function listConfig(query) {
  return request({
    url: '/payment/config/list',
    method: 'get',
    params: query
  })
}

// 查询支付配置详细
export function getConfig(id) {
  return request({
    url: '/payment/config/' + id,
    method: 'get'
  })
}

// 新增支付配置
export function addConfig(data) {
  return request({
    url: '/payment/config',
    method: 'post',
    data: data
  })
}

// 修改支付配置
export function updateConfig(data) {
  return request({
    url: '/payment/config',
    method: 'put',
    data: data
  })
}

// 修改状态
export function changeStatus(data) {
  return request({
    url: '/payment/config/change_status',
    method: 'post',
    data: data
  })
}

// 删除支付配置
export function delConfig(id) {
  return request({
    url: '/payment/config/' + id,
    method: 'delete'
  })
}

// 导出支付配置
export function exportConfig(query) {
  return request({
    url: '/payment/config/export',
    method: 'get',
    params: query
  })
}