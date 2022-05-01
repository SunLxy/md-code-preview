import lessModules from "@kkt/less-modules";
import rawModules from "@kkt/raw-modules";
import path from "path";
import {
  MdCodePreviewPlugin,
  mdCodeModulesLoader,
} from "md-code-preview-plugin-loader";

export default (conf, env, options) => {
  // console.log('conf:', conf)
  // console.log('env:', env)
  conf = rawModules(conf, env, options);
  conf = lessModules(conf, env, options);
  // conf.plugins.push(
  //   new MdCodePreviewPlugin({
  //     cwd: path.join(process.cwd(), ".."),
  //     pre: "code",
  //     createJs: false,
  //     isInterval: false,
  //   }),
  //   new MdCodePreviewPlugin({
  //     cwd: path.join(process.cwd(), ".."),
  //   })
  // );

  conf = mdCodeModulesLoader(conf);
  conf.output = { ...conf.output, publicPath: "./" };

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
