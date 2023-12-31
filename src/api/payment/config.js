import request from "@/utils/request";

// 查询支付配置列表
export function listConfig(query) {
  return request({
    url: "/system/payment_config/list",
    method: "get",
    params: query
  });
}

// 查询支付配置详细
export function getConfig(id) {
  return request({
    url: "/system/payment_config/" + id,
    method: "get"
  });
}

// 新增支付配置
export function addConfig(data) {
  return request({
    url: "/system/payment_config/",
    method: "post",
    data: convert2FormData(data)
  });
}

// 修改支付配置
export function updateConfig(data) {
  return request({
    url: "/system/payment_config/",
    method: "put",
    data: convert2FormData(data)
  });
}

// 修改状态
export function changeStatus(params) {
  return request({
    url: "/system/payment_config/change_status",
    method: "post",
    params: params
  });
}

// 删除支付配置
export function delConfig(id) {
  return request({
    url: "/system/payment_config/" + id,
    method: "delete"
  });
}

export function convert2FormData(data) {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    let val = data[key];
    if (val == undefined || val == "undefined" || val == "") {
    } else {
      formData.append(key, data[key]);
    }
  });
  return formData;
}
