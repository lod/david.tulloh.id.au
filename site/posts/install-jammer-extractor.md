---
title: Install Jammer Extractor
date: 2016-12-03
categories: junkcode
tags:
  - junkcode
  - perl

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

<div id="toc_container" class="no_bullets"><p class="toc_title">Contents</p>
<ul class="toc_list"><li><a href="index.html#UPX"><span class="toc_number toc_depth_1">1</span> UPX</a></li><li><a href="index.html#Install_Jammer_Extractor"><span class="toc_number toc_depth_1">2</span> Install Jammer Extractor</a></li><li><a href="index.html#ZLib_files"><span class="toc_number toc_depth_1">3</span> ZLib files</a></li><li><a href="index.html#LZMA_files"><span class="toc_number toc_depth_1">4</span> LZMA files</a></li><li><a href="index.html#TCL_scripts"><span class="toc_number toc_depth_1">5</span> TCL scripts</a></li><li><a href="index.html#References"><span class="toc_number toc_depth_1">6</span> References</a></li></ul></div>

<style>h2 {margin-top: 1.5em} .post td {padding: 5px}</style>

I recently spent a few days reverse engineering an <a href="http://www.installjammer.com/">Install Jammer</a> generated binary installer, specifically the <a href="http://www.nxp.com/lpcxpresso/">LPCXpresso installer</a> supplied by NXP. The goal was to try and install the program without running the binary installer as root. I managed to create a <a href="https://github.com/lod/unpack-install-jammer">perl script</a> which unpacks the install files into a local directory.

<h2 id="upx"><span id="UPX">UPX</span></h2>
One of the first things I noticed when examining the installer was a UPX header

<pre><code>00000070: 0010 0000 ea2d 27a5 5550 5821 e811 0d0c  .....-&#39;.UPX!....</code></pre>

I hadn't played with <a href="https://upx.github.io/">UPX</a> before but it is a system to compress executable files. There are two parts, a program which compresses the executable and a decompression program which gets prepended to the compressed file.

When the executable is run it uncompresses the payload and restarts the execution at the start of the new executable.

<a href="https://upx.github.io/">UPX</a> is an open source project with some nice tools. Specifically they provide a program which can read the UPX headers and provide information and decompress the binary. They strongly advocate not messing things up so that these tools can function.

Unfortunately all the leading google results, stack overflow entries and forum queries are centered around preventing people from uncompressing the binary. Given the way UPX works it is easy to slightly modify the decompilation and compilation process in a way that causes incompatibility. UPX also makes a special effort to allow GDB to work, which is easy to sabotage. These things contribute to make UPX very popular with virus writers as a masking element.

Naturally Install Jammer did all of this. I extracted the UPX header by hand but it refers to a compression scheme which doesn't exist in the original program. The sections and section headers that UPX uses are missing or masked, a commonly recommended technique to prevent decompression. Attempting to run using GDB didn't provide any useful information.

It should be possible to extract the assembler instructions and figure out or run the decompression routine. However that was beyond me and I found an easier approach.

<h2 id="install-jammer-extractor"><span id="Install_Jammer_Extractor">Install Jammer Extractor</span></h2>
The <a href="http://www.installjammer.com/">Install Jammer</a> program which generates the final install binaries comes with binary blobs that are prepended to the final installer.

This precompiled program looks at the rest of the file and extracts from it the install files. Looking at the strings there are what looks like file names in the install blob.

I simplified the problem by creating an Install Jammer installer of my own containing a small collection of scripts.

