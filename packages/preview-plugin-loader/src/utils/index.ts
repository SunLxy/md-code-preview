import webpack from "webpack";
export * from "./plugin";
export * from "./interface";
import { OtherProps, createLoaderRetuen } from "md-plugin-utils";
import getCacheIdentifier from "react-dev-utils/getCacheIdentifier";

/**
 * 1. 解析代码 获取需要渲染的代码块和标题简介部分
 * 2. 对转换好的代码进行字符串化，并拼接好渲染的代码块(解析代码块的依赖，渲染的代码块不需要进行转换，只移出 import/require 引入)
 * 3. 添加渲染代码块的组件字符串
 * 4. 所有内容拼接成一个字符串
 * 5. 通过babel-loader 进行转换成模块
 * 6. 返回babel-loder 结果
 * 7. 页面渲染
 * ***/
/**
 * @description:  最终的返回内容
 * @param {string} scope markdown字符串
 * @param {string} lang 解析代码块的语言
 * @param {OtherProps} otherProps 其他参数
 */
export const lastReturn = (
  scope: string,
  lang: string[] = ["jsx", "tsx"],
  otherProps: OtherProps = {}
) => {
  return createLoaderRetuen(scope, lang, otherProps);
};

/** 判断是否引入 react/jsx-runtime **/
const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === "true") {
    return false;
  }

  try {
    require.resolve("react/jsx-runtime");
    return true;
  } catch (e) {
    return false;
  }
})();

/**
 * 配置react代码的babel-loader
 * 直接搬 create-react-app 内的配置 (https://github.com/facebook/create-react-app/blob/f99167c014a728ec856bda14f87181d90b050813/packages/react-scripts/config/webpack.config.js#L416-L465)
 */
const getModulesBabelLoader = () => {
  const webpackEnv = process.env.NODE_ENV;
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  return {
    loader: require.resolve("babel-loader"),
    options: {
      customize: require.resolve("babel-preset-react-app/webpack-overrides"),
      presets: [
        [
          require.resolve("babel-preset-react-app"),
          {
            runtime: hasJsxRuntime ? "automatic" : "classic",
          },
        ],
      ],
      // @remove-on-eject-begin
      babelrc: false,
      configFile: false,
      // Make sure we have a unique cache identifier, erring on the
      // side of caution.
      // We remove this when the user ejects because the default
      // is sane and uses Babel options. Instead of options, we use
      // the react-scripts and babel-preset-react-app versions.
      cacheIdentifier: getCacheIdentifier(
        isEnvProduction ? "production" : isEnvDevelopment && "development",
        [
          "babel-plugin-named-asset-import",
          "babel-preset-react-app",
          "react-dev-utils",
          "react-scripts",
        ]
      ),
      // // @remove-on-eject-end
      // plugins: [
      //   isEnvDevelopment &&
      //   shouldUseReactRefresh &&
      //   require.resolve('react-refresh/babel'),
      // ].filter(Boolean),
      // This is a feature of `babel-loader` for webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true,
      // See #6846 for context on why cacheCompression is disabled
      cacheCompression: false,
      compact: isEnvProduction,
    },
  };
};

/**
 * 配置好markdown的loader
 * @param {webpack.Configuration} config webpack配置
 * @param {boolean} isInterval 是否需要解析代码块以上到标题之间的内容并合并到展示组件中
 * @returns {webpack.Configuration}
 * **/
export const mdCodeModulesLoader = (
  config: webpack.Configuration,
  isInterval: boolean = true
): webpack.Configuration => {
  config.module.rules.forEach((ruleItem) => {
    if (typeof ruleItem === "object") {
      if (ruleItem.oneOf) {
        ruleItem.oneOf.unshift({
          test: /.md$/,
          use: [
            getModulesBabelLoader(),
            {
              loader: "md-code-preview-plugin-loader",
              options: { isInterval },
            },
          ],
        });
      }
    }
  });
  return config;
};
