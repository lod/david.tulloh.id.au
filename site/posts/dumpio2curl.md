---
title: dumpio2curl
date: 2015-01-15
categories: Junkcode
tags:
  - junkcode
  - perl
---
					

I have been playing around with duplicating another program's web service API. I want to be able to act as a substitute but need to rewrite it in a new language and change a bunch of its features. To do this I have been running the original program's functional tests against my own code.

Unfortunately it is sometimes difficult to see exactly what is going on. The tests are written in Python, which I am not very familiar with, and are wrapped through various layers adding different headers.

Happily Apache supports logging with [mod_dumpio](https://httpd.apache.org/docs/2.4/mod/mod_dumpio.html) so I can run the tests until they fail and then simply look at the last request. That was the plan at least, but a single call generates sixty lines of log. Much of it looking like the sample below, obviously the middle line is content the other two are noise.

```
[Thu Jan 15 10:06:08.118940 2015] [dumpio:trace7] [pid 1840] mod_dumpio.c(63): [client ::1:53956] mod_dumpio: dumpio_out (data-HEAP): 1 bytes
[Thu Jan 15 10:06:08.118945 2015] [dumpio:trace7] [pid 1840] mod_dumpio.c(103): [client ::1:53956] mod_dumpio: dumpio_out (data-HEAP): 0
[Thu Jan 15 10:06:08.118952 2015] [dumpio:trace7] [pid 1840] mod_dumpio.c(63): [client ::1:53956] mod_dumpio: dumpio_out (metadata-EOS): 0 bytes
```

A quick search online threw up [dumpio_parser.pl](http://uplex.de/dumpio_parser) which extracts the requests from log files. However it works for Apache 2.2, not the slightly modified format in Apache 2.4.

So I rewrote the input portion of dumpio_parser.pl.

Then the output was in a marginally useful format, it essentially provided the same content lines in the log. I wanted a format I could throw at curl to retry the request and see if my bug fix had worked.

Fixing that I was still not satisfied. I didn't like the output structure, it created a collection of tiny files, one for each request. And it ignored the output from the server. AND the structure was weird, first program I have seen using perl -n.

So I rewrote it.

Presenting [dumpio2curl](https://github.com/lod/dumpio2curl).

```
> tail -n 100 apache.log | perl ../dumpio2curl/dumpio2curl.pl 

# Tue Jan 13 10:23:22.729122 2015 - pid 15952 - client 50304
curl -v \
--header "User-agent:" --header "Accept:" \
--request "DELETE" \
--header "Accept-Encoding: identity" \
--header "Content-Length: 0" \
--header "X-Forwarded-For: 127.0.0.1" \
--header "X-Forwarded-Script-Name: " \
--header "X-Forwarded-Scheme: http" \
--header "X-Wsgiproxy-Version: 0.1" \
--header "X-Forwarded-Server: localhost:88" \
--header "Authorization: Hawk ..." \
http://localhost:88/1.5/68893

# Tue Jan 13 10:23:22.752411 2015 - pid 15952 - client 50304
# HTTP/1.1 200 OK
# Date: Mon, 12 Jan 2015 23:23:22 GMT
# Server: Apache/2.4.10 (Debian)
# X-Powered-By: PHP/5.6.4-1
# X-Weave-Timestamp: 1421105002.7521
# X-Last-Modified: 1421105002.73
# Content-Length: 2
# Content-Type: application/json; charset=utf8
# []
```
