import React from 'react';
import logo from './logo.svg';
import styles from './App.module.less';
import Preview from "./Preview"

export default function App() {
  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <img src={logo} className={styles.AppLogo} alt="logo" />
        <p>
          Edit <code>src/app/App.js</code> and save to reload.
        </p>
        <Preview getMdStr={() => import("md-code-preview/README.md")} fileDirName="packages/preview/README.md" />
        {/* {renderArr} */}
        <div>
          <a className={styles.AppLink} href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          <a className={styles.AppLink} href="https://github.com/kktjs/kkt" target="_blank" rel="noopener noreferrer">
            Learn KKT
          </a>
        </div>
      </header>
    </div>
  );
}
