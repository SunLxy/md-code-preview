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
  return CodeSandboxOptions;
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
  return codePenOptions;
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
  return stackBlitzOptions;
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
  let optionsObj: Record<string, unknown> = {};
  if (isCodePan) {
    const result = getCodePanConfig(code, title, {
      css,
      js,
      includeModule,
    });
    optionsObj["codePenOptions"] = result;
    optionsStr += ` codePenOptions={${JSON.stringify(result)}} \n`;
  }
  if (isCodeSandbox) {
    const result = getCodeSandboxConfig(code, title, dependencies);
    optionsObj["codeSandboxOptions"] = result;
    optionsStr += ` codeSandboxOptions={${JSON.stringify(result)}} \n`;
  }
  if (isStackBlitz) {
    const result = getStackBlitzConfig(code, title, dependencies);
    optionsObj["stackBlitzOptions"] = result;
    optionsStr += ` stackBlitzOptions={${JSON.stringify(result)}} \n`;
  }
  return {
    optionsStr,
    optionsObj,
  };
};
