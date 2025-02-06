---
title: Grideye USB
date: 2016-04-18
categories: Microwave
tags:
  - electronics
  - thermal imaging
---

<!-- TODO: 11ty generated table of contents -->
<style>
#toc_container.no_bullets ul, #toc_container.no_bullets li, #toc_container.no_bullets ul li, .toc_widget_list.no_bullets, .toc_widget_list.no_bullets li {
  background: none;
  list-style-type: none;
  list-style: none;
  padding-left: 0px;
  margin-bottom: 0;
}
.post div#toc_container {
  background-color: rgba(0,0,0,0.15);
  border: 1px solid rgba(0,0,0,0.3);
  float: right;
}
#toc_container {
  padding: 10px;
  margin-bottom: 1em;
  width: auto;
  display: table;
  font-size: 95%;
}
</style>

<div id="toc_container" class="no_bullets"><p class="toc_title">Contents
<ul class="toc_list"><li><a href="#Circuit_Design"><span class="toc_number toc_depth_1">1</span> Circuit Design</a></li><li><a href="#Single_Sided_PCB"><span class="toc_number toc_depth_1">2</span> Single Sided PCB</a></li><li><a href="#Two_Sided_PCB"><span class="toc_number toc_depth_1">3</span> Two Sided PCB</a></li><li><a href="#Ordering"><span class="toc_number toc_depth_1">4</span> Ordering</a></li></ul></div>

One of the key features of my microwave is Panasonic's Grideye thermal sensor. This is a (relatively) low cost thermal sensor that I have placed at the top of the microwave to measure the surface temperature of the food.

The sensor is an I2C device which requires a 5V or 3.3V supply. Wanting to keep everything relatively high level I am implementing it as a USB device.

For the demo I used a <a href="http://dangerousprototypes.com/docs/Bus_Pirate">BusPirate</a> as an I2C-USB bridge. This got me through the demo but the protocols combine very badly resulting in a maximum frame rate of about 1fps. The high latency of USB communications combines with the chattyness of I2C causing everything to be very slow.  So a practical implementation can't be a bridge, it must have some logic to control the device and present a processed USB data stream.

There is an existing one, Digikey has a <a href="http://www.digikey.com/product-detail/en/DKSB1015A/906-1002-ND/4360804">breakout board</a> that their Application Engineers developed. Sadly due to Panasonic's limitations on distributing the GridEye sensor they only ship them within the US. The Application Engineers team runs in an open hardware manner, the <a href="https://eewiki.net/display/projects/Panasonic+GridEYE+Breakout+Board+and+GUI">project page for the breakout board</a> includes the circuit diagram and firmware code. I got in contact with the author, Chris Baird, and while he didn't have any blank PCBs he could ship he was happy to share the gerber files so I could make my own.

The story doesn't end here though, because a solid dose of Not-Invented-Here hit, justified by the twin desire to <a href="https://david.tulloh.id.au/using-kicad/">evaluate KiCad</a> and wanting to implement the USB Video protocol, driven in part by an absurd desire to shovel yet another driver into the Linux Kernel.

As a nice bonus I reduced the cost, significant components, excluding the GridEye, cost $9.81 AUD for the Digikey board compared to $2.60 AUD for mine. Though that it no way compensates for the time spent and comes with the disclaimer that the Digikey board actually works.

All files for the design being discussed are available at <a href="https://github.com/lod/grideye_usb_electronics">https://github.com/lod/grideye_usb_electronics</a>.

## <span id="Circuit_Design">Circuit Design</span>

My circuit design is below, I took a rather different approach to the Digikey board, wiring an Atmel AVR directly to the USB input. This will use <a href="https://www.obdev.at/vusb/">V-USB</a>, a software USB stack to communicate. The ATTiny AVR used is capable of running V-USB on it's internal crystal, it should also have enough memory allowing me to do USB based reprogramming.

<style>
/* SVG Background is transparent, doesn't work well on dark background */
img[alt="Eeschema circuit"] {
  background-color: white;
}
</style>

![Eeschema circuit](/posts/images/wp/grideye_usb-compressor.svg)


