declare namespace API {
  type AppGroupAddRequestDTO = {
    code?: string;
    name?: string;
  };

  type AppGroupQueryRequestDTO = {
    pageNo: number;
    pageSize: number;
    code?: string;
    name?: string;
  };

  type AppGroupQueryResponseDTO = {
    code?: string;
    name?: string;
    secret?: string;
    createdBy?: string;
    createdAt?: string;
  };

  type CronParseRequestDTO = {
    cronExpression?: string;
    times: number;
  };

  type DashboardBasicInfoQueryResponseDTO = {
    onlineWorkerCount: number;
    enabledJobInfoCount: number;
    disabledJobInfoCount: number;
    jobInfoCount: number;
  };

  type DashboardStatisticsInfoQueryRequestDTO = {
    appCode?: string;
    scheduleAtRange?: string[];
  };

  type DashboardStatisticsInfoQueryResponseDTO = {
    jobInstanceCount: number;
    succeedJobInstanceCount: number;
    failedJobInstanceCount: number;
  };

  type ExecuteModeDTO = {
    code?: string;
    label?: string;
  };

  type getErrorMessageParams = {
    jobInstanceId: number;
  };

  type getJobInfoParams = {
    jobId: number;
  };

  type getJobInstanceDetailParams = {
    jobInstanceId: number;
  };

  type JobInfoAddRequestDTO = {
    appCode?: string;
    jobName?: string;
    jobDesc?: string;
    scheduleType: 'CRON' | 'FIX_RATE' | 'FIX_DELAY' | 'ONE_TIME';
    scheduleConfig?: string;
    jobType: 'JAVA' | 'SCRIPT';
    processor?: string;
    executeMode: 'SINGLE' | 'BROADCAST' | 'MAP_REDUCE';
    executeParams?: string;
    maxConcurrentNum: number;
    scriptType?: 'BASH' | 'CMD' | 'PYTHON' | 'POWER_SHELL';
    scriptCode?: string;
    maxAttemptCnt: number;
    priority: number;
    attemptInterval: number;
    retentionPolicy: 'RECENT_DAYS' | 'RECENT_COUNT';
    retentionValue: number;
  };

  type JobInfoDetailResponseDTO = {
    id?: number;
    appCode?: string;
    jobName?: string;
    jobDesc?: string;
    jobType?: JobTypeDTO;
    scheduleType?: ScheduleTypeDTO;
    scheduleConfig?: string;
    processor?: string;
    executeMode?: ExecuteModeDTO;
    executeParams?: string;
    nextScheduleAt?: string;
    enabled?: boolean;
    maxConcurrentNum?: number;
    scriptType?: ScriptTypeDTO;
    scriptCode?: string;
    maxAttemptCnt?: number;
    attemptInterval?: number;
    priority?: number;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
  };

  type JobInfoEditRequestDTO = {
    jobId: number;
    jobName?: string;
    jobDesc?: string;
    scheduleType: 'CRON' | 'FIX_RATE' | 'FIX_DELAY' | 'ONE_TIME';
    scheduleConfig?: string;
    jobType: 'JAVA' | 'SCRIPT';
    processor?: string;
    executeMode: 'SINGLE' | 'BROADCAST' | 'MAP_REDUCE';
    executeParams?: string;
    maxConcurrentNum: number;
    scriptType?: 'BASH' | 'CMD' | 'PYTHON' | 'POWER_SHELL';
    scriptCode?: string;
    maxAttemptCnt: number;
    priority: number;
    attemptInterval?: number;
    retentionPolicy: 'RECENT_DAYS' | 'RECENT_COUNT';
    retentionValue: number;
  };

  type JobInfoQueryRequestDTO = {
    pageNo: number;
    pageSize: number;
    appCode?: string;
    jobName?: string;
    processor?: string;
  };

  type JobInfoQueryResponseDTO = {
    id?: number;
    appCode?: string;
    appName?: string;
    jobName?: string;
    jobDesc?: string;
    jobType?: JobTypeDTO;
    scheduleType?: ScheduleTypeDTO;
    scheduleConfig?: string;
    scheduleConfigDesc?: string;
    processor?: string;
    executeMode?: ExecuteModeDTO;
    executeParams?: string;
    nextScheduleAt?: string;
    enabled?: boolean;
    maxConcurrentNum?: number;
    scriptType?: ScriptTypeDTO;
    scriptCode?: string;
    maxAttemptCnt?: number;
    priority?: number;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
  };

