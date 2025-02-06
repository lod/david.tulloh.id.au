---
title: Bunnings site rip
date: 2017-02-12
tags: ["ses", "perl", "rip"]
#spell-checker: enable
---

Some time ago I foolishly volunteered to perform a site rip of https://www.bunnings.com.au/ for the local SES group I am a member of. This was to allow our accountant member to more accurately assign a value to our assets. I understand this is an important thing for an accountant.

I have done a number of site rips in the past, the Bunnings site is probably the most painful so far. The product pages are very complex for what they are.

Each Bunnings product page is roughly 300kB. I extracted 1.1kB of content from each page. So 99.63% of it basically useless, or an efficiency rate of 0.4%. The vast majority of the space is taken up by the nested menu at the top, the ads near the bottom take a bit and then there is a fairly extensive site map across the bottom. At least the CSS is in an external file, well, four of them.

There is a mobile website which is a bit slimmer. I think the page served is triggered by browser fingerprinting and cookies. I didn’t discover it until too late though.

There are also two different HTML structures used for product pages, they look similar but have different tags with different classes.

And a fun trick, these two links go to the same page:
* https://www.bunnings.com.au/romak-m6-high-tensile-course-hex-nut-10-pack_p1100797
* https://www.bunnings.com.au/nobody-nibbles-nuts-like-noddy_p1100797

That trick gets less awesome when you realise that they actually do this and link to the same product with different urls 626 times.

In case anyone else is feeling foolish enough to try this themselves, and brave enough to look at my code, the end result of my trials and tribulations is on github. All the mistakes have of course been purged from the history so it looks like I just brilliantly did it in one go.

https://github.com/lod/bunnings-siterip
