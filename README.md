# dsh-mindmap-live

DSH（DeepSeek Harness）Web 插件：基于 mind-elixir-core 内核的**实时双向思维导图**。Agent 与用户通过 session projection（`mindmap` 投影）和 Connection RPC 通道（`/mindmap`）实时共编同一棵树。

![dsh-mindmap-live 界面截图](./screenshot.jpg)

## 功能

- 侧边栏底部按钮唤出思维导图；
- **自动唤起**：agent 在当前会话中创建思维导图时，若面板处于关闭状态，停靠面板会自动弹出一次（仅"创建"触发——刷新页面、切换到已有导图的会话、以及对已有导图的后续修改都不会自动打开）；
- 两种视图（同一时刻只渲染一个画布）：
  - **停靠面板**：常驻右侧，边聊天边看/编辑导图，聊天列自动让位，宽度可调（窄/中/宽）；
  - **全屏模式**：专注编辑；
- 会话级实时同步：agent 的修改、你在画布上的编辑、以及其它打开同一会话的客户端，全部通过投影即时互相同步（用户编辑会作为 `mindmap/update` 事件写入会话日志）。

## 环境要求

- 已安装 DSH（`npx @deepseek-ai/dsh`）并能正常启动 `dsh web`；
- Node.js ≥ 18、pnpm ≥ 8（`dsh plugin` 命令会把参数转发给 pnpm）。

## 安装

统一入口是 `dsh plugin --profile web add <来源>`，按来源三选一：

**A. npm（推荐）**

```powershell
npx @deepseek-ai/dsh plugin --profile web add dsh-mindmap-live
```

**B. Git 仓库**

```powershell
npx @deepseek-ai/dsh plugin --profile web add git+https://github.com/SSShooter/dsh-mindmap-live.git
```

> `lib/` 随仓库一起提交，git 安装开箱即用，不会触发 pnpm 的构建脚本审批。

**C. 文件夹 / tarball（离线分享）**

```powershell
npx @deepseek-ai/dsh plugin --profile web add C:\下载路径\dsh-mindmap-live-0.1.0.tgz
# 或解压后的文件夹（建议绝对路径；相对路径以执行命令时所在目录为基准解析）：
npx @deepseek-ai/dsh plugin --profile web add C:\下载路径\dsh-mindmap-live
```

安装过程中出现 `warning: dsh-mindmap-live declares no dsh.bundle` 属正常——本插件是 client 插件而非 profile bundle，靠下一步的 loader 入口激活。

## 激活：添加 loader 入口（必需）

编辑 `%USERPROFILE%\.dsh\profiles\web\cordis.patch.yml`（没有则新建），追加：

```yaml
- insert:
    - id: dsh-mindmap-live
      name: dsh-mindmap-live
```

## 启动验证

```powershell
npx @deepseek-ai/dsh web
```

打开 Web 界面后，侧边栏底部出现思维导图按钮即安装成功；点击可在停靠/全屏两种视图间切换。

## 从源码构建

`lib/` 已预构建（内联 MindElixir 内核与样式）并随仓库一起提交——npm / git 方式安装后开箱即用，**无需**任何构建。

如需修改 `src/` 后重建，在本目录内：

```powershell
npm install     # 或 pnpm install --ignore-workspace
pnpm build      # 等价于 node build.mjs，读取 node_modules/mind-elixir/dist
```

MindElixir 内核来自 `devDependencies` 中的 npm 包 `mind-elixir`：升级时改版本号 → 重跑构建 → 发布新版插件，即可同步上游更新。

## 目录说明

| 路径 | 用途 |
| --- | --- |
| `lib/index.js` | Host 侧插件：注册 `mindmap` 投影与 `/mindmap` RPC 通道 |
| `lib/client.js` | 浏览器侧 bundle（ModuleLoader factory 格式，已内联 MindElixir） |
| `src/client/index.js` | 客户端源码 |
| `build.mjs` | 构建脚本 |
| `verify-auto-open.mjs` | 验证"agent 创建导图时自动弹出面板"（含刷新/编辑不弹出的反例） |
| `verify-*.mjs` | 其余开发期验证脚本，使用时无需关心 |

## 维护者：发版

```powershell
# 1. 修改 src/ 后，在本插件所属的 mind-elixir-core 仓库内重新构建：
pnpm build

# 2. 提交 lib/ 与源码，升 package.json 版本号，然后发布：
npm login
npm publish
```

npm 包只含 `files` 声明的内容（`lib/`、README、LICENSE）；完整源码以 GitHub 仓库为准。发布前无需额外打包步骤，`lib/` 是随仓库提交的产物。

## License

MIT（见 LICENSE）。内嵌的 MindElixir 内核同样以 MIT 授权（Copyright (c) 2019 DjZhou）。
