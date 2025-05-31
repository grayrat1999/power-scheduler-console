# Power-Scheduler-Console

Power-Scheduler-Console 是一个基于 Vue 3 + Ant Design Vue 的任务调度管理平台前端项目。它提供了任务、任务实例、应用分组等的可视化管理能力，支持任务的创建、编辑、调度、运行、终止等操作。

## 功能特性

- 任务管理：支持任务的新增、编辑、删除、启用/禁用、单次执行等操作
- 任务实例管理：支持实例查询、重跑、终止、详情查看、异常信息查看等
- 应用分组管理：支持应用分组的增删查
- 仪表盘：展示任务调度的统计信息和基础信息
- 支持多种调度类型（如 CRON、FIX_RATE、FIX_DELAY）
- 支持多种任务类型（如 JAVA、SCRIPT）
- 支持多种执行模式

## 技术栈

- [Vue 3](https://vuejs.org/)
- [Ant Design Vue](https://www.antdv.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [pnpm](https://pnpm.io/)
- [OpenAPI](https://swagger.io/specification/)

## 项目结构

```
.
├── public/                  # 静态资源
├── script/                  # OpenAPI 配置与生成脚本
├── src/
│   ├── assets/              # 静态资源
│   ├── components/          # 业务组件
│   ├── service/api/         # 后端接口定义
│   ├── views/               # 页面视图
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── pnpm-lock.yaml
├── README.md
└── ...
```

## 快速开始

### 1. 安装依赖

```sh
pnpm install
```

### 2. 启动开发环境

```sh
pnpm run dev
```

### 3. 拉取接口

```sh
pnpm run openapi
```

### 4. 打包构建

```sh
pnpm run build
```

### 5. 运行测试

```sh
pnpm run test
```

## OpenAPI 接口生成

接口定义和请求代码通过 OpenAPI 自动生成，配置见 `script/config.js`。

## 主要页面

- 任务管理：`src/views/JobInfoManagerView.vue`
- 任务实例管理：`src/views/JobInstanceManagerView.vue`
- 应用分组管理：`src/views/AppGroupManagerView.vue`
- 仪表盘：`src/views/DashboardView.vue`

## 贡献

欢迎提交 issue 和 PR！
