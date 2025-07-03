// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 查询工作流实例详情 GET /api/WorkflowInstances/detail */
export async function getWorkflowInstance(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getWorkflowInstanceParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseWrapperWorkflowInstanceDetailResponseDTO>(
    `/api/WorkflowInstances/detail`,
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

/** 查询工作流实例列表 GET /api/WorkflowInstances/list */
export async function listWorkflowInstance(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listWorkflowInstanceParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseWrapperPageDTOWorkflowInstanceQueryResponseDTO>(
    `/api/WorkflowInstances/list`,
    {
      method: 'GET',
      params: {
        ...params,
        param: undefined,
        ...params['param']
      },
      ...(options || {})
    }
  )
}
