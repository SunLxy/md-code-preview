import React from "react";
import "./markdown.less";

function Base13() {
  "use strict";

  var _uiw = require("uiw");

  var _react = _interopRequireDefault(require("react"));

  var _Demo = _interopRequireDefault(require("@/app/Preview/Demo.tsx"));

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  /**
   * @title: 基础按钮组件
   * @description: 按钮有类型：主按钮、次按钮、虚线按钮、文本按钮和链接按钮
   */
  var _default = function _default() {
    window.HOSTY = 123243;
    return /*#__PURE__*/ _react["default"].createElement(
      "div",
      null,
      /*#__PURE__*/ _react["default"].createElement(_Demo["default"], null),
      /*#__PURE__*/ _react["default"].createElement(
        "button",
        null,
        "\u6309\u94AE",
        window.a
      ),
      /*#__PURE__*/ _react["default"].createElement(
        _uiw.Button,
        null,
        "\u6309\u94AE2"
      )
    );
  };

  return _react["default"].createElement(_default);
}
function Base49() {
  "use strict";

  var _react = _interopRequireDefault(require("react"));

  var _Demo = _interopRequireDefault(require("@/app/Preview/Demo.tsx"));

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var Com = function Com(props) {
    window.HOSTY = 322;
    return /*#__PURE__*/ _react["default"].createElement(
      "div",
      null,
      /*#__PURE__*/ _react["default"].createElement(
        "div",
        null,
        "\u5475\u5475\u5475\u5475\u5475\u5475\u5475"
      ),
      /*#__PURE__*/ _react["default"].createElement(_Demo["default"], null)
    );
  };

  var _default = Com;
  return _react["default"].createElement(_default);
}

const Code = (props) => {
  console.log(props);

  return <div>{props.children}</div>;
};

