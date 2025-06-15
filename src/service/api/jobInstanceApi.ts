// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 查询任务实例详情 GET /api/jobInstances/detail */
export async function getJobInstanceDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getJobInstanceDetailParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperJobInstanceDetailResponseDTO>(`/api/jobInstances/detail`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询任务错误信息 GET /api/jobInstances/getErrorMessage */
export async function getErrorMessage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getErrorMessageParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperString>(`/api/jobInstances/getErrorMessage`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询任务实例列表 POST /api/jobInstances/list */
export async function listJobInstance(
  body: API.JobInstanceQueryRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperPageDTOJobInstanceQueryResponseDTO>(`/api/jobInstances/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询任务进度 POST /api/jobInstances/queryProgress */
export async function queryProgress(
  body: API.JobProgressQueryRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperPageDTOJobProgressQueryResponseDTO>(
    `/api/jobInstances/queryProgress`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 重跑任务 POST /api/jobInstances/reattempt */
export async function reattempt(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.reattemptParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperLong>(`/api/jobInstances/reattempt`, {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 终止任务 POST /api/jobInstances/terminate */
export async function terminate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.terminateParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperUnit>(`/api/jobInstances/terminate`, {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
