import { transform } from "@babel/standalone";
import RemoveImports from "babel-plugin-transform-remove-imports";

export function babelTransform(input: string, filename: string) {
  return transform(input, {
    filename,
    presets: ["env", "es2015", "react", "typescript"],
    plugins: [[RemoveImports, { removeAll: true }]],
  });
}

export function babelTransform2(input: string, filename: string) {
  return transform(input, {
    filename,
    presets: ["env", "es2015", "react", "typescript"],
  });
}

export const getTransformValue = (str: string, filename: string) => {
  const { code } = babelTransform(str, filename);
  const result = `${code}`
    .replace(
      `Object.defineProperty(exports, \"__esModule\", {\n  value: true\n});`,
      ""
    )
    .replace(`exports["default"] = void 0;`, "")
    .replace(`exports["default"] = _default;`, `var Preview = _default;`);

  return result;
};

export const getTransformValue2 = (str: string, filename: string) => {
  const isReact = /import React.+from "react"/.test(str);
  // 先判断 是否引入 react
  const tran = isReact ? str : `import React from "react"\n ${str}`;
  const code = `${babelTransform2(tran, `${filename}`).code}`
    .replace(
      `Object.defineProperty(exports, \"__esModule\", {\n  value: true\n});`,
      ""
    )
    .replace(`exports["default"] = void 0;`, "")
    .replace(
      `exports["default"] = _default;`,
      `return _react["default"].createElement(_default)`
    );

  return code;
};
