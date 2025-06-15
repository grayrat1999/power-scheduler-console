import { computed, type ComputedRef } from 'vue'
import { usePagination, type PaginationQueryResult } from 'vue-request'

interface AntdPaginationQueryResult<T> extends PaginationQueryResult<T, any> {
  pagination: ComputedRef<any>
  handleTableChange: (page: any, filters: any, sorter: any) => void
}

export default function requestForPage<T>(
  requestFunction: (param: any) => Promise<T>,
  options: any
): AntdPaginationQueryResult<T> {
  const defaultOptions = {
    manual: true,
    pagination: {
      currentKey: 'pageNo',
      pageSizeKey: 'pageSize',
      totalKey: 'totalElements',
      totalPageKey: 'totalPages'
    }
  }

  const result: PaginationQueryResult<T, any> = usePagination(requestFunction, {
    ...options,
    ...defaultOptions
  })

  const { total, current, pageSize, run } = result
  const pagination = computed(() => ({
    total: total.value,
    current: current.value,
    pageSize: pageSize.value
  }))

  const handleTableChange = (page: any, filters: any, sorter: any) => {
    run({
      pageNo: page?.current,
      pageSize: page.pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    })
  }

  return { ...result, pagination, handleTableChange }
}