Inside the generated binary is a section with the following lines (there are actually two, identical sections&#8230; no idea why):

<pre><code>0015af60: 0000 0000 0000 0000 0000 0000 0046 494c  .............FIL
0015af70: 455a 4c30 3637 3239 3039 412d 3946 3236  EZL0672909A-9F26
0015af80: 2d33 4539 312d 4242 4546 2d30 3241 3230  -3E91-BBEF-02A20
0015af90: 3633 3238 3639 3200 0000 0000 0000 0000  6328692.........
0015afa0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
0015afb0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
0015afc0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
0015afd0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
0015afe0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
0015aff0: 0000 0034 3431 0000 0000 0000 0000 0032  ...441.........2
0015b000: 3632 0000 0000 0000 0000 0031 3437 3337  62.........14737
0015b010: 3432 3339 3400 0000 0031 3137 3830 3031  42394....1178001</code></pre>
It looks like a filename and several numbers encoded as strings, I found the filename portion in one of the intermediate files generated in the installer generation, Linux-x86-files.tcl, this allows much of the detail to be identified. The compressed address and size refer to the position and size of a blob within the install binary, this was confirmed by sequencing multiple adjacent entries.

<pre><code>File ::0672909A-9F26-3E91-BBEF-02A206328692 -name compiles.t -parent 81FF3CF4-D2FD-4649-FA7F-C2640F59BE65 -directory &lt;%InstallDir%&gt;/t -size 441 -mtime 1473742394 -permissions 00644 -filemethod 0</code></pre>
<table style="width: auto; margin: 3em auto;">
<tbody>
<tr class="odd">
<td align="left">FILE</td>
<td align="left">start marker</td>
</tr>
<tr class="even">
<td align="left">ZL</td>
<td align="left">flag</td>
</tr>
<tr class="odd">
<td align="left">0672909A-9F26-3E91-BBEF-02A206328692</td>
<td align="left">id string</td>
</tr>
<tr class="even">
<td align="left">441</td>
<td align="left">extracted size</td>
</tr>
<tr class="odd">
<td align="left">262</td>
<td align="left">compressed size</td>
</tr>
<tr class="even">
<td align="left">1473742394</td>
<td align="left">mtime</td>
</tr>
<tr class="odd">
<td align="left">1178001</td>
<td align="left">blob address (#11F96F)</td>
</tr>
</tbody>
</table>
<h2 id="zlib-files"><span id="ZLib_files">ZLib files</span></h2>
I extracted the compressed blob and grabbed the matching uncompressed file. I tried several different compression techniques on the uncompressed file and tried matching them to the extracted blob. Zlib, attempted due to the ZL flag, was a very close match. Below is an example very small file.:

<pre><code>&gt; zlib-flate -compress &lt; original_file | xxd
00000000: 789c 2b4a 4db3 5228 4a4d 2bd6 2f4a cdcd  x.+JM.R(JM+./J..
00000010: 2f49 2dd6 cf2f ca4c cfcc d3cf 4d2c 2e49  /I-../.L....M,.I
00000020: 2de2 0200 c596 0bf2                      -.......</code></pre>
Extracted blob, lined up to match:

<pre><code>00000000: 0000 2b4a 4db3 5228 4a4d 2bd6 2f4a cdcd  ..+JM.R(JM+./J..
00000010: 2f49 2dd6 cf2f ca4c cfcc d3cf 4d2c 2e49  /I-../.L....M,.I
00000020: 2de2 0200                                -...</code></pre>
The ZLib header and footer are both missing. The header sets the compression method and options such as the dictionary to use. Adding the standard header bytes allowed the extracted blob to uncompressed using zlib-flate -uncompress. The four byte footer is a checksum which seems to be optional.

This technique allowed all the install files to be extracted however their names and structure of the directory tree were lost.

<h2 id="lzma-files"><span id="LZMA_files">LZMA files</span></h2>
Along with the ZLib compressed install files are a bunch of tcl files with an LZ flag. These have full names and seem to be the files necessary to run the installer, including files for tcl and the necessary libraries.

The tcl files are not from my system, some of them have different versions or do not exist at all. I chose iso8859-3.enc to examine, assuming that it was likely to be the same as my version.

I assumed the encoding used was LZMA (Lempel-Ziv-Markov chain algorithm) partially because I had noticed a binary library called craplzma in the Install Jammer application files. Unfortunately LZMA is, like the name suggests, an algorithm which is used by multiple different archivers such as 7-Zip, LZip, XZ and more. Most of the archive containers specify how to store multiple files but for a single file it turns out you can just tack the appropriate header on and any program will extract it.

The header that matched most closely was LZMA alone or LZMA1. Which is conveniently supported by the Perl Compress::Raw::Lzma module. :

<pre><code>cat /usr/share/tcltk/tcl8.5/encoding/iso8859-3.enc | lzma -z | xxd
00000000: 5d00 0080 00ff ffff ffff ffff ff00 1188  ]...............
00000010: 0528 b979 d70b 91f8 28ae b6ac 59fc 1cbb  .(.y....(...Y...</code></pre>
Extracted blob, first line:

<pre><code>5d00 0080 0000 1188 0528 b979 d70b 91f8</code></pre>
The LZMA file format defined a header:

<ul>
<li>2 bytes properties</li>
<li>4 bytes dictionary size</li>
<li>8 bytes uncompressed size</li>
</ul>
Our extracted blob is missing the uncompressed size field. Fortunately passing a size of FFFF FFFF to the decompression routine indicates an unknown size, splicing this field in allowed all the LZ flagged files to be extracted.

<h2 id="tcl-scripts"><span id="TCL_scripts">TCL scripts</span></h2>
Install Jammer is largely a TCL project, I believe it is a C++ base which uses TCL to perform the GUI tasks, allow scriptable extension and do most of the work.

The intermediate files created by the installer build process include a bunch of TCL generated scripts, these scripts rename the extracted files from their stored ID names to the final name. They also create the directories, symlinks if required and set the mtime for the files. It looks like the script is meant to set the permissions for the files but this doesn't actually work, everthing is set to 777, there is no facility to set the ownership.

Extracting the files from the installer this script can be found in main2.tcl for my generated file or main.tcl for the lpcxpresso installer. I ended up just processing every root directory tcl script to be safe.

The tcl script contains lines like the following which are fairly simple to parse. By combining these lines with the entry table extracted from the installer binary each file can be extracted, decompressed and placed in the appropriate location.

<pre><code>File ::4D49D586-0ADF-966C-3FC4-8DB31B47B741 -name dumpio2curl -parent 81FF3CF4-D2FD-4649-FA7F-C2640F59BE65 -directory &lt;%InstallDir%&gt; -type dir -permissions 040755 -filemethod 0
File ::381BB57B-2E9F-3012-F9BB-C1752B423A6E -name .travis.yml -parent 81FF3CF4-D2FD-4649-FA7F-C2640F59BE65 -directory &lt;%InstallDir%&gt; -size 164 -mtime 1473742394 -permissions 00644 -filemethod 0</code></pre>
The last step was to parse the tcl script for info variable block. This gives the variables such as InstallDir which are embedded in the File entry. Several of these variables would typically be set by the install wizard, we support this by allowing the user to pass values on the command line, either to customise the install or provide variables which are missing.

<h2><span id="References">References</span></h2>
<ul>
<li><a href="https://github.com/lod/unpack-install-jammer">Produced unpacking script &lt;https://github.com/lod/unpack-install-jammer&gt;</a></li>
<li><a href="http://www.nxp.com/lpcxpresso/">LPCXpresso installer &lt;http://www.nxp.com/lpcxpresso/&gt;</a></li>
<li><a href="http://www.installjammer.com/">Install Jammer &lt;http://www.installjammer.com/&gt;</a></li>
</ul>
