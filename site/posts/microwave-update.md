---
title: Microwave Update
date: 2015-09-15
categories: Microwave
tags:
  - microwave
  - project management
---
					
       
So for the more recent substantial chunk of time I have been neglecting this project, mainly procrastinating by playing with <a href="https://github.com/zookeepr/zookeepr">Zookeepr code</a>. Over the last month I've churned almost 20k lines of code, though not all committed yet. Which is a relatively productive way of being spectacularly unproductive.

The big news is that I was selected to speak at the next <a href="http://linux.conf.au/">linux.conf.au</a>. I confess this was a bit of a surprise, my long term plan was to submit proposals to a few venues this year and hopefully speak in 2017. Spectacular success on that front does change the microwave plan slightly as it commits me to having a demonstrable prototype &#8211; so I've shifted my project reevaluation point further down the game plan and split the prototype section into two halves with an evaluation point between the cheap and expensive halves.

To support this shift I have restructured my plans around the basic prototype. I have set the final vision and the order of steps to achieve it.

As the base I will use a <a href="http://www.panasonic.com/au/consumer/household/microwave-ovens/microwave-only/nn-sf550w.html">Panasonic NN-SF550W Microwave</a>, this is a basic microwave that features an inverted power supply and magnetron as well as a flatbed and stirrer. I will replace the display with a screen and touchscreen, the processor with a <a href="http://www.banana-pi.com/eacp_view.asp?id=35">banana pi</a>. The power supply and door sensors will be integrated with the processor. Both the <a href="http://na.industrial.panasonic.com/products/sensors/sensors-automotive-industrial-applications/grid-eye-infrared-array-sensor">Panasonic Grid-Eye</a> and <a href="http://www.thermal.com/">Seek Thermal</a> cameras will be mounted into the roof, I may only connect one at a time. A set of scales will be built into the floor of the microwave, probably using the existing base plate. Software of some sort will tie all the components together though it may not be pretty.

### Work plan

At a rough estimate I'm looking at 2-3 months work to get a feature complete franken-prototype. There is also significant delay time in there to acquire new components to play with.

The groups of work are:

 * Screen
 * Touch
 * Scales
 * SeekThermal
 * GridEye
 * Inverter
 * Other electronics
 * OS Software

The Gantt chart below breaks it out into a bit more detail with some rough timing. I have only staggered out the next two weeks because I expect predicting that far out is ambitious, further would be silly.

I've also used a different program to generate the gantt chart with a different style of export, trying out Gnome Planner instead of Gantt Project. I confess I don't really like either of them.

### Gantt Chart

<a href="/microwave_plan/index.html">view fullscreen</a><br/>
<iframe title="Gantt chart" style="width:100%; height:100vh;" src="/microwave_plan/index.html">
