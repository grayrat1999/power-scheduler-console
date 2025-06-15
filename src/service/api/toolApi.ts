// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 解析CRON表达式 GET /api/tool/parseCron */
export async function parseCron(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.parseCronParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperListLocalDateTime>(`/api/tool/parseCron`, {
    method: 'GET',
    params: {
      ...params,
      param: undefined,
      ...params['param'],
    },
    ...(options || {}),
  });
}
