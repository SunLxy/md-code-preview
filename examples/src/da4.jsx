import MdCodePreview from "md-code-preview";
import copyTextToClipboard from "@uiw/copy-to-clipboard";
import React from "react";

import { Alert } from "uiw";

const BaseCodeRenderComponent4 = () => {
  class Demo extends React.Component {
    render() {
      return (
        <div>
          <Alert
            confirmText="确定按钮"
            content="这个对话框只有两个个按钮，单击“确定按钮”后，此对话框将关闭。用作通知用户重要信息。"
          />
        </div>
      );
    }
  }
  const DOMS = () => {
    return <div>ewewwewwe</div>;
  };

  return <DOMS />;
};

const importCopyNodeRender = {
  4: `import React from 'react';
import { Alert,} from 'uiw';

class Demo extends React.Component {
  render() {
    return (
      <div>
        <Alert
          confirmText="确定按钮"
          content="这个对话框只有两个个按钮，单击“确定按钮”后，此对话框将关闭。用作通知用户重要信息。"
        />
      </div>
    )
  }
}
export default Demo;`,
};

const importHeadRender = {
  4: (
    <React.Fragment>
      <h2 id={`基本用法`}>
        <a
          className={`anchor`}
          aria-hidden={`true`}
          tabIndex={-1}
          href={`#基本用法`}
        >
          <svg
            className={`octicon octicon-link`}
            viewBox={`0 0 16 16`}
            version={`1.1`}
            width={`16`}
            height={`16`}
            aria-hidden={`true`}
          >
            <path
              fillRule={`evenodd`}
              d={`M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z`}
            ></path>
          </svg>
        </a>
        基本用法
      </h2>
    </React.Fragment>
  ),
};

const importDescRender = {};

const importCodeRender = {
  4: (
    <React.Fragment>
      <pre className="language-jsx" data-type={`rehyp`}>
        <code className="language-jsx code-highlight">
          <span className="code-line">
            <span className="token keyword module">import</span>{" "}
            <span className="token imports">
              <span className="token maybe-class-name">React</span>
            </span>{" "}
            <span className="token keyword module">from</span>{" "}
            <span className="token string">'react'</span>
            <span className="token punctuation">;</span>
          </span>
          <span className="code-line">
            <span className="token keyword module">import</span>{" "}
            <span className="token imports">
              <span className="token punctuation">&#123;</span>{" "}
              <span className="token maybe-class-name">Alert</span>
              <span className="token punctuation">,</span>
              <span className="token punctuation">&#125;</span>
            </span>{" "}
            <span className="token keyword module">from</span>{" "}
            <span className="token string">'uiw'</span>
            <span className="token punctuation">;</span>
          </span>
          <span className="code-line"></span>
          <span className="code-line">
            <span className="token keyword">class</span>{" "}
            <span className="token class-name">Demo</span>{" "}
            <span className="token keyword">extends</span>{" "}
            <span className="token class-name">
              React<span className="token punctuation">.</span>Component
            </span>{" "}
            <span className="token punctuation">&#123;</span>
          </span>
          <span className="code-line">
            {" "}
            <span className="token function">render</span>
            <span className="token punctuation">(</span>
            <span className="token punctuation">)</span>{" "}
            <span className="token punctuation">&#123;</span>
          </span>
          <span className="code-line">
            {" "}
            <span className="token keyword control-flow">return</span>{" "}
            <span className="token punctuation">(</span>
          </span>
          <span className="code-line">
            {" "}
            <span className="token tag">
              <span className="token tag">
                <span className="token punctuation">&lt;</span>div
              </span>
              <span className="token punctuation">&gt;</span>
            </span>
            <span className="token plain-text"></span>
          </span>
          <span className="code-line">
            <span className="token plain-text"> </span>
            <span className="token tag">
              <span className="token tag">
                <span className="token punctuation">&lt;</span>
                <span className="token class-name">Alert</span>
              </span>
            </span>
          </span>
          <span className="code-line">
            <span className="token tag">
              {" "}
              <span className="token attr-name">confirmText</span>
              <span className="token attr-value">
                <span className="token punctuation attr-equals">&#61;</span>
                <span className="token punctuation">"</span>确定按钮
                <span className="token punctuation">"</span>
              </span>
            </span>
          </span>
          <span className="code-line">
            <span className="token tag">
              {" "}
              <span className="token attr-name">content</span>
              <span className="token attr-value">
                <span className="token punctuation attr-equals">&#61;</span>
                <span className="token punctuation">"</span>
                这个对话框只有两个个按钮，单击“确定按钮”后，此对话框将关闭。用作通知用户重要信息。
                <span className="token punctuation">"</span>
              </span>
            </span>
          </span>
          <span className="code-line">
            <span className="token tag">
              {" "}
              <span className="token punctuation">/&gt;</span>
            </span>
            <span className="token plain-text"></span>
          </span>
          <span className="code-line">
            <span className="token plain-text"> </span>
            <span className="token tag">
              <span className="token tag">
                <span className="token punctuation">&lt;/</span>div
              </span>
              <span className="token punctuation">&gt;</span>
            </span>
          </span>
          <span className="code-line">
            {" "}
            <span className="token punctuation">)</span>
          </span>
          <span className="code-line">
            {" "}
            <span className="token punctuation">&#125;</span>
          </span>
          <span className="code-line">
            <span className="token punctuation">&#125;</span>
          </span>
          <span className="code-line">
            <span className="token keyword module">export</span>{" "}
            <span className="token keyword module">default</span>{" "}
            <span className="token maybe-class-name">Demo</span>
            <span className="token punctuation">;</span>
          </span>
        </code>
        <div className={`copied`}>
          <svg
            className={`octicon-copy`}
            aria-hidden={`true`}
            viewBox={`0 0 16 16`}
            fill={`currentColor`}
            height={12}
            width={12}
          >
            <path
              fillRule={`evenodd`}
              d={`M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z`}
            ></path>
            <path
              fillRule={`evenodd`}
              d={`M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z`}
            ></path>
          </svg>
          <svg
            className={`octicon-check`}
            aria-hidden={`true`}
            viewBox={`0 0 16 16`}
            fill={`currentColor`}
            height={12}
            width={12}
          >
            <path
              fillRule={`evenodd`}
              d={`M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z`}
            ></path>
          </svg>
        </div>
      </pre>
    </React.Fragment>
  ),
};

const importBaseCodeRender = {
  4: BaseCodeRenderComponent4,
};

const dependenciesObject = { 4: ["react", "uiw"] };

export default () => {
  return (
    <div className="wmde-markdown wmde-markdown-color">
      <MdCodePreview
        copyNodes={importCopyNodeRender["4"]}
        properties={{
          className: ["language-jsx", "code-highlight"],
          bgWhite: true,
          codeSandbox: true,
          codePen: true,
        }}
        comments={{
          title: importHeadRender["4"],
          description: importDescRender["4"],
        }}
        dependencies={(dependenciesObject && dependenciesObject["4"]) || []}
        code={importCodeRender["4"]}
      >
        {BaseCodeRenderComponent4()}
      </MdCodePreview>
    </div>
  );
};
