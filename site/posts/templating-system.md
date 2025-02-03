---
title: Templating system
date: 2010-03-29
categories: Junkcode
tags:
    - m4
    - template toolkit
    - templating
---

       
I knew when I started this project (which was a while ago, I kinda cheated on this one) that I didn't want to write out all the HTML myself, I'm not THAT masochistic.  What I wanted to do was basically say &#8220;make a text box to write the address in&#8221;.

So I started with a generic preprocessor.  I've use preprocessors such as <a href="http://en.wikipedia.org/wiki/C_preprocessor">CPP</a>, <a href="http://en.wikipedia.org/wiki/TeX">TeX</a> and <a href="http://en.wikipedia.org/wiki/Make_%28software%29">Make</a> so figured I would take a generic preprocessor like <a href="http://en.wikipedia.org/wiki/M4_%28computer_language%29">M4</a> and define a few HTML macros&#8230; problem solved.  Unfortunately it wasn't that simple and as I added complexity it got harder to keep it all straight, particularly the quoting.

The basic text box wasn't too bad.

<p><font face="monospace">
<font color="#ff6060">dnl TEXT_Q(name, label, [length])</font><br/>
<font color="#00ffff">define(</font><font color="#ffff00">'TEXT_Q'</font>, <font color="#ffff00">`</font><font color="#00ffff"><b>indir(</b></font>LAYOUT, <font color="#ffff00">'</font><font color="#00ff00">$1</font><font color="#ffff00">'</font>,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<font color="#ffff00">'&lt;label for=&quot;</font><font color="#00ff00">$1</font><font color="#ffff00">_text&quot;&gt;</font><font color="#00ff00">$2</font><font color="#ffff00">&lt;/label&gt;'</font>,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<font color="#ffff00">'&lt;input id="</font><font color="#00ff00">$1</font><font color="#ffff00">_text" name="</font><font color="#00ff00">$1</font><font color="#ffff00">"&gt; </font><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#00ffff"><b>ifelse(</b></font><font color="#00ff00">$3</font>, <font color="#ffff00">''</font>, <font color="#ffff00">''</font>, <font color="#ffff00">'size=&quot;</font><font color="#00ff00">$3</font><font color="#ffff00">&quot;'</font><font color="#00ffff"><b>)</b></font><font color="#ffff00">&gt;&#8217;</font>
</font></p>

But when I tried to create optional groupings it started to get messy.  This is a snippit from TABULAR_OPTIONAL_ROWS and calling it.

<p><font face="monospace">
&nbsp;&nbsp;&nbsp;&nbsp;<font color="#ff6060">dnl Build the heading rows</font><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;tr class=&quot;tabular_optional_rows_heading_row&quot;&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<font color="#00ffff">pushdef(</font><font color="#ffff00">\`LAYOUT'</font>, <font color="#ffff00">&#8220;TABULAR_OPTIONAL_ROWS_HEADING_LAYOUT&#8221;</font><font color="#00ffff">)</font><br/>
&nbsp;&nbsp;&nbsp;&nbsp;foreach(\`XXXXX', (dquote(<font color="#00ffff"><b>shift(</b></font><font color="#00ff00">$@</font><font color="#00ffff"><b>)</b></font>)), \`XXXXX')<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<font color="#00ff00"><b>popdef(</b></font><font color="#ffff00">\`LAYOUT'</font><font color="#00ff00"><b>)</b></font><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;/tr&gt;
</font></p>

<p>
<font face="monospace">
<font color="#00ff00"><b>TABULAR_OPTIONAL_ROWS(</b></font><font color="#00ffff">3, </font><br/>
<font color="#00ffff">&nbsp;&nbsp;&nbsp;&nbsp;</font><font color="#ffff00">`</font><font color="#00ff00"><b>TEXT_Q(</b></font><font color="#00ffff">salary_abn, Payers Australian business number, 11</font><font color="#00ff00"><b>)</b></font><font color="#ffff00">&#8216;</font><font color="#00ffff">, </font><font color="#ff6060">dnl TODO: Should be Payer's</font><br/>
<font color="#00ffff">&nbsp;&nbsp;&nbsp;&nbsp;</font><font color="#ffff00">&#8230;</font>
</font>
</p>

With TABULAR_OPTIONAL_ROWS I couldn't figure out how to have a variable number of rows and I couldn't figure out how to pass it's options without quoting so I decided to throw in the towel and switch to something else.

I had experimented with <a href="http://template-toolkit.org/">Template Toolkit</a> at work using it to inject snippits of Javascript into HTML documents.  In the end I stopped using it and had a static HTML page which included a fully generated Javascript file but the short exposure I had impressed me and I tried it here.  I found it much cleaner, the named parameters cut out a lot of complexity and the ability to just drop back to Perl if I wanted to do something really hairy was nice.

This is the definition of a text box followed by the calling syntax of a radio box that toggles the visibility of the text box.

<p><font face="monospace">
<font color="#00ffff">&lt;</font><font color="#00ffff"><b>tr</b></font><font color="#00ffff">&nbsp;</font><font color="#00ff00"><b>class</b></font><font color="#00ffff">=</font><font color="#ffff00">&quot;text&quot;</font><font color="#00ffff">&nbsp;</font><font color="#00ff00"><b>id</b></font><font color="#00ffff">=</font><font color="#ffff00">&quot;</font><font color="#00ff00"><b>[%</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff">name</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ff00"><b>%]</b></font><font color="#ffff00">_row&quot;</font><font color="#00ffff">&nbsp;</font><br/>
<font color="#00ffff">&nbsp;&nbsp;&nbsp;&nbsp;</font><font color="#00ff00"><b>[%-</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff"><b>IF</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff">hide</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ff00"><b>-%]</b></font><br/>
<font color="#00ffff">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font><font color="#00ff00"><b>style</b></font><font color="#00ffff">=</font><font color="#ffff00">&quot;display: none&quot;</font><br/>
<font color="#00ffff">&nbsp;&nbsp;&nbsp;&nbsp;</font><font color="#00ff00"><b>[%-</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff"><b>END</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ff00"><b>-%]</b></font><br/>
<font color="#00ffff">&gt;</font><br/>
<font color="#00ffff">&lt;</font><font color="#00ffff"><b>td</b></font><font color="#00ffff">&nbsp;</font><font color="#00ff00"><b>class</b></font><font color="#00ffff">=</font><font color="#ffff00">&quot;question&quot;</font><font color="#00ffff">&gt;</font><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<font color="#00ffff">&lt;</font><font color="#00ffff"><b>label</b></font><font color="#00ffff">&nbsp;</font><font color="#00ff00"><b>for</b></font><font color="#00ffff">=</font><font color="#ffff00">&quot;</font><font color="#00ff00"><b>[%</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff">name</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ff00"><b>%]</b></font><font color="#ffff00">_id&quot;</font><font color="#00ffff">&gt;</font><font color="#00ff00"><b>[%</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff">text</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ff00"><b>%]</b></font><font color="#00ffff">&lt;/</font><font color="#00ffff"><b>label</b></font><font color="#00ffff">&gt;</font><br/>
<font color="#00ffff">&lt;/</font><font color="#00ffff"><b>td</b></font><font color="#00ffff">&gt;</font><br/>
<font color="#00ffff">&lt;</font><font color="#00ffff"><b>td</b></font><font color="#00ffff">&nbsp;</font><font color="#00ff00"><b>class</b></font><font color="#00ffff">=</font><font color="#ffff00">&quot;answer&quot;</font><font color="#00ffff">&gt;</font><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<font color="#00ffff">&lt;</font><font color="#00ffff"><b>input</b></font><font color="#00ffff">&nbsp;</font><font color="#00ff00"><b>type</b></font><font color="#00ffff">=</font><font color="#ffff00">&quot;text&quot;</font><font color="#00ffff">&nbsp;</font><font color="#00ff00"><b>name</b></font><font color="#00ffff">=</font><font color="#ffff00">&quot;</font><font color="#00ff00"><b>[%</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff">name</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ff00"><b>%]</b></font><font color="#ffff00">&quot;</font><font color="#00ffff">&nbsp;</font><font color="#00ff00"><b>id</b></font><font color="#00ffff">=</font><font color="#ffff00">&quot;</font><font color="#00ff00"><b>[%</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff">name</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ff00"><b>%]</b></font><font color="#ffff00">_id&quot;</font><font color="#00ffff">&gt;</font><br/>
<font color="#00ffff">&lt;/</font><font color="#00ffff"><b>td</b></font><font color="#00ffff">&gt;</font><br/>
<font color="#00ffff">&lt;/</font><font color="#00ffff"><b>tr</b></font><font color="#00ffff">&gt;</font>
</font></p>

<p><font face="monospace"><br/>
<font color="#00ff00"><b>[%</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff"><b>INCLUDE</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#ffff00">tax/radio</font><br/>
<font color="#00ff00"><b>&nbsp;&nbsp;&nbsp;&nbsp;</b></font><font color="#00ffff">name</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff"><b>=</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#ffff00">&quot;surname_changed&quot;</font><br/>
<font color="#00ff00"><b>&nbsp;&nbsp;&nbsp;&nbsp;</b></font><font color="#00ffff">text</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff"><b>=</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#ffff00">&quot;Has any part of your name changed since completing your last tax return?&quot;</font><br/>
<font color="#00ff00"><b>&nbsp;&nbsp;&nbsp;&nbsp;</b></font><font color="#00ffff">modify</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff"><b>=</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#ffff00">&quot;previous_surname&quot;</font><br/>
<font color="#00ff00"><b>&nbsp;&nbsp;&nbsp;&nbsp;</b></font><font color="#00ffff">options</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff"><b>=</b></font><font color="#00ff00"><b>&nbsp;</b></font>[{<font color="#00ffff">name</font>&nbsp;<font color="#00ffff"><b>=&gt;</b></font>&nbsp;<font color="#ffff00">&quot;Yes&quot;</font><font color="#00ffff"><b>,</b></font>&nbsp;<font color="#00ffff">action</font>&nbsp;<font color="#00ffff"><b>=&gt;</b></font>&nbsp;<font color="#ffff00">&quot;show&quot;</font>}<font color="#00ffff"><b>,</b></font>&nbsp;{<font color="#00ffff">name</font>&nbsp;<font color="#00ffff"><b>=&gt;</b></font>&nbsp;<font color="#ffff00">&quot;No&quot;</font><font color="#00ffff"><b>,</b></font>&nbsp;<font color="#00ffff">action</font>&nbsp;<font color="#00ffff"><b>=&gt;</b></font>&nbsp;<font color="#ffff00">&quot;hide&quot;</font>}]<br/>
<font color="#00ff00"><b>%]</b></font>
</font></p>

<p><font face="monospace"><br/>
<font color="#00ff00"><b>[%</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff"><b>INCLUDE</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#ffff00">tax/text</font><br/>
<font color="#00ff00"><b>&nbsp;&nbsp;&nbsp;&nbsp;</b></font><font color="#00ffff">name</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff"><b>=</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#ffff00">&quot;previous_surname&quot;</font><br/>
<font color="#00ff00"><b>&nbsp;&nbsp;&nbsp;&nbsp;</b></font><font color="#00ffff">text</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff"><b>=</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#ffff00">&quot;Previous surname&quot;</font><br/>
<font color="#00ff00"><b>&nbsp;&nbsp;&nbsp;&nbsp;</b></font><font color="#00ffff">hide</font><font color="#00ff00"><b>&nbsp;</b></font><font color="#00ffff"><b>=</b></font><font color="#00ff00"><b>&nbsp;</b></font><font color="#ffff00">&quot;true&quot;</font><br/>
<font color="#00ff00"><b>%]</b></font><br/>
</font></font>
</font></p>


The normal syntax for options is simply [&#8220;Yes&#8221;, &#8220;No&#8221;], the Perl fallback I mentioned earlier allows me to have more complex syntax when I need it but keeps things simple most of the time.  I've since discovered there's a <a href="http://tt3.template-toolkit.org/">Template Toolkit version three</a> that's a nice step forward but it's listed as still in development and in a very Alpha state, it also smelt a bit like it was suffering from <a href="http://en.wikipedia.org/wiki/Second-system_effect">classic second project woes</a>.  I think I'm playing with enough new stuff not to add experimental <a href="http://template-toolkit.org/">Template Toolkit</a> versions to the list.
