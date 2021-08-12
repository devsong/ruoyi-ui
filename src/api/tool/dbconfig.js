import request from "@/utils/request";

// 查询数据源配置列表
export function listDbconfig(query) {
  return request({
    url: "/tool/dbconfig/list",
    method: "get",
    params: query
  });
}

// 查询数据源配置详细
export function getDbconfig(id) {
  return request({
    url: "/tool/dbconfig/" + id,
    method: "get"
  });
}

// 新增数据源配置
export function addDbconfig(data) {
  return request({
    url: "/tool/dbconfig",
    method: "post",
    data: data
  });
}

// 修改数据源配置
export function updateDbconfig(data) {
  return request({
    url: "/tool/dbconfig",
    method: "put",
    data: data
  });
}

// 修改状态
export function changeStatus(data) {
  return request({
    url: "/tool/dbconfig/change_status",
    method: "post",
    data: data
  });
}

// 删除数据源配置
export function delDbconfig(id) {
  return request({
    url: "/tool/dbconfig/" + id,
    method: "delete"
  });
}

// 导出数据源配置
export function exportDbconfig(query) {
  return request({
    url: "/tool/dbconfig/export",
    method: "get",
    params: query
  });
}
