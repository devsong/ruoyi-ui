import request from '@/utils/request'

// 查询支付请求列表
export function listPayment(query) {
  return request({
    url: '/payment/payment/list',
    method: 'get',
    params: query
  })
}

// 查询支付请求详细
export function getPayment(serial) {
  return request({
    url: '/payment/payment/' + serial,
    method: 'get'
  })
}

// 新增支付请求
export function addPayment(data) {
  return request({
    url: '/payment/payment',
    method: 'post',
    data: data
  })
}

// 修改支付请求
export function updatePayment(data) {
  return request({
    url: '/payment/payment',
    method: 'put',
    data: data
  })
}

// 修改状态
export function changeStatus(data) {
  return request({
    url: '/payment/payment/change_status',
    method: 'post',
    data: data
  })
}

// 删除支付请求
export function delPayment(serial) {
  return request({
    url: '/payment/payment/' + serial,
    method: 'delete'
  })
}

// 导出支付请求
export function exportPayment(query) {
  return request({
    url: '/payment/payment/export',
    method: 'get',
    params: query
  })
}