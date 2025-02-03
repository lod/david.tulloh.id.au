---
title: Thermal imager gradient fix
date: 2015-08-04
categories: Microwave
tags:
  - microwave
  - thermal imaging
  - electronics
---

One of the thermal imagers I have been considering using is the <a href="http://thermal.com/">Seek Thermal camera</a>. An impressive camera, currently only available in the US, they use a Raytheon sensor to create a small USB camera designed to be used with a mobile phone. Most importantly for me it supports a wide range of temperature, an intentional limitation with the FLIR cores.

Sadly the camera has some issues. All thermal sensors require post-processing to clean up the image and work around quality issues with the image, it is a bit more complex than a standard CCD. The Seek camera does some basic processing in the device but most of the image manipulation required to get the camera working is performed in the Android application. Seek has been promising an SDK since the product was first announced, presumably this will allow other clients to be used, but no SDK has been forthcoming.

I have been spending a fair bit of time trying to understand how to use their factory calibration values and get a good temperature reading out of the device, so far unsuccessfully.

As a side effort I spent a bit of time working on another problem with the device, with more success.

When first released the camera had an erroneous thermal gradient at the edges and particularly the corners. This was particularly obvious if you pointed the camera at a thermally flat surface, such as a wall, the autoscaling would highlight the error as the only variation in the image. Various people reported that adjusting the lens holder helped and that the problem varied with time. I believe that the issue is a combination of the lens holder being imperfectly aligned and so its temperature influences the sensor, the lens holder is heated by the circuitry around it and so gets worse with time.

Early this year Seek corrected the problem with a software update. Looking at version numbers of each component it was clear that the fix was purely post-processing performed by the Android application. They have never responded to questions on how this was achieved.

I have managed to figure out their technique and have documented it in an Octave/Matlab function which reproduces the process used. Hopefully this will allow people making <a href="https://github.com/lod/seek-thermal-documentation/wiki/Clients">independent clients</a> to apply similar corrections and allow the camera to be used with non-phone devices.

I discuss details of the technique on the <a href="http://www.eevblog.com/forum/testgear/yet-another-cheap-thermal-imager-incoming/msg723056/#msg723056">eevblog forum</a> where most of the Seek dissection has taken place. The script is also relatively simple and commented for anyone with Matlab experience.

Some before and after photos of the processing. A thermally flat image and some ugly face.

<table style="width: 540px">
<tr>
<td style="border: none;"><img src="/images/wp/floor_pre.png" style="width: 250px"><br/><span class="caption" style="display: block; text-align: center;">Before &#8211; Floor</span></td>
<td style="border: none;"><img src="/images/wp/floor_post.png" style="width: 250px"><br/><span class="caption" style="display: block; text-align: center;">After &#8211; Floor</span></td>
</tr>
</table>
<table style="width: 540px">
<tr>
<td style="border: none;"><img src="/images/wp/face_pre.png" style="width: 250px"><br/><span class="caption" style="display: block; text-align: center;">Before &#8211; Face</span></td>
<td style="border: none;"><img src="/images/wp/face_post.png" style="width: 250px"><br/><span class="caption" style="display: block; text-align: center;">After &#8211; Face</span></td>
</tr>
</table>

It is interesting to see that the corrections to the face go far further than I initially expected.<br/>
The fixup in the bottom right corner is obvious, the gradient gets changed to a flat background.<br/>
However the fixes around the bottom of my face were startling, my neck gets corrected to a much better temperature, the beard cools down and the jumper collar cools right off. I think all these revised details are more accurate.

Source code, including the raw data of my face and usage instructions, is on github.

* https://github.com/lod/seek-thermal-documentation/tree/master/scripts/thermal_gradient
