---
title: Choosing a touchscreen
date: 2015-09-18
categories: Microwave
tags:
  - microwave
  - electronics
  - shopping

---
When selecting a touchscreen there is actually an interesting choice that I have to make. There are two common touch technologies, resistive and capacitive, many people probably know it as old and new touchscreens. (Interesting aside, capacitive screens actually came first in 1965 but weren't widely adopted, then resistive screens became common before capacitive screens resurged with phones and became the &#8220;new&#8221; style.)

### Resistive screens

A resistive screen works by letting you push one side closer to the other and detects this change.

Pro:

 * Electrically simple, 4 wire support <a href="http://linux-sunxi.org/Touchscreen">built in to BananaPi A20 chip</a>.
 * Cheaper to manufacture.
 * More accurate detection than capacitive screens.
 * Will work if wet.
 * Will work if wearing gloves, using elbow or poked with a stick.
 * Plastic is scratch resistant.
 * Can optionally detect pressure.

Con:

 * Easier to damage screen.
 * Damaged screen is useless, minor damage typically causes complete failure.
 * Only supports two simultaneous touch points.

### Capacitive screens

A capacitive screen detects power loss to a nearby conductor such as a finger. The modern standard is a projected capacitive technology (PCT) panel which means a direct touch isn't required, this allows a protective glass layer to be inserted on the top of the screen assembly.

Pro:

 * More familiar to people.
 * Easier to clean.
 * Sensitive PCT devices can detect fingers through insulating gloves.
 * Supports complex multitouch patterns.

Con:

 * Fails if coated in a conductive material, such as sweat or food liquids.
 * Sensitive to mechanical design, the metal chassis is a conductor which can significantly impact on screen operation and sensitivity.
 * Conductivity varies on the person, the person's hydration, ambient humidity etc.

### Further pontificating

So for something portable, like a phone, going capacitive is obviously the better choice.

For a kitchen appliance it is far less clear. Wearing dishwashing gloves or smearing tomato sauce across the controls is going to be more common.

The big factor I keep coming back to is the familiarity. People expect to have a solid capacitive touch screen and attach a higher quality value to it than a resistive screen. And that the limitations of the capacitive screen are well understood so people seem happy to work around them.

Basically the engineer in me leans towards resistive, the marketing orphan I recently adopted says capacitive.

So for now I'm getting both. I am already familiar with capacitive touch panels and have one coming as part of one of my screens. So I just need to acquire a resistive panel to play with and understand.

### Shopping

Buying a resistive panel is far harder than it should be&#8230; mostly due to limitations with the wondrous site <a href="http://www.alibaba.com/">alibaba</a>.

&lt;rant&gt;<br/>
Alibaba is fantastic for interacting with component suppliers but the search engine is absolute rubbish, pre-Google Yahoo rubbish. (As Yahoo used to own a substantial chunk of Alibaba maybe it is literally the pre-Google Yahoo rubbish.) Essentially you enter some words, Yahoo searches for those words in the title of each product, the product with the most words in common is the top of the list. Which means that the retailers create new duplicate product entries with different titles trying to hold the bingo card that matches your search words. One touchscreen manufacturer had a single 4 wire resistive touch product, available in about 15 different sizes. They had roughly 1800 bingo cards/product entries trying to attract eyeballs.

(A nice trick with Alibaba direct is that they don't keep these all updated, so you can often get up to 20% off by finding a differently priced entry of the same product from the same manufacturer.)

Once I find a manufacturer I try to figure out if I can trust them. A warning trigger for me is anything that they are obviously lying about in their marketing, if there are obvious lies I can see then there are probably subtle lies that I can't and will bite me later. With resistive touchscreens however <del datetime="2015-09-18T05:50:04+00:00">EVERYBODY</del><ins datetime="2015-09-18T05:50:04+00:00">almost everybody</ins> lies, possibly this is related to the above Alibaba is crap rant. And it doesn't look like lies that help them, a 4 wire touchscreen has four analog passive resistive wires, they state this, then in the interface section they state &#8220;RS232 or USB interface&#8221;&#8230; which I don't understand. It clearly is a 4 wire FPC connector, there is no RS232 or USB plug in the picture, no mention in the description. I suspect there is a series of checkboxes box for interface and they feel the need to tick something&#8230; Another odd one is they list a resolution, numbers vary but all are wrong. It is an analog device, any resolution limitations come from the quantization performed by the controller, which they don't sell. Why provide a fake number and risk it being smaller than somebody else's fake number when the real answer is infinite and therefor better? *sigh*<br/>
&lt;/rant&gt;
### Buying

I have reached out to three suppliers for further information:

 * <a href="http://baortp.en.alibaba.com/product/60245696767-221152236/6_inch_display_screen_with_resistive_touch_panel.html">Shenzhen Baorong Electronics</a> &#8211; who didn't lie
 * <a href="http://www.alibaba.com/product-detail/7-inch-4-wire-resistive-touch_1784484710.html">Shenzhen GreenTouch Technology</a>
 * <a href="http://szxjj.en.alibaba.com/product/388824265-210778224/Touch_Screen_Panel.html">Shenzhen Xin Jie Jia Electronic Membrane Switch Co</a>

I also found some interesting capacitive touch manufacturers in case I go that route:

 * <a href="http://yunlea.en.alibaba.com/custom_page_1/Touch_Solution.html">Yunlea Electronics</a>
 * <a href="http://fannal.en.alibaba.com/">Fannal Electronics</a>
