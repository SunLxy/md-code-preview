import lessModules from "@kkt/less-modules";
import rawModules from "@kkt/raw-modules";
import path from "path";
import { MdCodePreviewPlugin } from "md-code-preview-plugin-loader";
import MdCodeCreateJsPlugin from "md-create-js-plugin";
// md-code-preview
export default (conf, env, options) => {
  // console.log('conf:', conf)
  // console.log('env:', env)
  conf = rawModules(conf, env, options);
  conf = lessModules(conf, env, options);

  conf.plugins.push(
    // new MdCodePreviewPlugin({
    //   cwd: path.join(process.cwd(), ".."),
    // }),
    new MdCodeCreateJsPlugin({
      cwd: path.join(process.cwd(), ".."),
    })
  );
  conf.module.rules.push({
    test: /.md$/,
    use: [
      {
        loader: "md-code-preview-plugin-loader",
      },
    ],
  });

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
