---
title: State of displays
date: 2015-09-18
categories: Microwave
tags:
  - microwave
  - electronics
---

Teeing up a display for an embedded system is a little more complex than buying a monitor.

At the core of it is one of my favorite sayings, &#8220;The wonderful thing about standards is that there are so many to choose from.&#8221;

Starting from the screen end of things, I want a screen that is roughly 150x90mm in size. Because I want it viewable from the side and ideally all angles, I have a strong preference for an IPS display.  I found a screen that is really nice, [Topfoison's 6&Prime; IPS display](http://topfoison.en.alibaba.com/product/1954394157-0/2014_most_popular_manufacturing_mipi_interface_6_0_standard_tft_lcd_display_1080_1920_resolution_IPS_for_mobile_phone_TF60001A.html).

This display uses [MIPI DSI](http://mipi.org/specifications/display-interface) for its video signal, specifically a 4 lane MIPI DSI interface (because standards restrict choice too much many standards allow incompatibility within themselves).

[MIPI DSI](http://mipi.org/specifications/display-interface) is an interesting standard, it is a mobile industry standard (Mobile Industry Processor Interface &#8211; pronounced lowercase as mipi, like nbn) which essentially specifies a number of half duplex SERDES links for throwing video around. Many mobile phones seem to have adopted the standard as it removes the need for a video converter &#8211; reducing part count/cost, simplifying cabling and reducing internal EMI. The display and chip manufacturers have shifted with the market. However as it is fairly new mostly it is new/expensive hardware with support.<br/>
If you are meant to be doing something else here is some further reading, [nice overview](http://www.eetimes.com/document.asp?doc_id=1319340), [detail with pretty scope pictures](http://www.ti.com/lit/an/swpa225/swpa225.pdf).

So, looking at hardware to plug in to this we have:

* [BananaPi M1](http://www.banana-pi.com/eacp_view.asp?id=35), the board I have been planning on using.<br/>
  Is not listed as supporting MIPI DSI, does support relatively generic LVDS output.<br/>
  Graphics processor is the [ARM MALI400 MP2](http://www.arm.com/products/multimedia/mali-cost-efficient-graphics/mali-400-mp.php?tab=Specifications), the newer ARM MALI cores include a display controller but I believe this wasn't the case for the MALI400. I haven't been able to find documentation on what display controller Allwinner used in the [A20 chipset](http://www.allwinnertech.com/en/clq/processora/A20.html).<br/>
  Some websites do claim that BPI has a MIPI DSI output, I think they are wrong and are simply assuming that the RaspberryPi look-alike video header is a function-alike video header.
* [BananaPi M2](http://www.banana-pi.com/eacp_view.asp?id=71)<br/>
  Uses the [Allwinner A32s](http://www.allwinnertech.com/en/clq/processora/A31s.html) ([datasheet](http://dl.linux-sunxi.org/A31s/A31s%20Datasheet%20v1.40.pdf)) chipset which does not support MIPI DSI output.<br/>
  The Allwinner A31 does, but it seems they removed it when pluralising chip.<br/>
  The SinoVoip website lists the output as &#8220;LVDS/RGB/CPU display interface (DSI) for raw LCD panels&#8221; on the product page. However the DSI gets dropped when getting into the [detailed LCD connection information](http://www.bananapi.com/index.php/component/content/article?layout=edit&amp;id=73).

* [BananaPi M3](http://www.banana-pi.com/eacp_view.asp?id=87)<br/>
  Uses the Allwinner A83T chipset<br/>
  Specifically states support for MIPI DSI and MIPI CSI interfaces, with dedicated headers.<br/>
  However this isn't available yet, when contacted SinoVoip suggested it should be out around the end of this year.

* [Raspberry Pi](https://www.raspberrypi.org/)<br/>
  The Raspberry Pi uses a Broadcom chipset which supports and has a header for 2 lane MIPI DSI output.<br/>
  However due to driver issues this output isn't generally useable.<br/>
  There are [complex projects](http://hackaday.com/2014/08/19/a-mipi-dsi-display-shieldhdmi-adapter/) made with custom hardware to convert the HDMI output to MIPI DSI.<br/>
  The Raspberry foundation produced [a screen](http://swag.raspberrypi.org/products/raspberry-pi-7-inch-touchscreen-display) which uses the MIPI DSI output with kernel support. Apparently they managed to do it in such a way that generic boards aren't supported, just theirs.

* [Lemon Pi](http://www.embedstudio.com/index.php?m=content&amp;c=index&amp;a=lists&amp;catid=9)<br/>
  Uses an Actions S500 chipset<br/>
  Specification states support for MIPI DSI but doesn't specify how many lanes and the S500 documentation doesn't mention DSI.<br/>
  Not yet available, indications that things are happening so may ship this year.<br/>
  Includes (optional) built in bootable permanent storage.

* Other boards<br/>
  There are other systems out there which aren't suitable for various reasons.<br/>
  For example the [H4 Hummingbird](http://www.merrii.com/en/pla_d.asp?id=172) uses the Allwinner A31 with MIPI DSI output but at $70 isn't competitive.


### Making choices

I have ordered the [official SinoVoip 7&#8243; LCD touchscreen](http://www.aliexpress.com/store/product/New-Arrival-Banana-Pro-Pi-7-inch-LCD-Display-Touch-Screen-Raspberry-Pi-Car-GPS-FreeShipping/302756_32335608836.html). This is a non-IPS 7&#8243; display connected to the LCD connector via a dedicated adaptor board. It also includes a touchscreen, no details so am assume it is a capacitive panel. The main reason for getting this screen is that as it is distributed by SinoVoip it should be well supported, the price is rather high but I haven't inquired about production quantities.

I am also negotiating an order of the [Topfoison 6&#8243; IPS screen with HDMI adaptor](http://topfoison.en.alibaba.com/product/60146622608-0/factory_full_hd_1920x1080_lcd_module_1080P_ips_6_with_HDMI_MIPI_borad_for_vr_headset.html). The adaptor seems to add about $5-10 USD per unit and I expect a HDMI cable will be a few dollars, so the wiring ends up being a substantial percentage of the screen costs. Currently using MIPI DSI directly isn't an option but I will definitely reevaluate down the track once the next generation of boards comes out.
