---
title: Socks5 proxy from iOS
date: 2018-12-19
---

How to set up a SOCKS5 proxy from an iOS device?

## Using Shadowrocket (Recommended)

1. Download Shadowrocket from App Store
2. Add a SOCKS5 server configuration:
   - Server: your-proxy-server.com
   - Port: 1080
   - Username: your-username
   - Password: your-password
3. Enable the proxy

## Command line usage

```bash
# Using curl with SOCKS5
curl --socks5-hostname localhost:1080 https://example.com

# Using ssh as SOCKS5 proxy
ssh -D 1080 user@proxy-server.com
```

## Verify proxy is working

```bash
curl --socks5-hostname localhost:1080 https://api.ipify.org
```

This should return the IP address of your proxy server, not your device's IP.
