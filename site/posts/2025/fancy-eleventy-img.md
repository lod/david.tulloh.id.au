---
title: Nice images in Eleventy
date: 2025-02-22
tags: ["javascript", "blog"]
category: Blog
---

## Requirements:

* Image files get displayed on blog pages
* Images are specified in a markdown file using markdown format
* Images have multiple size options for srcset optimal loading
* Images have alt text for screen readers
* Images have a caption, displayed under the image
* Don't want to write/maintain much code

## Minimal solution, for your eleventy.config.js:

```javascript
import markdownit from 'markdown-it';
import markdownit_imagefigures from 'markdown-it-image-figures';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

export default async function(eleventyConfig) {
  const Markdown = markdownit()
    .use(markdownit_imagefigures, {
      figcaption: "title",
      link: true, // links to the passthrough version of the image
    });
  eleventyConfig.setLibrary('md', Markdown);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
      extensions: 'html',    // which file extensions to process
      formats: ['webp'],     // output image formats
      widths: ['auto', 400], // output image widths
      defaultAttributes: {   // extra attributes for <img>
          loading: 'lazy',
          decoding: 'async',
      },
  });

  // pass through original images, for full sized links
  eleventyConfig.addPassthroughCopy("site/**/*.jpg");
  eleventyConfig.addPassthroughCopy("site/**/*.png");
  eleventyConfig.addPassthroughCopy("site/**/*.svg");

  return {
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: 'njk',
    dir: {
      input: './site',
      output: './public'
    }
  };
};
```

![Crumbly biscuits in a paper lined container](/posts/images/wp/butterhorns.jpg "The image and caption look like this")

This code and all the other examples can be found at https://github.com/lod/eleventy-fancy-figure-img

