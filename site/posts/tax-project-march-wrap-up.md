---
title: Tax Project March Wrap up
date: 2010-04-13
categories: Junkcode
tags: 
  - javascript 
  - webdevelopment 
  - wrapup
---

So I cheated a bit and pushed the deadline out a week.  While much of the checklist is done the project overall is nowhere near where I hoped it would be.  The issue I think was that I assumed that I would be productive for the whole weekend but it turns out I actually do do social stuff and regular maintenance like cleaning or ironing.  Looking back I think I committed about half the time I expected to.


<!-- TODO: Link to full size -->
![Tax website screenshot](/posts/images/wp/proto1_screenshot.png)
<p class="wp-caption-text">Tax website screenshot</p>

### Target features
<ul>
<li>Templating system

<font color="green">Check.</font>  Using TT2 as described earlier.  The templating isn't complete but I was<br/>
always planning on growing it as I went.  Sadly it doesn't properly implement the<br/>
primatives I'm using but It's good to start with a win, even if you steal it.

</li>
<li>Basic layout

<font color="green">Check.</font>  To start off with I had a ghastly colour scheme of different shades of red and roughly the layout I ended up with.  I read on one of those innumerable website design blogs that colour schemes are important.  All the classic mood stuff, red is firey and aggresive, white is serious, boring and reliable.  Reliable seems like a good mood for a tax website but black and white is a bit too hard for someone as inept as I to pull off.  So I went with a cream background and a yellow/browny secondary colour.

</li>
<li>Functional data entry

<font color="green">Check.</font>  This works pretty well actually, change an input box and it's immediately pushed to the server.  Not perfect (none of the code is), notably it's not fully backgrounded so you get a slight delay.

</li>
<li>Javascript data checking

<font color="red">Fail.</font>  I didn't get around to trying this.

</li>
<li>Serverside storage

<font color="green">Check.</font>  I went with MongoDB and it's going well so far.  Ended up having to write a very simple PHP script to expose the DB to the Javascript, primarily authentication wrapping.

</li>
<li>Basic calculations

<font color="orange">Partial.</font>  I have some calculations working but it's not a reusable structure.

</li>
<li>Independent domain name

<font color="red">Fail.</font>  The project isn't far along enough to be useful yet so the domain isn't important, so I'm marking this as a fail but don't care.  I also couldn't find a free name I liked.

</li>
<li>Public source repository

<font color="green">Check.</font> <a href="http://github.com/lod/Australian-Tax-Return">http://github.com/lod/Australian-Tax-Return</a>

</li>
</ul>

### Maybe features

<ul>
<li>Client side encryption

<font color="red">Fail.</font>  Didn't start on this.

</li>
<li>User login system

<font color="green">Check.</font>  Pretty easy to implement with the DB layer in place.  I don't have user creation working yet but that is actually a fairly small amount of work.

</li>
<li>Basic personal tax pack covered

<font color="red">Fail.</font>  I'm nowhere near achieving this, it's crazy how much they cram into a few pages.

</li>
<li>Client side PDF generation

<font color="red">Fail.</font>  Didn't start on this.

</li>
</ul>
