---
layout: post
title: SOCKS5 Proxy from iOS App
categories: [SSH, SOCKS, Network]
---

## Why SOCKS5 Proxy?

As a developer in Japan, I wanted my app to behave a bit differently when users outside of Japan tried to use it.

When I finished implementing the location-based features in my server-side code, I wanted to test the behavior with my iOS device. ...But how? Should I ask my friends living outside of Japan to try my app? Probably it's not the best idea. I guess [SOCKS5 proxy](https://en.wikipedia.org/wiki/SOCKS) is better option in this scenario.

Basically, what's needed is followings:

1. Spin up an instance in AWS or GCP (or whatever SaaS platform, which provides services in multiple regions)
2. Create a SSH connection from your local computer (Mac or Windows or whatever) to the instance just created as follows: `ssh -g -D 9999 ec2-user@new-instance.com`
3. Make a connection from your iOS app to the local computer with one of the VPN apps available in App Store or Google Play Store

If everything gets done properly, the entire connection would be: `(iOS) <===> (local computer) <===> (instance in AWS/GCP) <===> (remote server)`

I'm going to skip writing about 1., but dig a little bit deeper about 2. and 3.

## Create a SSH connection from local computer to an instance in SaaS platform

As described above, concrete command would look like following:

```
ssh -g -D 9999 ec2-user@new-instance.com
```

`-g` option is the key here. In `man` page, the `-g` option is described as: `Allows remote hosts to connect to local forwarded ports.`

We let our iOS app to connect to the local computer to access to the remote server through `new-instance.com`, which means we need to allow incoming access to the local computer from external iOS app. That's why `-g` option is required.

## Make a connection from your iOS app to the local computer

I've chosen to use [Potatso Lite](https://itunes.apple.com/jp/app/potatso-lite/id1239860606) simply because it was popular in App Store (plus, it's completely free!!).

![Potatso Lite](/images/posts/screenshots/potatso_lite.png)

`192.168.100.211` in the screenshot is the local ip address of the local computer to connect to from the iOS app. It's assuming that the iOS app and the local computer are in the same Local Area Network (LAN).

Once the connection gets established, you're good to go :-) Enjoy the app with the disguised location.
