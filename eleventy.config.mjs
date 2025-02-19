import dotenv from 'dotenv';

import markdownit from 'markdown-it';
import markdownit_emoji from 'markdown-it-emoji/light.js';
import markdownit_attrs from 'markdown-it-attrs';
import markdownit_linkattrs from 'markdown-it-link-attributes';
import markdownit_imagefigures from 'markdown-it-image-figures';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

import html_minifier from 'html-minifier';
import glob from 'fast-glob';
import hljs from 'highlight.js';
import eleventySass from '@11tyrocks/eleventy-plugin-sass-lightningcss';

dotenv.config();

const theme = process.env.npm_package_config_theme;


export default async function(eleventyConfig) {
  // Engine: Markdown & plugins
  const Markdown = markdownit({
    html: true,         // Enable HTML tags in source
    breaks: false,       // Convert '\n' in paragraphs into <br>
    linkify: true,      // Autoconvert URL-like text to links
    typographer: true,  // Enable some language-neutral replacement + quotes beautification
    // quotes: ['«\xA0', '\xA0»', '‹\xA0', '\xA0›']
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>';
        } catch (e) { }
      }

      return '';
    }
  })

    .use(markdownit_emoji)
    .use(markdownit_linkattrs, {
      pattern: /^(https?:)?\/\//,
      attrs: {
        target: '_blank',
        rel: 'noopener'
      }
    })
    .use(markdownit_attrs, {
      allowedAttributes: ['id', 'class']
    })
    .use(markdownit_imagefigures, {
      figcaption: "title",
      link: true, // links to the passthrough version of the image
    });

  eleventyConfig.setLibrary('md', Markdown);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
      // which file extensions to process
      extensions: 'html',
      // optional, output image formats
      formats: ['jpg', 'webp', 'avif'],
      // optional, output image widths
      widths: ['auto', 400, 550, 640, 800],
      // optional, attributes assigned on <img> override these values.
      defaultAttributes: {
          loading: 'lazy',
          // sizes: '100vw',
          decoding: 'async',
      },
  });

  // CSS processor
  // TODO: Want to process basic css too.  Is it worth having a non-min version?
  eleventyConfig.addPlugin(eleventySass);

  // Engine: Nunjucks
  eleventyConfig.setNunjucksEnvironmentOptions({ trimBlocks: true, lstripBlocks: true });


  // Filters
  for (const file of glob.sync('./site/_filters/*.js')) {
    const { default: filters } = await import('./' + file);
    for (const [name, filter] of Object.entries(filters)) {
      eleventyConfig.addFilter(name, filter);
    }
  }

  // Shortcodes
  for (const file of glob.sync('./site/_shortcodes/*.js')) {
    const { default: shortcodes } = await import('./' + file);
    for (const [name, code] of Object.entries(shortcodes)) {
      eleventyConfig.addShortcode(name, code);
    }
  }

  // PairedShortcodes
  for (const file of glob.sync('./site/_pairedShortcodes/*.js')) {
    const { default: shortcodes } = await import('./' + file);
    for (const [name, code] of Object.entries(shortcodes)) {
      eleventyConfig.addPairedShortcode(name, code);
    }
  }

  // Collections
  eleventyConfig.addCollection('pages', (collectionApi) => collectionApi.getFilteredByGlob('./site/pages/**/*.md'));
  eleventyConfig.addCollection('posts', (collectionApi) => collectionApi.getFilteredByGlob('./site/posts/**/*.md'));
  eleventyConfig.addCollection("categories", function(collectionApi) {
    let categories = new Set();
    let posts = collectionApi.getFilteredByTag('post');
    posts.forEach(p => {
        let cats = p.data.categories;
        cats.forEach(c => categories.add(c));
    });
    return Array.from(categories);
});
    eleventyConfig.addCollection('tagList', collection => {
        const tagsSet = new Set();
        collection.getAll().forEach(item => {
            if (!item.data.tags) return;
            item.data.tags.filter(tag => !['posts', 'all'].includes(tag)).forEach(tag => tagsSet.add(tag));
        });
        return Array.from(tagsSet).sort();
    });


  if (process.env.NODE_ENV === 'production') {

    // Transform : html-minifier
    eleventyConfig.addTransform('html-minify', async (content, outputPath) => {
      if (outputPath && /(\.html|\.xml)$/.test(outputPath)) {
        return html_minifier.minify(content, {
          useShortDoctype: true,
          minifyJS: true,
          collapseWhitespace: true,
          keepClosingSlash: true
        });
      }
      return content;
    });

  }


  // Passthrough
  eleventyConfig.addPassthroughCopy({ 'site/static': '.' });

  // pass through original images, for full sized links
  eleventyConfig.addPassthroughCopy("site/posts/**/*.jpg");
  eleventyConfig.addPassthroughCopy("site/posts/**/*.png");
  eleventyConfig.addPassthroughCopy("site/posts/**/*.svg");

  // eleventyConfig.addPassthroughCopy({ 'node_modules/@fontsource/{abril-fatface,pt-sans}/files/{abril-fatface,pt-sans}-latin-{400,700}*.woff2': 'css/files' });
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');

  // Globals
  eleventyConfig.addGlobalData('isProduction', process.env.NODE_ENV === 'production');

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: '<!-- more -->'
  });


  return {
    templateFormats: ['md', 'njk', 'liquid'],
    markdownTemplateEngine: 'njk',

    dir: {
      input: './site',
      includes: `_themes/${theme}/layouts`,
      output: './public'
    }
  };
};
