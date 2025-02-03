---
title: Microwave project managing - week 4
date: 2015-03-09
categories: Microwave
tags:
  - microwave
  - project management
  - thermal imaging

---
		

### Camera Investigation

Some minor updates on the camera investigation front. The <a href="http://thermal.com/">Seek Thermal</a> camera has arrived and I have had a brief play with it. It is nice, my only criticism is that the resolution sits in an uncomfortable spot. The resolution is far higher than previous thermal cameras with the very big blocks of data, it looks much more like a normal camera. Which is a bit of a failing, because the resolution is very low and bad for a normal camera.

I haven't been able to start to work with it though. As it is designed to plug in to a phone directly the USB port is the wrong way round (male). I have ordered a USB cable which should fix this for me but it hasn't arrived yet, expecting it on Monday.

The <a href="http://www3.panasonic.biz/ac/ae/control/sensor/infrared/grid-eye/index.jsp">Panasonic Grid-Eye</a> has also been delayed. The Panasonic staff member set me up with Braemac to arrange the details of the purchase. Unfortunately a full week has passed and <a href="http://www.braemac.com.au/">Braemac</a> hasn't bothered to send me an email. If there isn't any movement soon I'll get them to line up <a href="http://www.avnet.com.au/">Avnet</a> instead.


### Screen Investigation

Finding a screen to go with my Banana Pi is proving to be a bit messy, particularly a touch screen. It is looking like I will have to bond a screen, touch screen and protective layer. Very doable but a bit more work. I also have to decide on a screen size, the standard ratios don't gel well with the control panel strip.


### Scales

I have been looking in to electric scales. They are essentially a strain gauge, a thin wire that is glued to the top of a metal block. As the block moves the wire is stretched and its resistance changes. The change is minor but with the wiring looping a few times and a bit of amplification&#8230; you have a set of scales.

The down side is that you have to have a metal block that moves up and down, which is bulky. To compensate for temperature and keep the accuracy up the standard load cell is an aluminium block 5cm thick with a hole machined out of the middle to give it some flex. There are special thin designs, as used in normal kitchen scales, with reduced accuracy and lifespan.

The biggest issue though is I need to get the weight concentrated on a specific point of the load cell. I am assuming putting the load cell in the microwave field wouldn't work, so I have to transfer the load through the base of the microwave using small holes, then concentrate it to a point. Another option is to have four sensors and bring the load down on four points. Either way I am probably looking at a custom piece of plastic to distribute the weight. Custom plastic = setup costs = unhappiness (and more research).


### No Turntable

Another feature I have been looking at is incorporating a mode stirrer which allows the turntable to be disposed of. A microwave forms standing waves in the chamber, these produce hot and cold spots in the food. The turntable is a really nice cheap trick to work around this problem, by rotating the food it hopefully moves through a number of hot and cold spots and roughly equals itself out. The mode stirrer is another approach, basically you put a fan in front of the microwave beam breaking it up and spraying it around the cavity. This disruption of the beam avoids the standing wave, essentially you get lots of different short lived wave patterns, and you shouldn't get hold and cold spots. In practice the distribution is more even but it isn't conclusive if it is better or worse than a turntable. The technique has been around for <a href="https://www.google.com/patents/US4327266">a long time</a> and seems to have come in and out of favour. The current mode stirrer designs market themselves as allowing a bigger usable space in the microwave.

I am interested in using the mode stirrer because it makes other elements of my life a bit easier. Notably the camera would work a lot better if the food you were looking at didn't keep moving. I could compensate for the movement in software, but avoiding the problem seems easier. I also think the scales would be much harder to achieve with a turntable.

Unfortunately Alibaba (where I have sourced almost all my other parts) has let me down and nobody seems to sell them. The mode stirrer is a thin metal component which would be fairly simple to make but must be done very precisely. It is also a bit of fiddly RF design and as I have sworn off doing dark magic for lent it isn't something I really want to tackle myself. There are clearly people making them, I just might have to work a bit to find them.

As an interesting side note the current Panasonic designs with mode stirrers have chosen to place the stirrer in the bottom of the unit rather than the top, the historically standard location. I'm not sure if this was motivated by improved performance or cost, it does make the base feel oddly fat. Not something I am looking to follow suit in either way, I am currently pondering putting it in the side.


### Other work

I also spent a considerable period of time this week learning about companies, talking to accountants and reading exciting government websites. Trying to figure out if I start a company now, play on as a sole trader and start a company later or go with a company &amp; trust structure.  Currently leaning towards delaying the company founding but there are lots of little pros and cons to weigh up.

<iframe width="100%" height="800px" src="/microwave_plan/index.html?date=20150220"></iframe>

<a href="/microwave_plan/index.html?date=20150220">View full screen</a>

