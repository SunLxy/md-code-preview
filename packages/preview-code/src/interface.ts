import React from "react";

export interface RenderProps {
  previewBodyClassName?: string;
  /**
   * 进行转换后的代码
   * 注意：不与 getComponent 一起使用，当传递`getComponent`时，直接使用 getComponent 返回展示，transform不做处理
   *  **/
  transform?: string;
  /**
   *  渲染依赖
   * 当只使用 `transform` 转换的代码展示时使用
   * **/
  dependencies?: Record<string, any>;
  /**
   * 通过 import() 的方式引入组件，可以直接返回一个组件
   * **/
  getComponent?: () =>
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
  /** 解析出的注释内容 **/
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
