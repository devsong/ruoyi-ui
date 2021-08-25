import request from '@/utils/request'

// 查询支付请求列表
export function listPayment(query) {
  return request({
    url: "/system/payment/list",
    method: "get",
    params: query
  });
}

// 查询支付请求详细
export function getPayment(serial) {
  return request({
    url: "/system/payment/" + serial,
    method: "get"
  });
}
