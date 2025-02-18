require('dotenv').config();


const
  glob = require('fast-glob'),
  hljs = require('highlight.js'),
  eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");

const
  projectName = process.env.npm_package_name,
  theme = process.env.npm_package_config_theme;


module.exports = async function(eleventyConfig) {
  const { eleventyImageTransformPlugin } = await import("@11ty/eleventy-img");

  // Engine: Markdown & plugins
  const Markdown = require('markdown-it')({
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
    .use(require('markdown-it-emoji/light'))
    .use(require('markdown-it-link-attributes'), {
      pattern: /^(https?:)?\/\//,
      attrs: {
        target: '_blank',
        rel: 'noopener'
      }
    })
    .use(require('markdown-it-attrs'), {
      allowedAttributes: ['id', 'class']
    })
    .use(require('markdown-it-image-figures'), {
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
  glob.sync('./site/_filters/*.js').forEach(file => {
    let filters = require('./' + file);
    Object.keys(filters).forEach(name => eleventyConfig.addFilter(name, filters[name]));
  });

  // Shortcodes
  glob.sync('./site/_shortcodes/*.js').forEach(file => {
    let shortcodes = require('./' + file);
    Object.keys(shortcodes).forEach(name => eleventyConfig.addShortcode(name, shortcodes[name]));
  });

  // PairedShortcodes
  glob.sync('./site/_pairedShortcodes/*.js').forEach(file => {
    let pairedShortcodes = require('./' + file);
    Object.keys(pairedShortcodes).forEach(name => eleventyConfig.addPairedShortcode(name, pairedShortcodes[name]));
  });


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
        return require('html-minifier').minify(content, {
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
