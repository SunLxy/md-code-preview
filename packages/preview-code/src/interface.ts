import React from "react";

export interface RenderProps {
  previewBodyClassName?: string;
  /**
   * 通过 import() 的方式引入组件，可以直接返回一个组件
   * **/
  component?: () =>
    | Promise<{ default: React.ComponentType<any> }>
    | React.ReactNode;
  children?: React.ReactNode;
}

export type CommentsType = {
  /** 标题 **/
  title?: React.ReactNode;
  /** 简介 **/
  description?: React.ReactNode;
  [k: string]: React.ReactNode;
};

export interface CodeProps {
  /** 原始 代码块 渲染**/
  code?: React.ReactNode;
  /** 解析出的 标题和 简介部分 **/
  comments?: CommentsType;
  /** 代码块字符串 **/
  copyNodes?: string;
}

export interface PreviewProps extends RenderProps, CodeProps {
  className?: string;
  /** 是否需要代码块下方的边距  */
  isSpacing?: boolean;
  /** 通过 <!--rehype:bgWhite=true&codeSandbox=true&codePen=true--> 传递的参数 **/
  properties?: Record<string, unknown>;
  /** 当前code块，依赖的包名称  **/
  dependenciesArr?: string[];
}
