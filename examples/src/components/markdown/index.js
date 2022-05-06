/**
 * 自定义渲染部分
 * ***/
import MdCodePreview from "md-code-preview";
export default (props) => {
  const CodeSandboxOptions = {
    files: {
      "package.json": {
        content: {
          dependencies: {
            react: "latest",
            uiw: "latest",
            "react-dom": "latest",
          },
        },
      },
      "app.js": {
        content: props.copyNodes,
      },
      "index.js": {
        content: ` import React from "react";\nimport ReactClient from "react-dom/client";\nimport App from "./app";\nReactClient.createRoot(document.getElementById("root")).render(<App />);`,
      },
      "index.html": {
        content: `<div id="root"></div>`,
      },
    },
  };

  const codePenOptions = {
    includeModule: ["uiw"],
    title: "uiw v4.7.2 - demo",
    html: `<div id="root"></div>`,
    css_external: "https://unpkg.com/uiw@4.7.2/dist/uiw.min.css",
    js: `${props.copyNodes.replace(
      "export default",
      "const App_Render = "
    )}\nReactDOM.createRoot(document.getElementById("root")).render(<App_Render />);
    `,
    js_external:
      "https://unpkg.com/react@18.x/umd/react.development.js;https://unpkg.com/react-dom@18.x/umd/react-dom.development.js;https://unpkg.com/uiw@4.7.2/dist/uiw.min.js;https://unpkg.com/@uiw/codepen-require-polyfill@1.0.12/index.js",
  };

  // 这个直接使用 uiw 包有问题，暂时注释
  const stackBlitzOptions = {
    template: "create-react-app",
    title: "uiw",
    description: "uiw v4.7.2 - demo",
    tags: ["stackblitz", "uiw", "react"],
    dependencies: {
      react: "latest",
      uiw: "4.7.13",
      "react-dom": "latest",
      "@babel/core": "latest",
    },
    files: {
      "app.js": props.copyNodes,
      "index.html": `<div id="root"></div>`,
      "index.js": `import React from "react";\nimport ReactClient from "react-dom/client";\nimport App from "./app";\nReactClient.createRoot(document.getElementById("root")).render(<App />);
      `,
    },
  };

  console.log("props---->", props);
  return (
    <MdCodePreview
      {...props}
      // codePenOptions={codePenOptions}
      // codeSandboxOptions={CodeSandboxOptions}
      // stackBlitzOptions={stackBlitzOptions}
    />
  );
};
