import request from '@/utils/request';

// 查询系统接口日志列表
export function listLog(query) {
  return request({
    url: '/system/log/list',
    method: 'post',
    data: JSON.stringify(query)
  });
}

// 获取meta分组信息
export function getMetaLog(query) {
  return request({
    url: '/system/log/metaInfo',
    method: 'get',
    params: query
  });
}

// 获取meta分组信息
export function getMetaLogCount(query) {
  return request({
    url: "/system/log/listMetaCount",
    method: "post",
    data: query
  });
}