The AVR must run off 5V in order to be fast enough to handle the USB communications. USB communications however are a 3.3V signal and while driving it at 5V typically works it's certainly not a nice thing to do. The weak zenner diodes are a <a href="http://vusb.wikidot.com/hardware#toc3">bidirectional level conversion technique</a>.

The power network actually allows for two different voltage levels into the GridEye. It isn't clear from the datasheet what impact a dirty power supply has, so I have fitted an LDO to create a smooth 3.3V signal. There is also a 5V GridEye variant (which I don't currently have) that could be run directly off the USB rail. To support both cases I have an LDO designed in as well as pads for a zero ohm resistor to bridge the rails, one or the other should be fitted. 

The I2C bus uses an open-collector signal so nicely adapts to whatever voltage the GridEye is powered on. Running at 5V the AVR reads 2.5V as high, comfortably supporting 3.3V communication.

I would have liked to have a spare IO to be able to disable the LDO in low power mode. However the GridEye can be software configured into a low power state and the LDO does not consume much power when idle. I could repurpose the reset line for the job but that has significant downsides.

## <span id="Single_Sided_PCB">Single Sided PCB</span>
<style>
#single_pcb_placeholder img { position:absolute; z-index:900; }
#single_pcb_placeholder div { position:absolute; z-index:999; }
#single_pcb_placeholder img { width:550px }
#single_pcb_placeholder div { display:table-cell;width:550px;text-align:center;vertical-align:middle; font-weight:800}
#single_pcb_loading { position:absolute; z-index:999; }
#single_pcb_loading { display:none;width:550px;text-align:center;vertical-align:middle;}
</style>

<!-- TODO: Both interactive pages are missing -->
<script>
jQuery(function(){
	jQuery("#single_pcb_placeholder").on("click", function() {
		jQuery("#single_pcb_iframe")[0].src = "/wp-uploads/2016/04/grideye_usb.first_pass.x3dom.html";
		jQuery("#single_pcb_loading")[0].style.display='table-cell';
		jQuery("#single_pcb_placeholder")[0].style.display='none';
	jQuery("#single_pcb_iframe").on("load", function() {
		jQuery("#single_pcb_placeholder")[0].style.display='none';
		jQuery("#single_pcb_loading")[0].style.display='none';
	});
});
});
</script>

<div id="single_pcb_placeholder">
	<!-- <img src="/images/wp/grideye_usb.first_pass-brd-compressor.svg"/> -->

![](/posts/images/wp/grideye_usb.first_pass-brd-compressor.svg)

<div>Click image for interactive 3D model</div>
</div>
<div id="single_pcb_loading">
	Loading &#8230;
</div>

<iframe id="single_pcb_iframe" title="Interactive PCB" border="0" name="iframe" width="550" height="230" scrolling="no" noresize frameborder="0"></iframe>

My first attempt at a PCB was a two layered single sided PCB, it is functional but not optimized as I decided the approach was wrong and created a double sided PCB for manufacturing.

It is a fairly long, simple, PCB with a simple flow left to right of the USB port, AVR chip and GridEye sensor.

I created two ground planes, a shield plane around the outside which is connected to the USB shield and the screw holes, it is designed to be connected to the chassis. The center of the board has a standard digital ground connected to various components and the USB ground line. In my microwave system there should be a central (star) ground point, somewhere else, which connects these two grounds. To provide flexibility, mainly for applications without a metal chassis, there is an empty 0603 pad in each corner to bridge the two ground planes with either a capacitor or a 0 ohm resistor .

After doing this layout I felt a two layer design would be much better. It would allow the board to be much smaller and I wanted the sensor to be more central. Later I learnt that the prototype PCB manufacturers all up their rates for boards over 5cm, so my 6cm board was fairly expensive. I swapped the large six pin connector with a <a href="https://www.tag-connect.com/">Tag-Connect</a> connector to try and be less ugly, with mixed success. 

