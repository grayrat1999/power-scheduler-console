// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 此处后端没有提供注释 GET /api/worker/list */
export async function listWorker(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listWorkerParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperListWorkerQueryResponseDTO>(`/api/worker/list`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
