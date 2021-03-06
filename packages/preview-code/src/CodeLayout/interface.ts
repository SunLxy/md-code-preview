import React from "react";

export interface CodeProps {
  /** 原始 代码块 渲染**/
  code?: React.ReactNode;
  /** 代码块字符串 **/
  copyNodes?: string;
  /**语言**/
  language?: string;
  /* 自定义操作按钮 **/
  customButton?: React.ReactNode;
  /** 展示代码块内边距 **/
  codePadding?: number;
}

export interface PreviewProps extends CodeProps {
  prefixCls?: string;
  previewBodyClassName?: string;
  className?: string;
  children?: React.ReactNode;
  /** 只显示效果 **/
  noCode?: boolean;
  /** 是否需要边框 */
  bordered?: boolean;
}
