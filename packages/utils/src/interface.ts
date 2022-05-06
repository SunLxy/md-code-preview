export * from "md-unified-utils";
import { GetProcessorOptionsType } from ".";
export type StartAndEndType = {
  /** 列 **/
  column: number;
  /** 位移 **/
  offset: number;
  /** 行 **/
  line: number;
};

export type PositionType = {
  /* 开始位置 **/
  start: StartAndEndType;
  /* 结束位置 **/
  end: StartAndEndType;
};

export type IgnoreRows = {
  /** 开始行 **/
  start: number;
  /** 结束行 **/
  end: number;
};

export type FilesValueItemType = {
  value?: string;
  /** 转换成 es5 的代码 **/
  transform?: string;
  /** 拼接好的标签字符串 --- 简介部分 **/
  desc?: string;
  /** 拼接好的标签字符串 --- 标题部分  **/
  head?: string;
  /** 拼接好的标签字符串 --- 代码块展示部分字符串  **/
  code?: string;
  /** 代码块字符串 */
  copyNode?: string;
  /** 标题 */
  title?: string;
  /** 语言 */
  lang?: string;
  /** 依赖部分 **/
  dependencies?: {
    /** 移出import引用，拼接用于渲染部分的代码 **/
    code?: string;
    /** 依赖 **/
    deps?: DepsType;
    /** 默认导出名 通过 as 别名 ，例如：`import * as Dos "react"` **/
    depNamespaces?: DepNamespacesType;
    /** 其他直接导入的依赖  ，例如：`import "./a.css"` **/
    depDirects?: DepNamespacesType;
    /* 引入的依赖包名 **/
    depsName?: string[];
  };
};

export type FilesValueType = Record<number, FilesValueItemType>;

export type StepOneReturn = {
  /** 忽略的数据 **/
  ignoreRows: IgnoreRows[];
  /** 行对应的数据 **/
  filesValue: FilesValueType;
};

export type MarkDownTreeType = {
  children: {
    /** 语言 **/
    lang: string;
    meta?: any;
    /** 类型 **/
    type: string;
    /** 内容 **/
    value: string;
    /** 位置信息 **/
    position: PositionType;
    /** 子集 **/
    children?: MarkDownTreeType["children"];
  }[];
  position: PositionType;
  type: string;
};

export type MarkDownHastNodeTreeType = {
  /** 类型 **/
  type: string;
  data?: Record<string, unknown>;
  /** 标签名称 */
  tagName: string;
  /** 属性 */
  properties: Record<string, unknown>;
  /** 位置信息 */
  position: PositionType;
  /** 内容 */
  value: string;
  /** 子集 */
  children: MarkDownHastNodeTreeType[];
};

export type OtherProps = {
  /** 是否需要解析代码块以上到标题之间的内容并合并到展示组件中 **/
  isInterval?: boolean;
  /** 是否是所属的行赋值还是数组下标进行赋值 ***/
  isLine?: boolean;
  /** 是否需要传递依赖数据 **/
  isDeps?: boolean;
  /** 预览组件地址 可以是包名称/或者`@/component/Preview`这种地址 **/
  mdCodePreviewPath?: string;
  /** 转换 markdown 字符串配置参数 **/
  options?: GetProcessorOptionsType;
  codePenOptions?: {
    /** 设置 codepen 需要的参数-- css 样式文件引用 **/
    css?: string;
    /** 设置 codepen 需要的参数--- 浏览器中预览需要的 umd 包 **/
    js?: string;
    /**设置 codepen 需要的参数--- 需要代码块中排除注释的包引用 **/
    includeModule?: string[];
  };
};

/** 依赖 **/
export type DepsType = Record<
  string,
  {
    /** 默认导出名，例如：`import React from "react"` **/
    default: string;
    /** 其他的导出 ，例如：`import { useState,useEffect } from "react"` **/
    other: string[];
  }
>;
/** 默认导出 别名依赖 **/
export type DepNamespacesType = Record<string, string>;

/** 获取配置参数 **/
export interface GetConfigOptions {
  /**代码块**/
  code?: string;
  /**标题**/
  title?: string;
  /**codepen 中需要的 css 样式文件**/
  css?: string;
  /**codepen 中需要的 js 文件**/
  js?: string;
  /**codepen 排除不需要注释 import 引入的包名**/
  includeModule?: string[];
  /**代码块 所有依赖名称 **/
  dependencies?: string[];
}
