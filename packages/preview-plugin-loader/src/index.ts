import { markdownParse, lastReturn } from "./utils";
export { default as MdCodePreviewPlugin } from "./plugins";
export * from "./utils";

export default function (source: string) {
  const options = this.getOptions();
  const isInterval = Reflect.has(options || {}, "isInterval")
    ? Reflect.get(options || {}, "isInterval")
    : true;
  // const { filesValue, ignoreRows } = markdownParse(
  //   source,
  //   options.lang || ["jsx", "tsx"],
  //   isInterval
  // );

  const results = lastReturn(source, options.lang || ["jsx", "tsx"], {
    isInterval,
  });
  return results;
  // return `
  // import React from "react"
  // import { Button } from "uiw";
  // interface A {
  //   s: string;
  // }
  // export default (props:A)=>{
  //   return <div style={{background:"red"}} ><Button>点击按钮32323</Button></div>
  // }
  // `
  // return {
  //   source,
  //   filesValue,
  //   ignoreRows,
  // };
}
