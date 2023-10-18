[![npm version](https://img.shields.io/npm/v/node-wiz.svg?style=flat)](https://www.npmjs.com/package/node-wiz)

## node-wiz
Node.js工具集，为开发者提供了强力的功能和工具，加速开发流程。

### 安装
```bash
yarn add node-wiz --dev
```

### 常量
- argv: 命令行参数
- currentWorkingDirectory: 当前工作目录

### 函数
- spawnSync(command: string, params: string[]): 同步执行命令行
- clearConsole(): 清空控制台
- getGitStatus: 获取git状态
- tryGitAdd(path: string): 执行 git add
- tryYarn: 执行 yarn
- tryNpm: 执行 npm
- capitalizeFirstLetter(str: string): 首字母大写
- decapitalizeFirstLetter(str: string): 首字母小写
- handleAndExitOnError(func): 错误处理
- handleAndExitOnErrorSync(async func): 同步错误处理
- isValidVariableName(name: string): 是否合法的变量名
- copyDirectoryContents(srouce: string, targe: string, transformCallback: Function(content: string)): 复制目录
- snakeCaseToCamelCase(str: string): 下划线转驼峰
- kebabCaseToCamelCase(str: string): 中划线转驼峰