
---

# 传智考试答题增强版 (Enhanced Exam Answer Script)

这是一个用户脚本，适用于 [油猴 (Tampermonkey)](https://www.tampermonkey.net/)，专为 [传智教育](https://stu.ityxb.com) 的考试页面设计。该脚本与页面中的考试题目交互，自动从后端 API 获取答案，并将其显示在题目下方。同时，用户可以使用快捷键控制答案和状态的显示。

## Features / 特性

* 自动从后端 API 获取考试题目的答案。
* 将答案显示在每个题目下方。
* 使用 ‘N’ 键显示所有答案和状态。
* 使用 ‘M’ 键隐藏答案和状态。
* 可自定义答案和状态的显示。
* 支持平台上的多个考试页面。

## Installation / 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [Greasemonkey](https://www.greasemonkey.io/) 扩展。
2. 点击 `Raw` 按钮下载用户脚本，或直接将脚本添加到 Tampermonkey 扩展中。
3. 打开 Tampermonkey 扩展，点击 'Add to Tampermonkey'。
4. 访问 [传智教育](https://stu.ityxb.com) 的相关考试页面。
5. 脚本会自动开始获取并显示答案。

## Usage / 使用方法

* 在考试页面加载后，脚本将开始加载题目。
* 按 **M** 键可以隐藏所有答案和状态。
* 按 **N** 键可以显示所有答案和状态。
* 脚本会从后端 API 获取每道题的答案，并直接显示在题目下方。

## Backend API / 后端 API

该脚本通过您自己部署的 API 获取答案。请确保您的 API 可以通过以下地址访问并正常运行：

`https://your-api-domain.com/v2/api.php`

修改脚本中的 `API_URL` 为您自己的域名，以确保脚本能够与您的后端进行交互。

```javascript
const API_URL = "https://your-api-domain.com/v2/api.php";
```

## Development / 开发

如果你想为这个项目做贡献或修改脚本：

1. Fork 本仓库。
2. 克隆到本地机器。
3. 做出必要的更改。
4. 提交拉取请求进行审核。

### License / 许可

此项目采用 MIT 许可协议。

---

