# 小游戏合集（GitHub Pages）

在线地址
- 入口页（目录）：https://xianyu110.github.io/game/
- 直接访问各游戏：
  - 五子棋：/gomoku.html（人机/双人，难度：简单/普通/困难，胜利计时排行）
  - 2048：/2048.html（方向键/滑动操作，分数排行）
  - 贪吃蛇：/snake.html（难度影响速度，分数排行）
  - 打砖块：/breakout.html（难度影响挡板宽度与球速，分数排行）
  - 扫雷：/minesweeper.html（入门/中级/高级，首次点击必安全，用时排行）
  - 记忆配对：/memory.html（4x4/6x4/6x6，用时排行）

项目简介
- 纯前端静态页面，基于 HTML5 Canvas，无构建依赖，移动端友好。
- 每个游戏均支持“难度”与“排行榜”。排行榜使用浏览器 localStorage 保存在本地，无需后端服务。

快速本地运行
- 直接双击打开 `index.html` 即可（或使用任意静态服务器）。
- Python 本地服务示例：
  - Python 3：`python3 -m http.server 8080`，浏览器打开 `http://localhost:8080/`

目录结构（节选）
- `index.html`：游戏目录页
- `gomoku.html`、`2048.html`、`snake.html`、`breakout.html`、`minesweeper.html`、`memory.html`
- `lib/leaderboard.js`：通用排行榜模块（localStorage 持久化）

排行榜说明
- 首次记录会提示设置昵称（可在排行榜面板底部修改）。
- 计时类（五子棋胜利、扫雷、记忆配对）：用时越少排名越高。
- 计分类（2048、贪吃蛇、打砖块）：分数越高排名越靠前。
- 排行榜只保存在本地浏览器，可在面板中“清空本游戏记录”。

部署（GitHub Pages）
- 本仓库使用 `gh-pages` 分支作为 Pages 源，路径为根目录 `/`。
- 修改页面后推送到 `gh-pages` 分支，等待 Pages 自动部署完成即可。
  - 仓库 Settings → Pages：Source 选择 `gh-pages / (root)`。
  - 自定义域名：在根目录添加 `CNAME` 文件并在 Settings 绑定域名。

后续计划（欢迎反馈）
- 新增：数独、拼图、连四棋、俄罗斯方块等。
- 五子棋 AI：加入更深层搜索（NegaMax/Alpha-Beta）、威胁搜索（VCF/VCG）。

隐私
- 排行榜与昵称仅存储在你的浏览器本地，不会上传服务器。
