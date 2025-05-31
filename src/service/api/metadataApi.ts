// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 查询元数据 GET /api/metadata/${param0} */
export async function listMetadata(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listMetadataParams,
  options?: { [key: string]: any },
) {
  const { metadataCodes: param0, ...queryParams } = params;
  return request<API.ResponseWrapperListMetadataDTO>(`/api/metadata/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
