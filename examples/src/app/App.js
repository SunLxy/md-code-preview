import React from 'react';
import Preview from "./Preview"

export default function App() {
  return (<Preview getMdStr={() => import("md-code-preview/README.md")} fileDirName="packages/preview/README.md" />);
}
