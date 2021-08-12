import request from '@/utils/request';

// 列表
export function list(query) {
  return request({
    url: "/system/serial/list",
    method: "get",
    params: query
  });
}

// 获取状态列表
export function getStatus() {
  return request({
    url: "/system/serial/get_status",
    method: "get"
  });
}

export function getBizKey(bizKey) {
  return request({
    url: "/system/serial/get",
    method: "get",
    params: { bizKey: bizKey }
  });
}

// 新增
export function addSegment(form) {
  return request({
    url: "/system/serial/add",
    method: "post",
    params: form
  });
}

// 修改
export function updateSegment(form) {
  return request({
    url: '/system/serial/update',
    method: 'post',
    params: form
  });
}

// 导出操作日志
export function exportBizKey(query) {
  return request({
    url: "/system/serial/export",
    method: "get",
    params: query
  });
}

// 修改状态
export function changeSegmentStatus(key, status) {
  return request({
    url: "/system/serial/update_status",
    method: "post",
    params: {
      key: key,
      status: status
    }
  });
}

// 解码
export function decode(query) {
  return request({
    url: '/api/serial/snowflake/decode',
    method: 'get',
    params: query
  });
}

// 获取序列号值
export function getSegmentKey(key) {
  return request({
    url: '/api/serial/segment',
    method: 'get',
    params: { 'key': key }
  });
}

// 获取序列号值
export function getSnowflake(key) {
  return request({
    url: '/api/serial/snowflake',
    method: 'get',
    params: {
      key: 'snowflake'
    }
  });
}

export function base62encode(id) {
  return request({
    url: '/api/serial/base62/encode',
    method: 'get',
    params: {
      id: id
    }
  });
}

export function base62decode(id) {
  return request({
    url: '/api/serial/base62/decode',
    method: 'get',
    params: {
      id: id
    }
  });
}

export function base32decode(id) {
  return request({
    url: "/api/serial/base32/encode",
    method: "get",
    params: {
      id: id
    }
  });
}

export function base32encode(id) {
  return request({
    url: '/api/serial/base32/decode',
    method: 'get',
    params: {
      id: id
    }
  });
}
