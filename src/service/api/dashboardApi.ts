// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 查询基本信息 GET /api/dashboard/basicInfo */
export async function queryBasicInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryBasicInfoParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperDashboardBasicInfoQueryResponseDTO>(
    `/api/dashboard/basicInfo`,
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 查询统计信息 POST /api/dashboard/statisticsInfo */
export async function queryStatisticsInfo(
  body: API.DashboardStatisticsInfoQueryRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperDashboardStatisticsInfoQueryResponseDTO>(
    `/api/dashboard/statisticsInfo`,
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
