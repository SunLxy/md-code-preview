import lessModules from "@kkt/less-modules";
import rawModules from "@kkt/raw-modules";
import path from "path";
import {
  MdCodePreviewPlugin,
  mdCodeModulesLoader,
} from "md-code-preview-plugin-loader";

const codePenOptions = {
  css: "https://unpkg.com/uiw@4.7.2/dist/uiw.min.css",
  js: "https://unpkg.com/react@18.x/umd/react.development.js;https://unpkg.com/react-dom@18.x/umd/react-dom.development.js;https://unpkg.com/uiw@4.7.2/dist/uiw.min.js;https://unpkg.com/@uiw/codepen-require-polyfill@1.0.12/index.js",
  includeModule: ["uiw"],
};

export default (conf, env, options) => {
  // console.log('conf:', conf)
  // console.log('env:', env)
  conf = rawModules(conf, env, options);
  conf = lessModules(conf, env, options);
  conf.plugins.push(
    // new MdCodePreviewPlugin({
    //   cwd: path.join(process.cwd(), ".."),
    //   pre: "code",
    //   createJs: false,
    //   isInterval: false,
    // }),
    new MdCodePreviewPlugin({
      cwd: path.join(process.cwd(), ".."),
      isInterval: false,
      codePenOptions,
    })
  );
  conf = mdCodeModulesLoader(conf, {
    mdCodePreviewPath: "@/components/markdown",
    isInterval: false,
    codePenOptions,
  });
  if (process.env.NODE_ENV === "production") {
    conf.output = { ...conf.output, publicPath: "./" };
  }

  conf.resolve = {
    ...conf.resolve,
    alias: {
      ...(conf.resolve.alias || {}),
      "@@": path.resolve(process.cwd(), "src/.docs"),
      "@": path.resolve(process.cwd(), "src"),
    },
  };
  return conf;
};