export default () => {
  return (
    <div className="wmde-markdown wmde-markdown-color">
      <p>
        Use an example of <code>Markdown</code>.
      </p>
      <Code
        className="language-jsx"
        copyNode={`/**
 * @title: 基础按钮组件
 * @description: 按钮有类型：主按钮、次按钮、虚线按钮、文本按钮和链接按钮
 */
import { Button } from "uiw";
import React from "react";
import Demo from "@/app/Preview/Demo.tsx";
export default () => {
  window.HOSTY = 123243;
  return (
    <div>
      <Demo />
      <button>按钮{window.a}</button>
      <Button>按钮2</Button>
    </div>
  );
};`}
        desc={
          <React.Fragment>
            <p>动画名称</p>
            <blockquote>
              <ol>
                <li>测试没人</li>
              </ol>
            </blockquote>
            <blockquote>
              <p>测试没人</p>
            </blockquote>
            <p>
              <a href="http://www.baidu.com">原地址</a>
            </p>
          </React.Fragment>
        }
        head={
          <React.Fragment>
            <h2 id="张三">
              <a ariaHidden="true" tabIndex={-1} href="#张三">
                <span className="icon icon-link"></span>
              </a>
              张三
            </h2>
          </React.Fragment>
        }
        code={
          <React.Fragment>
            <code className="language-jsx code-highlight">
              <span className="code-line">
                <span className="token comment">/**</span>
              </span>
              <span className="code-line">
                <span className="token comment"> * @title: 基础按钮组件</span>
              </span>
              <span className="code-line">
                <span className="token comment">
                  {" "}
                  * @description:
                  按钮有类型：主按钮、次按钮、虚线按钮、文本按钮和链接按钮
                </span>
              </span>
              <span className="code-line">
                <span className="token comment"> */</span>
              </span>
              <span className="code-line">
                <span className="token keyword module">import</span>{" "}
                <span className="token imports">
                  <span className="token punctuation">&#123;</span>{" "}
                  <span className="token maybe-class-name">Button</span>{" "}
                  <span className="token punctuation">&#125;</span>
                </span>{" "}
                <span className="token keyword module">from</span>{" "}
                <span className="token string">"uiw"</span>
                <span className="token punctuation">;</span>
              </span>
              <span className="code-line">
                <span className="token keyword module">import</span>{" "}
                <span className="token imports">
                  <span className="token maybe-class-name">React</span>
                </span>{" "}
                <span className="token keyword module">from</span>{" "}
                <span className="token string">"react"</span>
                <span className="token punctuation">;</span>
              </span>
              <span className="code-line">
                <span className="token keyword module">import</span>{" "}
                <span className="token imports">
                  <span className="token maybe-class-name">Demo</span>
                </span>{" "}
                <span className="token keyword module">from</span>{" "}
                <span className="token string">"@/app/Preview/Demo.tsx"</span>
                <span className="token punctuation">;</span>
              </span>
              <span className="code-line">
                <span className="token keyword module">export</span>{" "}
                <span className="token keyword module">default</span>{" "}
                <span className="token punctuation">(</span>
                <span className="token punctuation">)</span>{" "}
                <span className="token arrow operator">&#61;&gt;</span>{" "}
                <span className="token punctuation">&#123;</span>
              </span>
              <span className="code-line">
                {" "}
                <span className="token dom variable">window</span>
                <span className="token punctuation">.</span>
                <span className="token constant">HOSTY</span>{" "}
                <span className="token operator">&#61;</span>{" "}
                <span className="token number">123243</span>
                <span className="token punctuation">;</span>
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
                    <span className="token class-name">Demo</span>
                  </span>{" "}
                  <span className="token punctuation">&#47;&gt;</span>
                </span>
                <span className="token plain-text"></span>
              </span>
              <span className="code-line">
                <span className="token plain-text"> </span>
                <span className="token tag">
                  <span className="token tag">
                    <span className="token punctuation">&lt;</span>button
                  </span>
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token plain-text">按钮</span>
                <span className="token punctuation">&#123;</span>
                <span className="token dom variable">window</span>
                <span className="token punctuation">.</span>
                <span className="token property-access">a</span>
                <span className="token punctuation">&#125;</span>
                <span className="token tag">
                  <span className="token tag">
                    <span className="token punctuation">&lt;&#47;</span>button
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
                    <span className="token class-name">Button</span>
                  </span>
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token plain-text">按钮2</span>
                <span className="token tag">
                  <span className="token tag">
                    <span className="token punctuation">&lt;&#47;</span>
                    <span className="token class-name">Button</span>
                  </span>
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token plain-text"></span>
              </span>
              <span className="code-line">
                <span className="token plain-text"> </span>
                <span className="token tag">
                  <span className="token tag">
                    <span className="token punctuation">&lt;&#47;</span>div
                  </span>
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
              <span className="code-line">
                {" "}
                <span className="token punctuation">)</span>
                <span className="token punctuation">;</span>
              </span>
              <span className="code-line">
                <span className="token punctuation">&#125;</span>
                <span className="token punctuation">;</span>
              </span>
            </code>
          </React.Fragment>
        }
      >
        {Base13()}
      </Code>
      <pre className="language-js">
        <code className="language-js code-highlight">
          <span className="code-line">
            <span className="token keyword module">export</span>{" "}
            <span className="token keyword module">default</span>{" "}
            <span className="token punctuation">(</span>
            <span className="token punctuation">)</span>{" "}
            <span className="token arrow operator">&#61;&gt;</span>{" "}
            <span className="token punctuation">&#123;</span>
          </span>
          <span className="code-line">
            {" "}
            <span className="token keyword control-flow">return</span>{" "}
            <span className="token operator">&lt;</span>div
            <span className="token operator">&gt;</span>
            <span className="token number">233</span>
            <span className="token operator">&lt;</span>
            <span className="token operator">/</span>div
            <span className="token operator">&gt;</span>
            <span className="token punctuation">;</span>
          </span>
          <span className="code-line">
            <span className="token punctuation">&#125;</span>
            <span className="token punctuation">;</span>
          </span>
        </code>
      </pre>
      <pre className="language-ts">
        <code className="language-ts code-highlight">
          <span className="code-line">
            <span className="token keyword">interface</span>{" "}
            <span className="token class-name">
              <span className="token constant">A</span>
            </span>{" "}
            <span className="token punctuation">&#123;</span>
          </span>
          <span className="code-line">
            {" "}
            s<span className="token operator">:</span>{" "}
            <span className="token builtin">string</span>
            <span className="token punctuation">;</span>
          </span>
          <span className="code-line">
            <span className="token punctuation">&#125;</span>
          </span>
        </code>
      </pre>
      <Code
        className="language-tsx"
        copyNode={`/**
 * @title: 普通的tsx文件解析
 * @description:  按钮有类型：主按钮、次按钮、虚线按钮、文本按钮和链接按钮
 */
interface A {
  s: string;
}
import Demo from "@/app/Preview/Demo.tsx";
const Com = (props: A) => {
  window.HOSTY = 322;

  return (
    <div>
      <div>呵呵呵呵呵呵呵</div>
      <Demo />
    </div>
  );
};
export default Com;`}
        desc={
          <React.Fragment>
            <p>动画名称 21212</p>
          </React.Fragment>
        }
        head={
          <React.Fragment>
            <h2 id="张三-1">
              <a ariaHidden="true" tabIndex={-1} href="#张三-1">
                <span className="icon icon-link"></span>
              </a>
              张三 1
            </h2>
          </React.Fragment>
        }
        code={
          <React.Fragment>
            <code className="language-tsx code-highlight">
              <span className="code-line">
                <span className="token comment">/**</span>
              </span>
              <span className="code-line">
                <span className="token comment">
                  {" "}
                  * @title: 普通的tsx文件解析
                </span>
              </span>
              <span className="code-line">
                <span className="token comment">
                  {" "}
                  * @description:
                  按钮有类型：主按钮、次按钮、虚线按钮、文本按钮和链接按钮
                </span>
              </span>
              <span className="code-line">
                <span className="token comment"> */</span>
              </span>
              <span className="code-line">
                <span className="token keyword">interface</span>{" "}
                <span className="token class-name">
                  <span className="token constant">A</span>
                </span>{" "}
                <span className="token punctuation">&#123;</span>
              </span>
              <span className="code-line">
                {" "}
                s<span className="token operator">:</span>{" "}
                <span className="token builtin">string</span>
                <span className="token punctuation">;</span>
              </span>
              <span className="code-line">
                <span className="token punctuation">&#125;</span>
              </span>
              <span className="code-line">
                <span className="token keyword">import</span>{" "}
                <span className="token imports">
                  <span className="token maybe-class-name">Demo</span>
                </span>{" "}
                <span className="token keyword">from</span>{" "}
                <span className="token string">"@/app/Preview/Demo.tsx"</span>
                <span className="token punctuation">;</span>
              </span>
              <span className="code-line">
                <span className="token keyword">const</span>{" "}
                <span className="token function-variable function">Com</span>{" "}
                <span className="token operator">&#61;</span>{" "}
                <span className="token punctuation">(</span>props
                <span className="token operator">:</span>{" "}
                <span className="token constant">A</span>
                <span className="token punctuation">)</span>{" "}
                <span className="token arrow operator">&#61;&gt;</span>{" "}
                <span className="token punctuation">&#123;</span>
              </span>
              <span className="code-line">
                {" "}
                <span className="token dom variable">window</span>
                <span className="token punctuation">.</span>
                <span className="token constant">HOSTY</span>{" "}
                <span className="token operator">&#61;</span>{" "}
                <span className="token number">322</span>
                <span className="token punctuation">;</span>
              </span>
              <span className="code-line"></span>
              <span className="code-line">
                {" "}
                <span className="token keyword">return</span>{" "}
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
                    <span className="token punctuation">&lt;</span>div
                  </span>
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token plain-text">呵呵呵呵呵呵呵</span>
                <span className="token tag">
                  <span className="token tag">
                    <span className="token punctuation">&lt;&#47;</span>div
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
                    <span className="token class-name">Demo</span>
                  </span>{" "}
                  <span className="token punctuation">&#47;&gt;</span>
                </span>
                <span className="token plain-text"></span>
              </span>
              <span className="code-line">
                <span className="token plain-text"> </span>
                <span className="token tag">
                  <span className="token tag">
                    <span className="token punctuation">&lt;&#47;</span>div
                  </span>
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
              <span className="code-line">
                {" "}
                <span className="token punctuation">)</span>
                <span className="token punctuation">;</span>
              </span>
              <span className="code-line">
                <span className="token punctuation">&#125;</span>
                <span className="token punctuation">;</span>
              </span>
              <span className="code-line">
                <span className="token keyword">export</span>{" "}
                <span className="token keyword">default</span>{" "}
                <span className="token maybe-class-name">Com</span>
                <span className="token punctuation">;</span>
              </span>
            </code>
          </React.Fragment>
        }
      >
        {Base49()}
      </Code>
      <h2 id="标题的那个">
        <a ariaHidden="true" tabIndex={-1} href="#标题的那个">
          <span className="icon icon-link"></span>
        </a>
        标题的那个
      </h2>
      <p>动画名称 21212</p>
    </div>
  );
};
