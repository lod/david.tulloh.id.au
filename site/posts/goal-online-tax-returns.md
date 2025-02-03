---
title: Goal - Online tax returns
date: 2010-03-21
categories: Project
tags:
  - goal
  - javascript
  - webdevelopment
---

For my first project I am going to make a web based tax return creator for Australian tax returns.

The Australian Tax Office (ATO) produces E-Tax, a program for Windows computers that allows you to produce a tax return and submit it online.  Sadly it's very much Windows only though they suggest exploring running Windows in a virtual machine.  They are currently &#8220;investigating&#8221; supporting other platforms, but they have been doing this for years now and I've seen third hand correspondence that suggests the investigation isn't progressing particularly quickly.

You can also fill in the return by hand on paper, complete with explanatory booklets.  In practice the procedure for both is basically the same, the advantage of doing it digitally is that it's easier to see the calculations and make corrections.

So the goal is to produce a website to help enter tax returns.  I'll base it off the paper tax return and as output produce a PDF that can be printed and posted in directly.  The ATO actually accepts printouts from E-Tax so I'm fairly confident that they will accept these.

The secondary goal is to improve my abilities with Javascript.  I have toyed around with Javascript a little bit, enough to do small tasks for webpages.  In doing this I saw enough to know that Javascript had some fundamental differences but not enough to really understand or work with them.  By doing a substantial Javascript project I hope to get over that hurdle and start to see how to properly design with the language.

By April 4th I'll have a prototype site complete.  Not a usable solution, that will probably happen sometime after the new tax returns come out in July.  The development site can be seen at <a href="http://taxreturn.projects.david.tulloh.id.au/">http://taxreturn.projects.david.tulloh.id.au/</a>

April 4th features

 * Templating system
 * Basic layout
 * Functional data entry
 * Javascript data checking
 * Serverside storage
 * Basic calculations
 * Independent domain name
 * Public source repository

Maybe features

 * Client side encryption
 * User login system
 * Basic personal tax pack covered
 * Client side PDF generation

Later features

 * General package refactor
 * Complete core tax pack covered
 * Complete supplementary tax pack covered
 * Retrieve prefill information from ATO
 * Electronic submission to ATO
 * Integrate with accounting software

