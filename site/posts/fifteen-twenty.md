---
title: Fifteen Twenty
date: 2015-04-27
categories: junkcode
tags:
  - junkcode
  - wordpress
  - php
---

       
I am publishing my first WordPress theme, Fifteen Twenty. Born out of frustration at the WordPress theme structure when attempting to update the theme of this blog it demonstrates an alternative. This theme is designed as a technical demonstration of structuring a WordPress theme with a single core layout file. As this is an inversion of the standard structure of the default theme [Twenty Fifteen](https://wordpress.org/themes/twentyfifteen/) I have dubbed it Fifteen Twenty.  The appearance, styling and generated html is the same as the original.

WordPress is an open source blogging platform, it is the most popular blogging platform with over 60 million websites using it. To enable all of these websites WordPress has a theme system which allows the user to radically change the appearance of their blog with just a few clicks. Most of these themes are contributed by users but the WordPress team does release a theme every year, this is the default theme and acts as a best practices template for theme designers. The default themes are named after the year, the current one is Twenty Fifteen.

WordPress themes consist of a collection of php template files. WordPress chooses a template based on the type of content being requested, this allows a different template to be used for search results or an audio attachment. The decision is made using the template hierarchy depicted below. WordPress proceeds from left to right until it finds a file which matches the desired pattern, on the far right index.php acts as a catch all for any file types not specially handled.

<div class="wp-caption">
	<a href="https://codex.wordpress.org/File:wp-template-hierarchy.jpg"><br/>
		<img width="100%" alt="A colorful version of the WordPress template hierarchy." src="https://codex.wordpress.org/images/thumb/9/96/wp-template-hierarchy.jpg/800px-wp-template-hierarchy.jpg">
<p class="wp-caption-text">WordPress Template Hierarchy</p></a>
</div>

The advantage of this structure is that it allows for a huge degree of flexibility in the styling. Any content can have a complete different set of styling provided to it and the hierarchy allows for very specific speciality pages to be created.

The disadvantage is that every template requires a duplication of the site structure. Changes such as reordering the HTML structure require the reworking of every single template file, this was exactly the problem I faced when working on this blog's template Piano Black.

In practice I feel the theme hierarchy structure is a poor design choice as you want to retain the same look a feel across the entire site. This means that the layout is consistent and the variations are typically isolated to the central content pane. Theme authors attempt to reduce the amount of duplication by using a header and footer file which is pulled into each template, this helps to reduce work for minor changes but makes structural alterations even harder.

The alternative technique is to have a single template file which sets the structure of the website. This file then pulls in partial templates based on the content being requested. The partial templates provide a reduced level of flexibility compared to the full template model but are simpler as they do not need to include as much of the site's structure. The Twenty Fifteen theme actually uses both full and partial templates, the partial templates are used within the full templates to customise different categories of posts.

I do not mean this as an attack or criticism of the WordPress team, the choice was a trade off and they chose the more flexible approach leading to a product far more successful than any I have ever produced. This choice was also made for the initial release in 2003, a different online environment with alternative aesthetic (MySpace) and less use of javascript. They have made a fantastic product and the flexibility built through it allows for novel uses, like mine.

By removing all the custom template files WordPress will always use index.php as a template. As the template is a full php file it can examine the requested content type and pull in the required partial template. This technique uses the WordPress partial include function which enables sub-themes to customise specific partials.

To demonstrate this layout technique I chose to rework the Twenty Fifteen theme as it is designed as a basis for theme authors to work from, which is also my goal. I took each of the template files and pushed the common elements up to index.php converting them into a partial. The files designed to reduce duplication such as header.php, footer.php and sidebar.php were also pushed into index.php. I then set up a demo site using the [wptest.io](http://wptest.io/) test data and used [wget &#8211;mirror](https://www.gnu.org/software/wget/), [HTML tidy](http://www.html-tidy.org/), a tiny bit of [sed](https://www.gnu.org/software/sed/) and [diff](https://www.gnu.org/software/diffutils/) to beat the last bugs out and ensure that the final result was unchanged from the initial Twenty Fifteen design.

In the future I'll be releasing my updated version of Piano Black, this blog's theme, with mobile support (responsive layout) and other modernising updates under the hood. I may also make an [AngularJS](https://angularjs.org/) powered demonstration version of Fifteen Twenty for fun.

 * [Source code hosted on GitHub](https://github.com/lod/FifteenTwenty)
 * [Demo site](http://fifteentwenty.tulloh.id.au/)
 * [WordPress Theme Directory Entry (under review)](https://themes.trac.wordpress.org/ticket/24549)
