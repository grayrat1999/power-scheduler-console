// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 新增应用分组 POST /api/appGroups/add */
export async function addAppGroup(
  body: API.AppGroupAddRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperLong>(`/api/appGroups/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑应用分组 POST /api/appGroups/edit */
export async function editAppGroup(
  body: API.AppGroupEditRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperUnit>(`/api/appGroups/edit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询应用分组 POST /api/appGroups/list */
export async function listAppGroup(
  body: API.AppGroupQueryRequestDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWrapperPageDTOAppGroupQueryResponseDTO>(`/api/appGroups/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
