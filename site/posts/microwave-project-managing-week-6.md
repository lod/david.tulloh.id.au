---
title: Microwave project managing - week 6
date: 2015-03-09
categories: Microwave
tags:
  - microwave
  - project management
---

       
### Other News

The fan in my laptop died this week. It has been struggling and groaning noisily along for a while now, occasionally the boot has even failed due to a fan error but a second shot always got through. While I had the system switched off I thought it would be a good idea to blow the dust out and give it a bit of love. It still groans along but now the fan error is consistent. :(  I have ordered a replacement fan which should arrive next week. In the last six months I have had to swap the battery, hard drive and fan.  Maybe my Lenovo is reaching the end of its lifespan, 2008 was a while ago and apparently it doesn't even run WOW. 


### Other Other News

In better other news, a friend pointed out that a <a href="https://what-if.xkcd.com/131/">recent XKCD what if? post</a> is on the topic of microwaves. Because it seems microwaves are awesome.


### Screen

I have contacted several suppliers of the Banana Pi and a screen supplier to get price estimates. The screen supplier may be able to fit the touchscreen, which is a bonus, otherwise I have some touchscreen suppliers selected to approach.

The initial Banana Pi pricing is $29 USD in quantities of 500, $34 for samples. I am looking at a seven inch IPS screen which I expect to be roughly $15 and another few bucks for the capacitive touchscreen. So a total bill of roughly $50 USD with no electronic design required, which makes me very happy.

An interesting side note is that both the Raspberry Pi and Banana Pi feature a ribbon connection for the screen which follows a standard by MIPI (not an acronym) called the Display Serial Interface (DSI). This is a fairly standard interface used by the mobile phone industry which makes it very nice to pick up screens for. The Raspberry Pi hardware has always featured this connector however the drivers to use it weren't initially provided by Broadcom, so most of the screen accessories use the HDMI port. When the Raspberry Pi foundation released their screen it used the DSI interface and was paired with a driver release. However this driver still only uses some of the bus (half the LVDS channels by some reports) so you can't use standard screens with it. The Allwinner chip used by the Banana Pi has full support. The only remaining annoyance is that the DSI bus supports an I2C channel for the touchscreen but all the screen manufacturers seem to use a separate touchscreen cable, I may even have to do some design work.


### Schedule

So, it probably isn't a shock after I completely blew a week or two that I am rapidly approaching the end of the eight week evaluation period and there is an awful lot not yet done. Essentially all of the outstanding work is doing preliminary work in the technical innovations I hoped to achieve.

Breaking it down into tasks we have subheadings.


#### Thermal Camera

The thermal camera is a key body of work that I have let slide.

I identified two potential camera systems to evaluate, the <a href="http://thermal.com/">Seek Thermal</a> which I have gotten a sample of and the <a href="http://www3.panasonic.biz/ac/e/control/sensor/infrared/grid-eye/index.jsp">Panasonic Grid-Eye 8&#215;8</a> which I managed to get Panasonic to agree providing samples of. The plan was to compare, decide, potentially make an approach to Seek Thermal etc.

The plan went awry when I met <a href="http://www.braemac.com.au/">Braemac</a> a local distributor of electronic goods including Panasonic's. There are two companies in Australia that do this sort of distribution, Braemac and Avnet. I have interacted with Avnet a fair bit, they distribute Xilinx chips so at my last employer I was on first name terms with their Xilinx sales/support guy. Panasonic actually uses both companies, I chose Braemac in this instance as they are the smaller of the two and I thought it would be good to build a relationship into the other electronics distributor. My only prior experience with Braemac was also at my last employer, we were trying to purchase some U-Blox GPS modules. We ordered them well in advance but Braemac managed to slip the delivery three times, as we were getting into damages territory with our customer I reached out to someone senior I knew in U-Blox and we managed to get some emergency components from Singapore. It seems like this negative experience wasn't a one off.

I had done all the work, it really should have been rather simple for Braemac. I had approached Panasonic, they had agreed to provide the samples, everything was arranged except for me giving over money. Panasonic sent the price to Braemac, Braemac's job was to put their header on it, take my money, remove their cut and pass the rest back to Panasonic. We are only talking samples at this stage so they probably aren't making a profit but it isn't like it is a great deal of work.

Braemac managed to not respond for eleven days, and even then several days after I contacted Panasonic to give them a shove, their feedback to Panasonic was similarly absent.

The Panasonic rep offered a sample quantity of ten. Ten is a fairly high number for samples, acceptable but generally for a complex part you get 3-5 samples. The Braemac email listed a minimum sample quantity of 100. I have never before heard of a manufacturer demanding the purchase of 100 units as a sample. Even samples of trivial parts like capacitors aren't done in lots of 100. Why would you evaluate something 100 times before making a decision?

When questioned about the sample quantity Braemac haven't responded, it has been two weeks so far.

I need to get on top of this ASAP. Even once ordered it will probably take several weeks to get the samples and a week to evaluate them. There is no way I am going to close this out by the end of the month.

The plan going forward is to call the Braemac rep on Tuesday. If I can't get it resolved on the Tuesday I will aggressively pursue samples through Avnet. I can't see resolving the camera system by my decision deadline, I think the best I can hope for is to get as much done as I can and deal with it at the time. Making a viability call with this element so uncertain is difficult, I may have to put a secondary evaluation date in.


#### Inverter

I would like to include an inverter system in my microwave, it isn't critical but certainly a nice to have. I concluded a while ago that the only viable way forward was to buy the system from Panasonic, parts, patent licence etc. as a complete kit. This seems to be how other manufacturers such as Sharp have approached it.

My plan was to use the cameras to build a relationship with Panasonic and then broach the question of the inverter technology. I think I have enough of this so far, I'll raise the inverter tech when I talk to Panasonic in the process of resolving the camera sample mess.


#### Scales

The scales technology is relatively simple. I am confident that I can handle the electronics side and will be able to at least estimate the cost by the end of the month. It will probably involve a custom PCB which is increased risk but it should be a simple one.

The outstanding element here is that I am probably going to need to create a custom plate for the scales. There are a few options with different cost/design tradeoffs but I need to be more knowledgeable about the costs involved in plastic fabrication to proceed.

When dealing with the metal fabricators some plastic companies were mentioned. I need to line up a visit next week and get an understanding of the different techniques with their tooling and unit costs.


#### No turntable

The lack of a turntable in the system is basically a requirement to get the scales working.

Again the technology, a basic understanding of it, is simple enough that even I have grasped it.

I just haven't found anyone who sells them premade. Panasonic probably another option, I'm giving them all my money anyway&#8230; I could also grab one and get a metal bender to clone it but the part needs to be precisely made. Designing my own would probably require RF measurements to do it properly which is complex and expensive, not to mention how terrifying RF design is.


#### Screen

The screen is actually looking fairly good. I haven't received the samples to try out but that is fairly low risk and should happen before the end of the month. I have a solution and enough information to estimate the cost solution, which is all I really need at this point.

<iframe title="Gantt chart" width="100%" height="800px" src="/microwave_plan/index.html?date=20150307"></iframe>

<a href="/microwave_plan/index.html?date=20150307">View full screen</a>

