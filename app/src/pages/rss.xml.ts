import type { APIRoute } from "astro";

import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import MarkdownIt from "markdown-it";
import sanitize from "sanitize-html";

const parser = new MarkdownIt();

export const GET: APIRoute = async (context) => {
  const posts = await getCollection("blog");
  return rss({
    title: "deminearchiver",
    description: "",
    // stylesheet: "/rss.xsl",
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.createdAt,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      content: sanitize(parser.render(post.body ?? ""), {
        allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
      }),
      author: post.data.authors.map((author) => author.name).join(", "),
    })),
    site: context.site!,
  });
};
