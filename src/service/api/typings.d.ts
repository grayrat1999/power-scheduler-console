declare namespace API {
  type AppGroupAddRequestDTO = {
    namespaceCode?: string
    code?: string
    name?: string
  }

  type AppGroupEditRequestDTO = {
    id: number
    name?: string
  }

  type AppGroupQueryRequestDTO = {
    pageNo: number
    pageSize: number
    namespaceCode?: string
    code?: string
    name?: string
  }

  type AppGroupQueryResponseDTO = {
    id?: number
    namespaceCode?: string
    code?: string
    name?: string
    secret?: string
    createdBy?: string
    createdAt?: string
  }

  type CronParseRequestDTO = {
    cronExpression?: string
    times: number
  }

  type DashboardBasicInfoQueryRequestDTO = {
    namespaceCode?: string
    appCode?: string
  }

  type DashboardBasicInfoQueryResponseDTO = {
    onlineWorkerCount: number
    enabledJobInfoCount: number
    disabledJobInfoCount: number
    jobInfoCount: number
  }

  type DashboardStatisticsInfoQueryRequestDTO = {
    namespaceCode?: string
    appCode?: string
    scheduleAtRange: string[]
  }

  type DashboardStatisticsInfoQueryResponseDTO = {
    jobInstanceCount: number
    succeedJobInstanceCount: number
    failedJobInstanceCount: number
  }

  type deleteWorkflowParams = {
    workflowId: number
  }

  type ExecuteModeDTO = {
    code?: string
    label?: string
  }

  type getErrorMessageParams = {
    jobInstanceId: number
  }

  type getJobInfoParams = {
    jobId: number
  }

  type getJobInstanceDetailParams = {
    jobInstanceId: number
  }

  type getWorkflowInstanceParams = {
    workflowInstanceId: number
  }

  type getWorkflowParams = {
    workflowId: number
  }

  type JobInfoAddRequestDTO = {
    namespaceCode?: string
    appCode?: string
    jobName?: string
    jobDesc?: string
    scheduleType: 'CRON' | 'FIX_RATE' | 'FIX_DELAY' | 'ONE_TIME'
    scheduleConfig?: string
    jobType: 'JAVA' | 'SCRIPT'
    processor?: string
    executeMode: 'SINGLE' | 'BROADCAST' | 'MAP' | 'MAP_REDUCE'
    executeParams?: string
    maxConcurrentNum: number
    scriptType?: 'BASH' | 'CMD' | 'PYTHON' | 'POWER_SHELL'
    scriptCode?: string
    priority: number
    maxAttemptCnt: number
    attemptInterval: number
    taskMaxAttemptCnt?: number
    taskAttemptInterval?: number
    retentionPolicy: 'RECENT_DAYS' | 'RECENT_COUNT'
    retentionValue: number
  }

  type JobInfoDetailResponseDTO = {
    id?: number
    appCode?: string
    jobName?: string
    jobDesc?: string
    jobType?: JobTypeDTO
    scheduleType?: ScheduleTypeDTO
    scheduleConfig?: string
    processor?: string
    executeMode?: ExecuteModeDTO
    executeParams?: string
    nextScheduleAt?: string
    enabled?: boolean
    maxConcurrentNum?: number
    scriptType?: ScriptTypeDTO
    scriptCode?: string
    maxAttemptCnt?: number
    attemptInterval?: number
    taskMaxAttemptCnt?: number
    taskAttemptInterval?: number
    priority?: number
    retentionPolicy?: RetentionPolicyDTO
    retentionValue?: number
    createdBy?: string
    createdAt?: string
    updatedBy?: string
    updatedAt?: string
  }

  type JobInfoEditRequestDTO = {
    jobId: number
    jobName?: string
    jobDesc?: string
    scheduleType: 'CRON' | 'FIX_RATE' | 'FIX_DELAY' | 'ONE_TIME'
    scheduleConfig?: string
    jobType: 'JAVA' | 'SCRIPT'
    processor?: string
    executeMode: 'SINGLE' | 'BROADCAST' | 'MAP' | 'MAP_REDUCE'
    executeParams?: string
    maxConcurrentNum: number
    scriptType?: 'BASH' | 'CMD' | 'PYTHON' | 'POWER_SHELL'
    scriptCode?: string
    priority: number
    maxAttemptCnt: number
    attemptInterval?: number
    taskMaxAttemptCnt?: number
    taskAttemptInterval?: number
    retentionPolicy: 'RECENT_DAYS' | 'RECENT_COUNT'
    retentionValue: number
  }

  type JobInfoQueryRequestDTO = {
    pageNo: number
    pageSize: number
    namespaceCode?: string
    appCode?: string
    jobName?: string
    processor?: string
  }

  type JobInfoQueryResponseDTO = {
    id?: number
    namespaceCode?: string
    appCode?: string
    appName?: string
    jobName?: string
    jobDesc?: string
    jobType?: JobTypeDTO
    scheduleType?: ScheduleTypeDTO
    scheduleConfig?: string
    scheduleConfigDesc?: string
    processor?: string
    executeMode?: ExecuteModeDTO
    nextScheduleAt?: string
    enabled?: boolean
    scriptType?: ScriptTypeDTO
    createdBy?: string
    createdAt?: string
    updatedBy?: string
    updatedAt?: string
  }

  type JobInstanceDetailResponseDTO = {
    id?: number
    jobId?: number
    appCode?: string
    appName?: string
    schedulerAddress?: string
    workerAddress?: string
    jobName?: string
    jobType?: JobTypeDTO
    processor?: string
    jobStatus?: JobStatusDTO
    scheduleAt?: string
    startAt?: string
    endAt?: string
    executeParams?: string
    executeMode?: ExecuteModeDTO
    scheduleType?: ScheduleTypeDTO
    message?: string
    dataTime?: string
    scriptType?: ScriptTypeDTO
    scriptCode?: string
    attemptCnt?: number
    priority?: number
  }

  type JobInstanceQueryRequestDTO = {
    pageNo: number
    pageSize: number
    namespaceCode?: string
    jobId?: number
    jobInstanceId?: number
    appCode?: string
    jobName?: string
    jobStatus?:
      | 'WAITING_SCHEDULE'
      | 'WAITING_DISPATCH'
      | 'DISPATCHING'
      | 'PENDING'
      | 'PROCESSING'
      | 'FAILED'
      | 'SUCCESS'
      | 'CANCELED'
      | 'UNKNOWN'
    startAtRange?: string[]
    endAtRange?: string[]
  }

  type JobInstanceQueryResponseDTO = {
    id?: number
    jobId?: number
    appCode?: string
    appName?: string
    workerAddress?: string
    jobName?: string
    jobType?: JobTypeDTO
    processor?: string
    jobStatus?: JobStatusDTO
    scheduleAt?: string
    startAt?: string
    endAt?: string
    executeParams?: string
    executeMode?: ExecuteModeDTO
    scheduleType?: ScheduleTypeDTO
    message?: string
    dataTime?: string
    scriptType?: ScriptTypeDTO
    scriptCode?: string
    attemptCnt?: number
    priority?: number
    createdBy?: string
    createdAt?: string
    updatedBy?: string
    updatedAt?: string
  }

  type JobProgressQueryRequestDTO = {
    pageNo: number
    pageSize: number
    jobInstanceId: number
  }

  type JobProgressQueryResponseDTO = {
    taskId?: number
    taskName?: string
    jobInstanceId?: number
    taskStatus?: JobStatusDTO
    workerAddress?: string
    startAt?: string
    endAt?: string
  }

  type JobRunRequestDTO = {
    jobId: number
    workerAddress?: string
    executeParams?: string
    dataTime?: string
  }

  type JobStatusDTO = {
    code?: string
    label?: string
  }

  type JobSwitchRequestDTO = {
    jobId: number
    enabled: boolean
  }

  type JobTypeDTO = {
    code?: string
    label?: string
  }

  type listMetadataParams = {
    metadataCodes: string[]
  }

  type listNamespaceParams = {
    param: NamespaceQueryRequestDTO
  }

  type listWorkerParams = {
    param?: WorkerQueryRequestDTO
  }

  type listWorkflowInstanceParams = {
    param?: WorkflowInstanceQueryRequestDTO
  }

  type listWorkflowParams = {
    param?: WorkflowQueryRequestDTO
  }

  type MetadataDTO = {
    code?: string
    label?: string
  }

  type NamespaceAddRequestDTO = {
    code?: string
    name?: string
    description?: string
  }

  type NamespaceEditRequestDTO = {
    id: number
    name?: string
    description?: string
  }

  type NamespaceQueryRequestDTO = {
    pageNo: number
    pageSize: number
    name?: string
  }

  type NamespaceQueryResponseDTO = {
    id?: number
    code?: string
    name?: string
    description?: string
    createdBy?: string
    createdAt?: string
  }

  type PageDTOAppGroupQueryResponseDTO = {
    number: number
    size: number
    totalPages: number
    totalElements: number
    content: AppGroupQueryResponseDTO[]
  }

  type PageDTOJobInfoQueryResponseDTO = {
    number: number
    size: number
    totalPages: number
    totalElements: number
    content: JobInfoQueryResponseDTO[]
  }

  type PageDTOJobInstanceQueryResponseDTO = {
    number: number
    size: number
    totalPages: number
    totalElements: number
    content: JobInstanceQueryResponseDTO[]
  }

  type PageDTOJobProgressQueryResponseDTO = {
    number: number
    size: number
    totalPages: number
    totalElements: number
    content: JobProgressQueryResponseDTO[]
  }

  type PageDTONamespaceQueryResponseDTO = {
    number: number
    size: number
    totalPages: number
    totalElements: number
    content: NamespaceQueryResponseDTO[]
  }

  type PageDTOWorkflowInstanceQueryResponseDTO = {
    number: number
    size: number
    totalPages: number
    totalElements: number
    content: WorkflowInstanceQueryResponseDTO[]
  }

  type PageDTOWorkflowQueryResponseDTO = {
    number: number
    size: number
    totalPages: number
    totalElements: number
    content: WorkflowQueryResponseDTO[]
  }

  type parseCronParams = {
    param?: CronParseRequestDTO
  }

  type queryBasicInfoParams = {
    param?: DashboardBasicInfoQueryRequestDTO
  }

  type reattemptParams = {
    jobInstanceId: number
  }

  type removeJobInfoParams = {
    jobId: number
  }

  type ResponseWrapperDashboardBasicInfoQueryResponseDTO = {
    data?: DashboardBasicInfoQueryResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperDashboardStatisticsInfoQueryResponseDTO = {
    data?: DashboardStatisticsInfoQueryResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperJobInfoDetailResponseDTO = {
    data?: JobInfoDetailResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperJobInstanceDetailResponseDTO = {
    data?: JobInstanceDetailResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperListLocalDateTime = {
    data?: string[]
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperListMetadataDTO = {
    data?: MetadataDTO[]
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperListWorkerQueryResponseDTO = {
    data?: WorkerQueryResponseDTO[]
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperLong = {
    data?: number
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperPageDTOAppGroupQueryResponseDTO = {
    data?: PageDTOAppGroupQueryResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperPageDTOJobInfoQueryResponseDTO = {
    data?: PageDTOJobInfoQueryResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperPageDTOJobInstanceQueryResponseDTO = {
    data?: PageDTOJobInstanceQueryResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperPageDTOJobProgressQueryResponseDTO = {
    data?: PageDTOJobProgressQueryResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperPageDTONamespaceQueryResponseDTO = {
    data?: PageDTONamespaceQueryResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperPageDTOWorkflowInstanceQueryResponseDTO = {
    data?: PageDTOWorkflowInstanceQueryResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperPageDTOWorkflowQueryResponseDTO = {
    data?: PageDTOWorkflowQueryResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperString = {
    data?: string
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperUnit = {
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperWorkflowDetailResponseDTO = {
    data?: WorkflowDetailResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type ResponseWrapperWorkflowInstanceDetailResponseDTO = {
    data?: WorkflowInstanceDetailResponseDTO
    success: boolean
    code: string
    message: string
    cause?: {
      stackTrace?: {
        classLoaderName?: string
        moduleName?: string
        moduleVersion?: string
        methodName?: string
        fileName?: string
        lineNumber?: number
        className?: string
        nativeMethod?: boolean
      }[]
      message?: string
      localizedMessage?: string
    }
  }

  type RetentionPolicyDTO = {
    code?: string
    label?: string
  }

  type ScheduleTypeDTO = {
    code?: string
    label?: string
  }

  type ScriptTypeDTO = {
    code?: string
    label?: string
  }

  type terminateParams = {
    jobInstanceId: number
  }

  type WorkerQueryRequestDTO = {
    namespaceCode?: string
    appCode?: string
  }

  type WorkerQueryResponseDTO = {
    namespaceCode?: string
    appCode?: string
    host?: string
    port?: number
    lastHeartbeatAt?: string
    address: string
  }

  type WorkflowAddRequestDTO = {
    nodes: WorkflowNodeDTO[]
    namespaceCode?: string
    appCode?: string
    name?: string
    description?: string
    scheduleType: 'CRON' | 'FIX_RATE' | 'FIX_DELAY' | 'ONE_TIME'
    scheduleConfig?: string
    maxConcurrentNum: number
    retentionPolicy: 'RECENT_DAYS' | 'RECENT_COUNT'
    retentionValue: number
    graphData?: string
  }

  type WorkflowDetailResponseDTO = {
    appCode?: string
    id?: number
    name?: string
    description?: string
    enabled?: boolean
    maxConcurrentNum?: number
    retentionPolicy?: 'RECENT_DAYS' | 'RECENT_COUNT'
    retentionValue?: number
    graphData?: string
    scheduleType?: 'CRON' | 'FIX_RATE' | 'FIX_DELAY' | 'ONE_TIME'
    scheduleConfig?: string
  }

  type WorkflowEditRequestDTO = {
    nodes: WorkflowNodeDTO[]
    workflowId: number
    name?: string
    description?: string
    scheduleType: 'CRON' | 'FIX_RATE' | 'FIX_DELAY' | 'ONE_TIME'
    scheduleConfig?: string
    maxConcurrentNum: number
    retentionPolicy: 'RECENT_DAYS' | 'RECENT_COUNT'
    retentionValue: number
    graphData?: string
  }

  type WorkflowInstanceDetailResponseDTO = {
    appCode?: string
    appName?: string
    id?: number
    workflowId?: number
    code?: string
    name?: string
    status?: 'WAITING' | 'RUNNING' | 'SUCCEED' | 'FAILED' | 'CANCELED'
    startAt?: string
    endAt?: string
    dataTime?: string
    graphData?: string
  }

  type WorkflowInstanceQueryRequestDTO = {
    pageNo: number
    pageSize: number
    namespaceCode?: string
    appCode?: string
    workflowId?: number
    workflowInstanceId?: number
    status?: 'WAITING' | 'RUNNING' | 'SUCCEED' | 'FAILED' | 'CANCELED'
    startAtRange?: string[]
    endAtRange?: string[]
  }

  type WorkflowInstanceQueryResponseDTO = {
    appCode?: string
    appName?: string
    id?: number
    workflowId?: number
    name?: string
    code?: string
    status?: WorkflowStatusDTO
    dataTime?: string
    startAt?: string
    endAt?: string
  }

  type WorkflowNodeDTO = {
    workflowNodeCode?: string
    workflowNodeChildCodes: string[]
    name?: string
    description?: string
    jobType: 'JAVA' | 'SCRIPT'
    processor?: string
    executeMode: 'SINGLE' | 'BROADCAST' | 'MAP' | 'MAP_REDUCE'
    executeParams?: string
    scriptType?: 'BASH' | 'CMD' | 'PYTHON' | 'POWER_SHELL'
    scriptCode?: string
    maxAttemptCnt: number
    attemptInterval: number
    taskMaxAttemptCnt: number
    taskAttemptInterval: number
    priority: number
  }

  type WorkflowQueryRequestDTO = {
    pageNo: number
    pageSize: number
    namespaceCode?: string
    appCode?: string
    name?: string
  }

  type WorkflowQueryResponseDTO = {
    namespaceCode?: string
    appCode?: string
    appName?: string
    id?: number
    name?: string
    enabled?: boolean
    scheduleType?: ScheduleTypeDTO
    scheduleConfig?: string
    scheduleConfigDesc?: string
  }

  type WorkflowRunRequestDTO = {
    workflowId: number
    workerAddress?: string
    dataTime?: string
  }

  type WorkflowStatusDTO = {
    code?: string
    label?: string
  }

  type WorkflowSwitchRequestDTO = {
    workflowId: number
    enabled: boolean
  }
}