  type JobInstanceDetailResponseDTO = {
    id?: number;
    jobId?: number;
    appCode?: string;
    appName?: string;
    schedulerAddress?: string;
    workerAddress?: string;
    jobName?: string;
    jobType?: JobTypeDTO;
    processor?: string;
    jobStatus?: JobStatusDTO;
    scheduleAt?: string;
    startAt?: string;
    endAt?: string;
    executeParams?: string;
    executeMode?: ExecuteModeDTO;
    scheduleType?: ScheduleTypeDTO;
    message?: string;
    dataTime?: string;
    scriptType?: ScriptTypeDTO;
    scriptCode?: string;
    attemptCnt?: number;
    priority?: number;
  };

  type JobInstanceQueryRequestDTO = {
    pageNo: number;
    pageSize: number;
    jobInstanceId?: number;
    appCode?: string;
    jobName?: string;
    jobStatus?:
      | 'WAITING_DISPATCH'
      | 'DISPATCHING'
      | 'PENDING'
      | 'PROCESSING'
      | 'FAILED'
      | 'SUCCESS'
      | 'CANCELED';
    startAtRange?: string[];
    endAtRange?: string[];
  };

  type JobInstanceQueryResponseDTO = {
    id?: number;
    jobId?: number;
    appCode?: string;
    appName?: string;
    workerAddress?: string;
    jobName?: string;
    jobType?: JobTypeDTO;
    processor?: string;
    jobStatus?: JobStatusDTO;
    scheduleAt?: string;
    startAt?: string;
    endAt?: string;
    executeParams?: string;
    executeMode?: ExecuteModeDTO;
    scheduleType?: ScheduleTypeDTO;
    message?: string;
    dataTime?: string;
    scriptType?: ScriptTypeDTO;
    scriptCode?: string;
    attemptCnt?: number;
    priority?: number;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
  };

  type JobRunRequestDTO = {
    jobId: number;
    workerAddress?: string;
    executeParams?: string;
    dataTime?: string;
  };

  type JobStatusDTO = {
    code?: string;
    label?: string;
  };

  type JobSwitchRequestDTO = {
    jobId: number;
    enabled: boolean;
  };

  type JobTypeDTO = {
    code?: string;
    label?: string;
  };

  type listMetadataParams = {
    metadataCodes: string[];
  };

  type listWorkerParams = {
    appCode: string;
  };

  type MetadataDTO = {
    code?: string;
    label?: string;
  };

  type PageDTOAppGroupQueryResponseDTO = {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
    content: AppGroupQueryResponseDTO[];
  };

  type PageDTOJobInfoQueryResponseDTO = {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
    content: JobInfoQueryResponseDTO[];
  };

  type PageDTOJobInstanceQueryResponseDTO = {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
    content: JobInstanceQueryResponseDTO[];
  };

  type parseCronParams = {
    param?: CronParseRequestDTO;
  };

  type queryBasicInfoParams = {
    appCode?: string;
  };

  type reattemptParams = {
    jobInstanceId: number;
  };

  type removeJobInfoParams = {
    jobId: number;
  };

  type ResponseWrapperDashboardBasicInfoQueryResponseDTO = {
    data?: DashboardBasicInfoQueryResponseDTO;
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ResponseWrapperDashboardStatisticsInfoQueryResponseDTO = {
    data?: DashboardStatisticsInfoQueryResponseDTO;
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ResponseWrapperJobInfoDetailResponseDTO = {
    data?: JobInfoDetailResponseDTO;
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ResponseWrapperJobInstanceDetailResponseDTO = {
    data?: JobInstanceDetailResponseDTO;
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ResponseWrapperListLocalDateTime = {
    data?: string[];
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ResponseWrapperListMetadataDTO = {
    data?: MetadataDTO[];
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ResponseWrapperListWorkerQueryResponseDTO = {
    data?: WorkerQueryResponseDTO[];
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ResponseWrapperLong = {
    data?: number;
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ResponseWrapperPageDTOAppGroupQueryResponseDTO = {
    data?: PageDTOAppGroupQueryResponseDTO;
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ResponseWrapperPageDTOJobInfoQueryResponseDTO = {
    data?: PageDTOJobInfoQueryResponseDTO;
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ResponseWrapperPageDTOJobInstanceQueryResponseDTO = {
    data?: PageDTOJobInstanceQueryResponseDTO;
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ResponseWrapperString = {
    data?: string;
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ResponseWrapperUnit = {
    success: boolean;
    code: string;
    message: string;
    cause?: {
      stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
      }[];
      message?: string;
      localizedMessage?: string;
    };
  };

  type ScheduleTypeDTO = {
    code?: string;
    label?: string;
  };

  type ScriptTypeDTO = {
    code?: string;
    label?: string;
  };

  type terminateParams = {
    jobInstanceId: number;
  };

  type WorkerQueryResponseDTO = {
    appCode?: string;
    host?: string;
    port?: number;
    lastHeartbeatAt?: string;
    address: string;
  };
}
