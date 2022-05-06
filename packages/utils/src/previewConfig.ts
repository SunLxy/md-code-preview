import { GetConfigOptions } from ".";
/**
 * @description: 获取 CodeSandbox 配置
 * @param {string} code 代码块字符串
 * @param {string} dependencies 依赖包
 */
export const getCodeSandboxConfig = (
  code: string,
  title: string = "",
  dependencies: string[]
) => {
  const newDependencies: Record<string, string> = {};
  dependencies.forEach((dep) => {
    newDependencies[dep] = "latest";
  });
  if (!newDependencies["react-dom"]) {
    newDependencies["react-dom"] = "latest";
  }
  const CodeSandboxOptions = {
    files: {
      "package.json": {
        content: {
          name: title,
          dependencies: newDependencies,
        },
      },
      "app.js": {
        content: code,
      },
      "index.js": {
        content: `import React from "react";\nimport ReactClient from "react-dom/client";\nimport App from "./app";\nReactClient.createRoot(document.getElementById("root")).render(<App />);`,
      },
      "index.html": {
        content: `<div id="root"></div>`,
      },
    },
  };
  return JSON.stringify(CodeSandboxOptions);
};

/**
 * @description: 获取 CodeSandbox 配置
 * @param {string} code 代码块字符串
 * @param {string} title 标题
 * @param {{css:string,js:string,includeModule:string[]}} options 配置参数
 */
export const getCodePanConfig = (
  code: string,
  title = "",
  options: { css?: string; js?: string; includeModule?: string[] }
) => {
  const { css = "", js = "", includeModule = [] } = options;
  const codePenOptions = {
    includeModule: includeModule,
    title: title,
    html: `<div id="root"></div>`,
    css_external: css,
    js: `${code.replace(
      "export default",
      "const App_Render = "
    )}\nReactDOM.createRoot(document.getElementById("root")).render(<App_Render />);
    `,
    js_external: js,
  };
  return JSON.stringify(codePenOptions);
};

/**
 * @description: 获取 stackBlitz 配置
 * @param {string} code 代码块字符串
 * @param {string} dependencies 依赖包
 */
export const getStackBlitzConfig = (
  code: string,
  title: string = "",
  dependencies: string[]
) => {
  const newDependencies: Record<string, string> = {};
  dependencies.forEach((dep) => {
    newDependencies[dep] = "latest";
  });
  if (!newDependencies["react-dom"]) {
    newDependencies["react-dom"] = "latest";
  }
  if (!newDependencies["@babel/core"]) {
    newDependencies["@babel/core"] = "latest";
  }

  const stackBlitzOptions = {
    template: "create-react-app",
    title: title,
    description: "demo",
    tags: ["stackblitz"].concat(dependencies || []),
    dependencies: newDependencies,
    files: {
      "app.js": code,
      "index.html": `<div id="root"></div>`,
      "index.js": `import React from "react";\nimport ReactClient from "react-dom/client";\nimport App from "./app";\nReactClient.createRoot(document.getElementById("root")).render(<App />);
      `,
    },
  };
  return JSON.stringify(stackBlitzOptions);
};

export const getConfig = (
  properties: Record<string, unknown>,
  options: GetConfigOptions
) => {
  const { code, title, css, js, dependencies, includeModule } = options;
  const isCodePan = Reflect.get(properties || {}, "codePen");
  const isCodeSandbox = Reflect.get(properties || {}, "codeSandbox");
  const isStackBlitz = Reflect.get(properties || {}, "stackBlitz");
  let optionsStr = ``;
  if (isCodePan) {
    optionsStr += ` codePenOptions={${getCodePanConfig(code, title, {
      css,
      js,
      includeModule,
    })}} \n`;
  }
  if (isCodeSandbox) {
    optionsStr += ` codeSandboxOptions={${getCodeSandboxConfig(
      code,
      title,
      dependencies
    )}} \n`;
  }
  if (isStackBlitz) {
    optionsStr += ` stackBlitzOptions={${getStackBlitzConfig(
      code,
      title,
      dependencies
    )}} \n`;
  }
  return optionsStr;
};