## <span id="Two_Sided_PCB">Two Sided PCB</span>
<style>
#double_pcb_placeholder img { position:absolute; z-index:900; }
#double_pcb_placeholder div { position:absolute; z-index:999; }
#double_pcb_placeholder img { width:550px }
#double_pcb_placeholder div { display:table-cell;width:550px;text-align:center;vertical-align:middle; font-weight:800}
#double_pcb_loading { position:absolute; z-index:999; }
#double_pcb_loading { display:none;width:550px;text-align:center;vertical-align:middle;}
</style>

<!-- TODO: Both interactive pages are missing -->
<script>
jQuery(function(){
	jQuery("#double_pcb_placeholder").on("click", function() {
		jQuery("#double_pcb_iframe")[0].src = "/wp-uploads/2016/04/grideye_usb.two_sided.x3dom.html";
		jQuery("#double_pcb_loading")[0].style.display='table-cell';
		jQuery("#double_pcb_placeholder")[0].style.display='none';
	jQuery("#double_pcb_iframe").on("load", function() {
		jQuery("#double_pcb_placeholder")[0].style.display='none';
		jQuery("#double_pcb_loading")[0].style.display='none';
	});
});
});
</script>

<div id="double_pcb_placeholder">
	<!-- <img src="/images/wp/grideye_usb.two_sided-brd-compressor.svg"/> -->

![](/posts/images/wp/grideye_usb.two_sided-brd-compressor.svg)

<div>Click image for interactive 3D model</div>
</div>
<div id="double_pcb_loading">
	Loading &#8230;
</div>

<iframe id="double_pcb_iframe" title="Interactive two sided PCB" border="0" name="iframe" width="550" height="370" scrolling="no" noresize frameborder="0"></iframe>

I started this board more professionally, defining a 3cm by 2cm board with M2 holes on each corner. It was a little bit of a struggle to get everything to fit nicely but that probably means it was the correct size.

My main concern with the new design is that one of the USB data lines is also used in the programming process. I tried to make it as short as possible but the programming connector wouldn't fit anywhere but the far side of the board to the USB connector. So that line is a long stub during operation, not a nice thing to do to an RF signal. Anecdotal evidence from forums suggests that I will get away with this but having the programming cable connected will cause it to fail, I'm happy with that.


The <a href="https://www.tag-connect.com/">Tag-Connect</a> connector can be seen on the far side to the USB port. It is actually just a carefully arranged collection of pads with holes to guide the plug. I haven't used the Tag-Connect system before, I am attracted to it for a number of reasons. The footprint is smaller, in board size, only consuming one layer and not having a high part permanently attached. Being a layout of pads it is cheap per board. And for manufacturing it is easy to design a pogo pin setup to hit the pads or use a bed of nails system. There is also a series of test points exposing the USB lines for manufacturing.


Several people have complained about the Tag-Connect routing meaning that you take up as much board space as the standard, larger, connector. I certainly found the routing was annoying, especially with the holes at either end requiring lines to go the long way around. I cheated somewhat by placing vias on the pads, effectively making some of the pins through holes, this made routing much easier for me. For a two layered board the Tag-Connect benefits are probably marginal, with more layers the benefits would be add up rapidly.

## <span id="Ordering">Ordering</span>

An order has been placed at <a href="https://oshpark.com/">OSHPark</a> for both the Digikey board and mine, the process was remarkably good, lots of feedback as to what would be manufactured as you progressed. My board has an oval hole which OSHPark doesn't support but I'll fix that somehow after the board is delivered.

The Digikey board 20.35&#215;22.91 mm (0.8&#215;0.9 inches) and cost $1.20 USD per board.<br/>
My board is 30.02&#215;20.02 mm (the 0.02mm is the cut line thickness) and cost $1.55 USD per board.

Within 24 hours both boards had been sent for fabrication, mine got a free upgrade to the special rush order stream.

I have ordered an 0603 resistor and an 0603 capacitor part book from <a href="http://www.aliexpress.com/store/930252">Super Deal Technology</a> with some empty pages. The Digikey board uses 0804 parts (designed for old folks with fading eyesight) but I'll just put 0603s onto the larger pads. Part books are by far the best way to manage SMD components.

The remaining parts have been ordered from Element14, Digikey was cheaper on the parts but more expensive with shipping.
