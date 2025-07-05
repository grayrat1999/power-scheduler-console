// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 新增工作流 POST /api/workflows/add */
export async function addWorkflow(
  body: API.WorkflowAddRequestDTO,
  options?: { [key: string]: any }
) {
  return request<API.ResponseWrapperLong>(`/api/workflows/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除工作流 POST /api/workflows/delete */
export async function deleteWorkflow(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteWorkflowParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseWrapperUnit>(`/api/workflows/delete`, {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 查询工作流详情 GET /api/workflows/detail */
export async function getWorkflow(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getWorkflowParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseWrapperWorkflowDetailResponseDTO>(`/api/workflows/detail`, {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 编辑工作流 POST /api/workflows/edit */
export async function editWorkflow(
  body: API.WorkflowEditRequestDTO,
  options?: { [key: string]: any }
) {
  return request<API.ResponseWrapperUnit>(`/api/workflows/edit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 查询工作流列表 GET /api/workflows/list */
export async function listWorkflow(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listWorkflowParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseWrapperPageDTOWorkflowQueryResponseDTO>(`/api/workflows/list`, {
    method: 'GET',
    params: {
      ...params,
      param: undefined,
      ...params['param']
    },
    ...(options || {})
  })
}

/** 运行工作流 POST /api/workflows/run */
export async function runWorkflow(
  body: API.WorkflowRunRequestDTO,
  options?: { [key: string]: any }
) {
  return request<API.ResponseWrapperLong>(`/api/workflows/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 修改工作流启用状态 POST /api/workflows/switch */
export async function switchWorkflowEnable(
  body: API.WorkflowSwitchRequestDTO,
  options?: { [key: string]: any }
) {
  return request<API.ResponseWrapperUnit>(`/api/workflows/switch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
