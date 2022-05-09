/**
 * 自定义渲染部分
 * ***/
import MdCodePreview from "md-code-preview";
export default (props) => {
  console.log("props---->", props);
  return (
    <MdCodePreview
      {...props}
      codePadding={0}
      // codePenOptions={codePenOptions}
      // codeSandboxOptions={CodeSandboxOptions}
      // stackBlitzOptions={stackBlitzOptions}
    />
  );
};
