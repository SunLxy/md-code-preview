/*
 * @Description: markdown 转化
 */
import { VFile } from "vfile";
import { unified, PluggableList, Processor } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

import gfm from "remark-gfm";
import slug from "rehype-slug";
import headings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeAttrs from "rehype-attr";
import rehypePrism from "rehype-prism-plus";
import rehypeRewrite from "rehype-rewrite";
import { rehypeRewriteHandle } from "./rewrite";
import { MarkDownTreeType, GetProcessorOptionsType } from "./interface";
export const getProcessor = (options: GetProcessorOptionsType = {}) => {
  const rehypePlugins: PluggableList = [
    ...(options.rehypePlugins || []),
    [rehypePrism, { ignoreMissing: true }],
    rehypeRaw,
    slug,
    headings,
    [rehypeRewrite, { rewrite: rehypeRewriteHandle }],
    [rehypeAttrs, { properties: "attr" }],
  ];
  const remarkPlugins = [...(options.remarkPlugins || []), gfm];
  const processor = unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype, {
      ...(options.remarkRehypeOptions || {}),
      allowDangerousHtml: true,
    })
    .use(rehypePlugins || []);
  return processor;
};

/**
 * @description: markdown 字符串 转换
 * @param {string} scope  读取markdown字符串
 * @param {Processor} processor Processor
 */
export const transformMarkdown = (scope: string, processor: Processor) => {
  const file: any = new VFile();
  file.value = scope;
  const child = processor.parse(file) as MarkDownTreeType;
  return {
    child,
    file,
  };
};