This is [my full eleventy.config.mjs](https://github.com/lod/david.tulloh.id.au/blob/b4b0260b96475175e03820646bb0df9f7678adea/eleventy.config.mjs), which shows this code integrated with a pile of other stuff.  It's sort of awful but it may help as an example.

Disclaimer: My javascript is very rusty, my eleventy knowledge is slim, and I just wanted to cobble something together without having to do work.  I'm sure someone could do better, I just couldn't find it to crib from.

## Outstanding Issues:

* I have two copies of the full original image
* It's a bit messy
* The full image link is a touch ugly, could add a nicer html viewer
* The caption isn't linked, I initially thought it should be, now I'm less sure
* SVG images don't work, but I don't think that is related

## Alternatives:

* I could change the eleventy-img naming scheme to not use a hash, which would allow me to link to a predictable name.  But the markdown-it-image-figures library doesn't have a method to feed in a custom name.
* I could use the eleventy-img name generator to get the full size name and wrap my own link.  But that would involve writing code.
* There are also so very many alternative image libraries, a different mix could be used.
* I could also extract the title attribute from the image to generate the caption, either with an eleventy transformation step or in client side javascript.


# Detailed introduction

This new blog runs Eleventy (https://www.11ty.dev/).  I previously used Wordpress and wanted to try something different, the online consensus seemed to be that eleventy was the bee's knees.

This was a mistake.  I would not recommend eleventy to anyone wanting to start a blog.  I got it working to a level that I'm mostly satisfied by and publishing with a git push is kinda cool.  But it was a complete pain to set up and took a considerable period of time and effort.  If you just want a blog then use Wordpress.  If you want to play around solving complex technical problems for a few days, then eleventy is great.


Eleventy's blessing and curse is that it is hugely customisable.  There are so many different ways to do it, the project is even alternatively referred to as Eleventy or 11ty in different places.

Because there are so many ways to do things it is very hard to do anything easily.  Even using examples is messy because they layer so deeply.  I decided to use the [Eleventy Classic Blog Starter](https://github.com/TigersWay/eleventy-classic-blog-starter/) as my initial template, it's reasonably good, got me started though I increasingly customized it as I went.  I found another example that I tried to lift portions of but failed.  Because the template I chose used nunjucks as the templating language and the second used liquid as the templating language and the two can't interoperate, at least I couldn't get them to do so.  So I had to actually write code rather than copy/paste :(.

This multiple ways of doing things is everywhere, so stitching together examples is increasingly perilous.  Even the official documentation provides examples in both the CommonJS and ESM syntax, other places online use either one, I'm fairly sure I'm using both in my system because I have no idea what I'm doing.  Using eleventy increasingly forced me to learn modern Javascript, which may not be a bad idea, but wasn't my goal.

I'm normally a fan of multiple approaches, as a frustrated Perl programmer TMTOWTDI was my mantra.  I'm sure if my Javascript was solid and up to date I would have understood the nuances of the code I was attempting to copy/paste and it would have been far less of an issue.  It's just I wanted to restart my blog, not relearn Javascript.

# Fundamentals

Eleventy is a template orchestration system.

It's basically template agnostic, anything that will generate html is great.  In our cut down example we are using markdown and nunjucks.  The eleventy docs list 11 different supported template systems, plus variants like Javascript supporting JSX and Typescript.  It's plugin based though, and a [npm search for eleventy-plugin](https://www.npmjs.com/search?q=eleventy-plugin) gives over 1000 results, which is when npm stops bothering to count.

Templates can be nested and intertwine.  For example our markdown content is wrapped in a nunjucks layout template.  Eleventy has a clever data cascade to manage this, it is [poorly documented in their docs](https://www.11ty.dev/docs/advanced-order/).

Templating itself can also be complex. The markdown processing is done by markdown-it, which seems to be the Javascript standard library.  This library also has a plugin system for syntax extensions, so each plugin can hook at different points to morph the markdown or intermediate html.

Once the templating is done we have a collection html documents.  Then there is a transformation stage, a series of transformations, typically from plugins is supplied.

There is a data flow diagram in the [Data flow sequence section](#data-flow-sequence) at the end of this post.

(I suspect eleventy can probably be tweaked to generate non-html documents, it feels like that kind of system, but that's another layer of complication I don't want to go anywhere near.)

# Image transformation data flow

We are going to transform an example image from (weekly-wrap-11-17-april)[/weekly-wrap-11-17-april/]

The original line is in markdown.

```markdown
![Crumbly biscuits in a paper lined container](./butterhorns.jpg "Delicious butterhorns")
```

The rough desired outcome is

```html
<a href="./butterhorns.jpg">
  <figure>
    <img alt="Crumbly biscuits in a paper lined container" src="./butterhorns.jpg" loading="lazy" srcset="..." sizes="auto"/>
    <figcaption>Delicious butterhorns</figcaption>
  </figure>
</a>
```

I'm going to introduce the steps in an iterative order because it makes more sense to build up the layers.  I'll summarise with the final sequential data flow.

## Markdown processing

Basic first step, we want to introduce markdown-it to convert the markdown to html.

```javascript
import markdownit from 'markdown-it';

export default async function(eleventyConfig) {
  const Markdown = markdownit();
  eleventyConfig.setLibrary('md', Markdown);

  return {
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: 'njk',
    dir: {
      input: './site',
      output: './public'
    }
  };
};
```

produces

```html
<img src="./butterhorns.jpg" alt="Crumbly biscuits in a paper lined container" title="Delicious butterhorns">
```

<div class="iframe-container" style="padding-top: 79%;">
<iframe title="Stage1 markdown" src="/2025/fancy-eleventy-img/stage1-markdown.html"></iframe>
</div>


## Image processing

Second we introduce eleventy-img.  There are a lot of image processing alternatives for eleventy, when I did a google search I got about six decent options I reviewed, every single one of them was based around a different library.

The initial starter I chose used [markdown-it-eleventy-img](https://github.com/solution-loisir/markdown-it-eleventy-img), which was ok.  I switched to [@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/) as it seemed like the newer recommended and officially supported option. It actually turned out that markdown-it-eleventy-img was calling @11ty/eleventy-img from the markdown processing stage, I switched to using a eleventy-img supplied hook to call it from the transformation stage.

@11ty/eleventy-img runs after templating and searches for img tags.  It takes the image files specified and converts them into different desired formats and sizes.  It then rewrites the img tag to have the srcset list of different generated sizes, this allows the browser to choose the best image.  It also adds a picture tag layer for multiple format selection by the browser if required.

This plugin basically gives you responsive images very easily.

One downside is that it changes the filename in the process.

(As a side note one of the reasons why the examples on the page are in iframes is because if I inline the html in the markdown then eleventy-img will find and transform the image tags. I could exempt them with an eleventy:ignore attribute but iframes provide more confidence.)


```javascript
import markdownit from 'markdown-it';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

export default async function(eleventyConfig) {
  const Markdown = markdownit();
  eleventyConfig.setLibrary('md', Markdown);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
      extensions: 'html',          // which file extensions to process
      formats: ['jpeg', 'webp'],   // output image formats
      widths: ['auto', 400],       // output image widths
      defaultAttributes: {         // extra attributes for <img>
          loading: 'lazy',
          decoding: 'async',
      },
      transformOnRequest: false    // make dev look like prod for examples, you probably don't want this
  });

  return {
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: 'njk',
    dir: {
      input: './site',
      output: './public'
    }
  };
};
```

```html
<div role="main" class="content container">
<p>
  <picture>
    <source type="image/webp" srcset="/img/QPKmYeJmdi-400.webp 400w, /img/QPKmYeJmdi-1024.webp 1024w" sizes="auto">
    <img src="/img/QPKmYeJmdi-400.jpeg"
         loading="lazy" decoding="async"
         alt="Crumbly biscuits in a paper lined container"
         title="Delicious butterhorns"
         width="1024" height="747"
         srcset="/img/QPKmYeJmdi-400.jpeg 400w, /img/QPKmYeJmdi-1024.jpeg 1024w" sizes="auto">
  </picture>
</p>
```

<div class="iframe-container" style="padding-top: 79%;">
<iframe title="Stage2 eleventy-img" src="/2025/fancy-eleventy-img/stage2-eleventyimg.html"></iframe>
</div>

## Figure layer

To wrap the generated image in a figure we use the [markdown-it-image-figures plugin](https://github.com/Antonio-Laguna/markdown-it-image-figures).  This modifies the markdown stream to wrap the image in a figure and add the title as the figure caption.

The other processing occurs on the tags within the figure, so @11ty/eleventy-img is fine.

```javascript
import markdownit from 'markdown-it';
import markdownit_imagefigures from 'markdown-it-image-figures';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

export default async function(eleventyConfig) {
  const Markdown = markdownit()
    .use(markdownit_imagefigures, {
      figcaption: "title",
    });
  eleventyConfig.setLibrary('md', Markdown);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
      extensions: 'html',         // which file extensions to process
      formats: ['jpeg', 'webp'],  // output image formats
      widths: ['auto', 400],      // output image widths
      defaultAttributes: {        // extra attributes for <img>
          loading: 'lazy',
          decoding: 'async',
      },
      transformOnRequest: false   // make dev look like prod for examples, you probably don't want this
  });

  return {
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: 'njk',
    dir: {
      input: './site',
      output: './public'
    }
  };
};
```

```html
<figure>
  <picture>
    <source type="image/webp" srcset="/img/QPKmYeJmdi-400.webp 400w, /img/QPKmYeJmdi-1024.webp 1024w" sizes="auto">
    <img src="/img/QPKmYeJmdi-400.jpeg"
         loading="lazy" decoding="async"
         alt="Crumbly biscuits in a paper lined container"
         width="1024" height="747"
         srcset="/img/QPKmYeJmdi-400.jpeg 400w, /img/QPKmYeJmdi-1024.jpeg 1024w" sizes="auto"
    >
  </picture>
  <figcaption>Delicious butterhorns</figcaption>
</figure>
```

<div class="iframe-container" style="padding-top: 70%;">
<iframe title="Stage3 figure" src="/2025/fancy-eleventy-img/stage3-figure.html" style="background: wheat;"></iframe>
</div>

## Full image link

I want to be able to have a user click on the image to get the full sized original version, rather than whatever size has been chosen for their viewport.

The catch is the filename for that full sized image is generated by @11ty/eleventy-img, so I don't know what it is without some fiddling.  And eleventy-img doesn't have a config option to just give me a link.  The eleventy-img file is also probably a different file format, where I want to link to the original.

So I added a passthrough config to copy the images through to the final output.  The file is unchanged, as is the filename and path.  So the filename specified in the original markdown line exists on the server.

Having done this I could set the link config option for markdown-it-image-figures.  This adds a link wrapper to the image using the filename as specified in the markdown.  The link is unchanged by @11ty/eleventy-img so it needs the original images to be passed through to work.

```javascript
import markdownit from 'markdown-it';
import markdownit_imagefigures from 'markdown-it-image-figures';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

export default async function(eleventyConfig) {
  const Markdown = markdownit()
    .use(markdownit_imagefigures, {
      figcaption: "title",
      link: true, // links to the passthrough version of the image
    });
  eleventyConfig.setLibrary('md', Markdown);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
      extensions: 'html',         // which file extensions to process
      formats: ['jpeg', 'webp'],  // output image formats
      widths: ['auto', 400],      // output image widths
      defaultAttributes: {        // extra attributes for <img>
          loading: 'lazy',
          decoding: 'async',
      },
      transformOnRequest: false   // make dev look like prod for examples, you probably don't want this
  });

  // pass through original images, for full sized links
  eleventyConfig.addPassthroughCopy("site/**/*.jpg");
  eleventyConfig.addPassthroughCopy("site/**/*.png");
  eleventyConfig.addPassthroughCopy("site/**/*.svg");

  return {
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: 'njk',
    dir: {
      input: './site',
      output: './public'
    }
  };
};
```

```html
<figure>
  <a href="/butterhorns.jpg">
    <picture>
      <source type="image/webp" srcset="/img/QPKmYeJmdi-400.webp 400w, /img/QPKmYeJmdi-1024.webp 1024w" sizes="auto">
      <img loading="lazy" decoding="async"
           width="1024" height="747"
           alt="Crumbly biscuits in a paper lined container"
           src="/img/QPKmYeJmdi-400.jpeg"
           srcset="/img/QPKmYeJmdi-400.jpeg 400w, /img/QPKmYeJmdi-1024.jpeg 1024w" sizes="auto"
      >
    </picture>
  </a>
  <figcaption>Delicious butterhorns</figcaption>
</figure>
```

<div class="iframe-container" style="padding-top: 70%;">
<iframe title="Stage4 final" src="/2025/fancy-eleventy-img/stage4-final.html" style="background: wheat;"></iframe>
</div>

## Data flow sequence

<img id="data-flow-sequence" eleventy:ignore src="/2025/fancy-eleventy-img/eleventy-img-flow.drawio.svg" alt="dataflow diagram of eleventy processing" width="320px" height="980px"/>
