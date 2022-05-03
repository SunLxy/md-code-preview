import React from "react";
import { RenderProps } from "./../interface";

const Render = (props: RenderProps) => {
  const { previewBodyClassName, component, ...others } = props;
  const [showDom, setShowDom] = React.useState(null);
  const componentShow = async () => {
    if (typeof component === "function") {
      const Dom = React.lazy(component as any);
      setShowDom(
        <React.Suspense fallback="loading...">
          <Dom />
        </React.Suspense>
      );
    } else {
      setShowDom(component);
    }
  };

  React.useEffect(() => {
    if (component) {
      componentShow();
    }
  }, [component]);
  return (
    <div
      children={showDom}
      {...others}
      className={`preview-body ${previewBodyClassName}`}
    />
  );
};
export default Render;
