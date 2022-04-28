export * from "./plugin";
export * from "./loader";
export * from "./interface";

// 解析文件 对文件内容进行区分生成临时文件，用于显示组件
export const getFileDirName = (resourcePath: string, rootContext: string) => {
  return resourcePath
    .replace(rootContext, "")
    .split(/\/|\\/)
    .join("")
    .replace(/.md$/, "");
};
