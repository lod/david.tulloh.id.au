---
title: Screen Interface Prototype
date: 2015-11-24
categories: Microwave
tags:
  - microwave
  - thermal imaging
---

While I have been rather negligent with my blog updates I have been kicking goals with progress on the Grid-Eye thermal sensor, BananaPi screens and the user interface. Of these it is user interface that I am going to blather about here.

My primary goal of this project is to improve the microwave user interface, shifting away from four character seven segment displays to a more interactive fully featured display.


<!-- TODO: Image should link to <a href="http://www.3quarks.com/en/SegmentDisplay/"> -->
<!-- Whitespace between div and image is necessary, triggers <p> and proper parsing -->
<div style="display: block; margin: 0 auto; border: 3px solid black; padding: 0 40px; ">

![](/posts/images/wp/crap.png)
</div>

Everything else, most of the work, is to support and implement this improvement. As I am now up to playing with the screens, selecting screen sizes and touch interfaces it seemed worthwhile to spend a bit of time considering what the GUI will actually look like.

I did a few pages of pencil sketches, useful to work through a wide variety of ideas.

<!-- TODO: Link to full sized version -->
![](/posts/images/wp/gui_sketches.png)

Then I did a prototype implementation in HTML to iterate the better ideas. This prototype is below, it is a fully interactive webpage &#8211; some bits pretend to work, other bits are stubbed out.

I would really appreciate it if people would play and give feedback. It is designed for a fixed screen size of 480&#215;800 pixels, the primary user interface will be finger on a touchscreen, there will also be general web browser access for PCs and portable devices.

<a href="/microwave_gui_proto_20151124/index.html" target="_blank" style="text-align: right; display: block;">View in new tab/window</a>

<div style="margin: 0 auto;">
<iframe id="gui-prototype-proto_iframe" src="/microwave_gui_proto_20151124/index.html" width="481" height="800" style=" transform: scale(0.75);       transform-origin: 0 0;        -ms-zoom: 0.75;        -moz-transform: scale(0.75);        -moz-transform-origin: 0 0;        -o-transform: scale(0.75);        -o-transform-origin: 0 0;        -webkit-transform: scale(0.75);        -webkit-transform-origin: 0 0;  display: block; margin: 0 auto; overflow:hidden; border: none; "></iframe>
</div>
<script>
jQuery(function(){
  // CSS transform doesn't change the space that the element takes up, just appearance
  var iframe = jQuery('#gui-prototype-proto_iframe');
  iframe.parent().css('height', iframe.height()*0.75);
  iframe.parent().css('width', iframe.width()*0.75);
});
</script>

The source code is available <a href="https://github.com/lod/microwave-gui">on github</a>, it is prototype code so there are more than few shortcuts and lots of poor practices.

<div id="gui_list">
My current design guidelines are:

<ul>
<li>Intuitive to use
<ul>
<li>No instruction manual or help pages</li>
<li>No advanced touch interfaces (sliding, multitouch etc.)</li>
<li>Large, obvious, touch targets</li>
<li>Accessible colour scheme and aria support</li>
</ul>
</li>
<li>Forgiving of mistakes</li>
<li>Not too hideously ugly</li>
</ul>
</div>
<style>#gui_list p, #gui_list ul { margin-bottom: 0.2em } #gui_list { margin-bottom: 1em; } </style>
