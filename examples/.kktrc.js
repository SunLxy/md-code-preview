import lessModules from "@kkt/less-modules";
import rawModules from "@kkt/raw-modules";
import path from "path";
import { MdCodePreviewPlugin } from "md-code-preview-plugin-loader";
const getCacheIdentifier = require("react-dev-utils/getCacheIdentifier");

// md-code-preview
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
    })
  );
  // process.exit(1)
  // delete conf.module.rules[1].oneOf[0

  conf.module.rules[1].oneOf.unshift({
    test: /.md$/,
    use: [
      {
        loader: require.resolve("babel-loader"),
        options: {
          customize: require.resolve(
            "babel-preset-react-app/webpack-overrides"
          ),
          presets: [
            [
              require.resolve("babel-preset-react-app"),
              {
                runtime: "classic",
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
          cacheIdentifier: getCacheIdentifier("production", [
            "babel-plugin-named-asset-import",
            "babel-preset-react-app",
            "react-dev-utils",
            "react-scripts",
          ]),
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
          // See #6846 for context on why cacheCompression is disabled
          cacheCompression: false,
          compact: false,
        },
      },
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
