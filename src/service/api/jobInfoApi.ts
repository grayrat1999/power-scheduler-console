// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 新增任务 POST /api/jobInfos/add */
export async function addJobInfo(body: API.JobInfoAddRequestDTO, options?: { [key: string]: any }) {
  return request<API.ResponseWrapperLong>(`/api/jobInfos/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询任务详情 GET /api/jobInfos/detail */
export async function getJobInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getJobInfoParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperJobInfoDetailResponseDTO>(`/api/jobInfos/detail`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 编辑任务 POST /api/jobInfos/edit */
export async function editJobInfo(
  body: API.JobInfoEditRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperUnit>(`/api/jobInfos/edit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询任务列表 POST /api/jobInfos/list */
export async function listJobInfo(
  body: API.JobInfoQueryRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperPageDTOJobInfoQueryResponseDTO>(`/api/jobInfos/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询下次执行时间 GET /api/jobInfos/listNextScheduleTime */
export async function listNextScheduleTime(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listNextScheduleTimeParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperListString>(`/api/jobInfos/listNextScheduleTime`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除任务 POST /api/jobInfos/remove */
export async function removeJobInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeJobInfoParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperUnit>(`/api/jobInfos/remove`, {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 运行任务 POST /api/jobInfos/run */
export async function run(body: API.JobRunRequestDTO, options?: { [key: string]: any }) {
  return request<API.ResponseWrapperLong>(`/api/jobInfos/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改任务启用状态 POST /api/jobInfos/switch */
export async function switchEnable(
  body: API.JobInfoSwitchRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperUnit>(`/api/jobInfos/switch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
