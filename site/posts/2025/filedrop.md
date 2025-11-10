---
title: Filedrop
date: 2025-11-10
tags: ["ansible", "sre", "code"]
category: Ansible
---

When I was working at Planet one of the more impactful tasks I did was a from-scratch rework of the groundstation ansible repository.  We originally ran a classic structure with task based roles like network-configuration or data-transfer. The catch was our fleet wasn't really cattle, we serviced multiple satellite constellations using multiple satellite dish models in multiple ways.  This web of complexity and different combinations exposed itself in each role where it was handled in different ways.  The complexity meant that a change to a variable could ripple out to many roles, the whole system was fragile and inhibited us doing what we needed to do.

The new system we migrated to pulled all of that complexity up to the top level.  We had a roles such as constellation A high speed data that did the network configuration, set up the data transfer, and everything else required.  The roles were logically simpler, there were no longer functionality branches, but they also did much more.  To handle that much more I came up with filedrop.

The filedrop I created for Planet is simultaneously the best and worst Ansible code I have ever written.  It takes a tree of directories, files and templates and transfers them to the destination system. It also has fine grained permission and notifications using a regex, which allows things like any files transferred to /etc/ssh/ will be owned by root and only root writable, and if any of the ssh files change it will trigger a restart of the ssh service, but not if the non-ssh files change.  It's a role, pure yaml, about eight ansible tasks but about 100 lines long with horrendous variable manipulation and any attempts to debug it required copying a line out and exploding it into debug statements to track what it was actually doing.

For the benefit of humanity that version of filedrop is safely locked away on Planet's servers.  However I always thought I could do better by building a proper module. Something that could actually be debugged, was reliable enough for others to use and was less embarrassing to put my name to.

Finally that brings us to https://github.com/lod/filedrop

It is a proper ansible role, written in python with readable code, comments, and nice logic, it even has tests.  It still orchestrates ansible copy actions under the hood, but it is something that I would be comfortable using in the future, and having others use.

Available through Ansible Galaxy as lod.filedrop details at https://galaxy.ansible.com/ui/repo/published/lod/filedrop/
