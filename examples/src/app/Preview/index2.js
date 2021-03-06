import React from "react";
// import Dom from "./../App.as.md";
const PreviewCode = (props) => {
  const [Dome, setDome] = React.useState(<React.Fragment />);

  React.useEffect(() => {
    const getasr = async () => {
      // const DomDefault = React.lazy(() =>
      //   import(`@uiw/react-layout/README${props.lang}.md`)
      // );
      const dasss = await import(`@uiw/react-layout/README${props.lang}.md`);
      const DefaultItem = dasss.default;
      setDome(
        <React.Suspense fallback="loading...">
          <DefaultItem />
        </React.Suspense>
      );
    };
    getasr();
  }, [props.lang]);

  return <React.Fragment>{Dome}</React.Fragment>;
};

export default PreviewCode;
