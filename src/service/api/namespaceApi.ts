// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 新增命名空间空间 POST /api/namespace/add */
export async function addNamespace(
  body: API.NamespaceAddRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperLong>(`/api/namespace/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑命名空间 POST /api/namespace/edit */
export async function editNamespace(
  body: API.NamespaceEditRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperUnit>(`/api/namespace/edit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询命名空间列表 GET /api/namespace/list */
export async function listNamespace(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listNamespaceParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperPageDTONamespaceQueryResponseDTO>(`/api/namespace/list`, {
    method: 'GET',
    params: {
      ...params,
      param: undefined,
      ...params['param'],
    },
    ...(options || {}),
  });
}
