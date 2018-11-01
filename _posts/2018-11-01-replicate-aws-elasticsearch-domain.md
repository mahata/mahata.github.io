---
layout: post
title: How to replicate domains of AWS Elasticsearch Service
categories: [AWS]
---

There're [an official documents](https://docs.aws.amazon.com/en_us/elasticsearch-service/latest/developerguide/es-managedomains-snapshots.html) that explain how to replicate domains of AWS Elasticsearch Service with a snapshot. It's helpful, but it avoids telling the details of each operation on purpose, because details may change in the future. However, I believe it's worth writing the concrete steps to achieve the domain replication even though they may change in the future. Hence I'm writing this blog article ;)

In short, what's needed is followings:

1. Create a new AWS Role for the operation
2. Configure S3 Bucket Policy so that the AWS Role created above can access to the S3 bucket
3. Register the S3 repository as a "Snapshot Repository"
4. Create a snapshot of the existing Elasticsearch domain
5. Create a new Elasticsearch domain
6. Recover indices from the snapshot taken in step 4.

In this document, I assume that Elasticsearch clusters exist in VPC, and they're accessible only through a bastion server. The bastion server is accessible through SSH, and accessing Elasticsearch clusters in VPC is done by SSH Socks Proxy which uses 1080 port of the localhost.

Here's the way to create such a proxy, just in case: `ssh -f -N -D 1080 bastion.example.com`

## 1. Create a new AWS Role for the operation

Create it from [AWS Console Panel](https://console.aws.amazon.com/iam/home) (Choose `EC2` as the service type). Once the role gets created, add followng JSON into `Trust relationships`:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "es.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

##  2. Configure S3 Bucket Policy so that the AWS Role created above can access to the S3 bucket

Go to "Bucket Policy" section in AWS Console Panel and append following JSON there:

```
{
    "Effect": "Allow",
    "Principal": {
        "AWS": "arn:aws:iam::165463520094:role/AmazonESRelation"
    },
    "Action": "s3:ListBucket",
    "Resource": "arn:aws:s3:::temporary"
},
{
    "Effect": "Allow",
    "Principal": {
        "AWS": "arn:aws:iam::165463520094:role/AmazonESRelation"
    },
    "Action": "s3:*",
    "Resource": "arn:aws:s3:::temporary/*"
}
```

`temporary` is the bucket name to store snapshots, in this example.

## 3. Register the S3 repository as a "Snapshot Repository"

From the code below, change `host` and `region` variables based on your AWS setting. Once the variables are set, just run it ;-)

```
$ cat register-repo.py
import boto3
import requests
import socks
import socket
from requests_aws4auth import AWS4Auth

host = 'https://vpc-my-original-domain-xxx.ap-northeast-1.es.amazonaws.com/' # include https:// and trailing /
region = 'ap-northeast-1'
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service)

path = '_snapshot/my-snapshot-repo' # the Elasticsearch API endpoint
url = host + path

payload = {
    "type": "s3",
    "settings": {
        "bucket": "temporary",
        "region": region,
        "role_arn": "arn:aws:iam::165463520094:role/AmazonESRelation",
    }
}

headers = {"Content-Type": "application/json"}

socks.set_default_proxy(socks.SOCKS5, "localhost", 1080)
socket.socket = socks.socksocket
r = requests.put(url, auth=awsauth, json=payload, headers=headers)

print(r.status_code)
print(r.text)

$ python register-repo.py
200
{"acknowledged":true}
```

## 4. Create a snapshot of the existing Elasticsearch domain

```
$ curl --proxy socks4://localhost:1080 -XPUT 'vpc-my-original-domain-xxx.ap-northeast-1.es.amazonaws.com/_snapshot/my-snapshot-repo/snapshot-20181101'
{"accepted":true}

# (Optional: You can check if the snapshot is actually created)
$ curl --proxy socks4://localhost:1080 -XGET 'vpc-my-original-domain-xxx.ap-northeast-1.es.amazonaws.com/_snapshot/my-snapshot-repo/_all?pretty'
{
  "snapshots" : [ {
    "snapshot" : "snapshot-20181101",
    ...
}
```

## 5. Create a new Elasticsearch domain

You can do it from AWS Console Panel ;-) Let's assume that we've created an Elasticsearch domain: `my-copied-domain`.

## 6. Recover indices from the snapshot taken in step 4.

In the following code, `host` variable is dummy. Please modify the part before running it:

* Register the new domain (`my-copied-domain`) for the snapshot repository

```
$ cat register-repo-copied.py
import boto3
import requests
import socks
import socket
from requests_aws4auth import AWS4Auth

host = 'https://vpc-my-copied-domain-xxx.ap-northeast-1.es.amazonaws.com/' # include https:// and trailing /
region = 'ap-northeast-1'
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service)

path = '_snapshot/my-snapshot-repo' # the Elasticsearch API endpoint
url = host + path

payload = {
    "type": "s3",
    "settings": {
        "bucket": "temporary",
        "region": region,
        "role_arn": "arn:aws:iam::165463520094:role/AmazonESRelation",
    }
}

headers = {"Content-Type": "application/json"}

socks.set_default_proxy(socks.SOCKS5, "localhost", 1080)
socket.socket = socks.socksocket
r = requests.put(url, auth=awsauth, json=payload, headers=headers)

print(r.status_code)
print(r.text)

$ python register-repo-copied.py
200
{"acknowledged":true}
```

* Read the snapshot and restore the whole indices

```
$ cat restore-all.py
import boto3
import requests
import socks
import socket
from requests_aws4auth import AWS4Auth

# the` host` is dummy. Please check the exact host name in AWS Console Panel
host = 'https://vpc-my-copied-domain-xxx.ap-northeast-1.es.amazonaws.com/' # include https:// and trailing /
region = 'ap-northeast-1' # e.g. us-west-1
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service)

path = '_snapshot/my-snapshot-repo/snapshot-20181029/_restore' # the Elasticsearch API endpoint
url = host + path
headers = {"Content-Type": "application/json"}

socks.set_default_proxy(socks.SOCKS5, "localhost", 1080)
socket.socket = socks.socksocket
r = requests.post(url, auth=awsauth, headers=headers)

print(r.status_code)
print(r.text)

$ python restore-all.py
200
{"accepted":true}
```

That should be it!
