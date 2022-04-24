import React from 'react';
import logo from './logo.svg';
import styles from './App.module.less';


export const getFileDirName = (resourcePath, rootContext) => {
  return resourcePath.split(/\/|\\/).join("").replace(/.md$/, "")
}

export default function App() {

  const [renderArr, setRenderArr] = React.useState("")

  React.useEffect(() => {
    const resl = async () => {
      const result = await import("md-code-preview/README.md")
      // // 相对于项目根目录的路径
      const fileDirName = getFileDirName("packages/preview/README.md")

      if (result && result.default) {
        // 这个文件名的命名规则是 markdown解析后的children 数组中所处code下标 
        const files = ["1.jsx", "4.tsx"]
        let arr = []
        for (const key in files) {
          if (Object.hasOwnProperty.call(files, key)) {
            const path = files[key];
            const Dom = React.lazy(() => import(`@@/${fileDirName}/${path}`))
            arr.push(<React.Suspense key={key} fallback="loading..." >
              <Dom />
            </React.Suspense>)
          }
        }
        setRenderArr(arr)
      }
    }
    resl()
  }, [])


  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <img src={logo} className={styles.AppLogo} alt="logo" />
        <p>
          Edit <code>src/app/App.js</code> and save to reload.
        </p>
        {renderArr}
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
