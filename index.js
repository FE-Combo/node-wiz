const fs = require("fs-extra");
const process = require("process");
const shelljs = require("shelljs");
const childProcess = require("child_process");

const argv = process.argv;

const currentWorkingDirectory = fs.realpathSync(process.cwd());

// similar to: https://github.com/moxystudio/node-cross-spawn
function spawnSync(command, params) {
  const isWindows = process.platform === "win32";
  const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, params, {
    stdio: "inherit",
  });
  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${params.join(" ")}`);
    process.exit(1);
  }
}

function clearConsole() {
  process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
}

function getGitStatus() {
  return handleAndExitOnError(() => {
    // 获取Git仓库的状态，以一种简洁的格式输出未提交的更改，并指定了子进程的标准输入、标准输出和标准错误的处理方式
    let stdout = childProcess.execSync(`git status --porcelain`, { stdio: ["pipe", "pipe", "ignore"] }).toString();
    return stdout.trim();
  });
}

function tryGitAdd(appPath) {
  handleAndExitOnErrorSync(() => spawnSync("git", ["add", appPath]));
}

function tryYarn() {
  handleAndExitOnErrorSync(() => spawnSync("yarnpkg", ["--cwd", process.cwd()]));
}

function tryNpm() {
  handleAndExitOnErrorSync(() => spawnSync("npm", ["install", "--loglevel", "error"]));
}

const capitalizeFirstLetter = (str) => str.replace(/^[a-z]/, (match) => match.toUpperCase());

const decapitalizeFirstLetter = (str) => str.replace(/^[A-Z]/, (match) => match.toLowerCase());

const handleAndExitOnError = (f) => {
  try {
    return f();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const handleAndExitOnErrorSync = async (asyncFunction) => {
  try {
    return await asyncFunction();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

function isValidVariableName(variableName) {
  const regex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return regex.test(variableName);
}

const copyDirectoryContents = (source, target, transformCallback) => {
  shelljs.ls(source).forEach((name) => {
    const subSource = `${source}/${name}`;
    const subTarget = `${target}/${name}`;
    const isFile = fs.statSync(subSource).isFile();
    if (isFile) {
      fs.ensureFileSync(subTarget);
      let fileContent = fs.readFileSync(subSource).toString();
      if (typeof transformCallback === "function") {
        fileContent = transformCallback(fileContent);
      }
      fs.writeFileSync(subTarget, fileContent);
    } else {
      fs.ensureDirSync(subTarget);
      copyDirectoryContents(subSource, subTarget, transformCallback);
    }
  });
};

// 下划线转驼峰
const snakeCaseToCamelCase = (str) => str.replace(/([^\\/])(?:\/+([^\\/]))/g, (_, p1, p2) => p1 + p2.toUpperCase());

// 中划线转驼峰
const kebabCaseToCamelCase = (str) => str.replace(/-(.)/g, (_, match) => match.toUpperCase());

module.exports = {
  argv,
  currentWorkingDirectory,
  spawnSync,
  clearConsole,
  getGitStatus,
  tryGitAdd,
  tryYarn,
  tryNpm,
  capitalizeFirstLetter,
  decapitalizeFirstLetter,
  handleAndExitOnError,
  handleAndExitOnErrorSync,
  isValidVariableName,
  copyDirectoryContents,
  snakeCaseToCamelCase,
  kebabCaseToCamelCase,
};
