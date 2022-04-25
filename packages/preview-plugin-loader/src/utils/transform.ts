import { transform } from '@babel/standalone';
import RemoveImports from 'babel-plugin-transform-remove-imports';

export function babelTransform(input: string) {
  return transform(input, {
    presets: ['env', 'es2015', 'react'],
    plugins: [[RemoveImports, { removeAll: true }]],
  });
}

export const getTransformValue = (str: string) => {
  const { code } = babelTransform(str)
  const result = `${code}`
    .replace(`Object.defineProperty(exports, \"__esModule\", {\n  value: true\n});`, "")
    .replace(`exports["default"] = void 0;`, "")
    .replace(`exports["default"] = _default;`, `var Preview = _default;`)

  return result
}