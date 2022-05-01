import React from "react";
import Dom from "./../App.as.md";
const PreviewCode = (props) => {
  const [Dome, setDome] = React.useState(<React.Fragment />);

  React.useEffect(() => {
    const getasr = async () => {
      const DomDefault = React.lazy(() => import(`./../App${props.lang}.md`));
      setDome(
        <React.Suspense>
          <DomDefault />
        </React.Suspense>
      );
    };
    getasr();
  }, [props.lang]);

  return <React.Fragment>{Dome}</React.Fragment>;
};

export default PreviewCode;
