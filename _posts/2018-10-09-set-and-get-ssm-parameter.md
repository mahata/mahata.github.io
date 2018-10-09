---
layout: post
title: Set and Get parameters of AWS Parameter Store with Python
category: AWS
---

Let's think about storing credential information in [AWS System Manager (SSM)](https://docs.aws.amazon.com/en_us/systems-manager/latest/userguide/what-is-systems-manager.html). Following example assumes that the sensitive information is stored in `credential.json`.

Create a tiny Python snippet as follows:

```python
#!/usr/bin/env python3

import json
import base64

# Convert credential json file to base64
with open('credential.json') as f:
    json_data = json.load(f)
str_json = json.dumps(json_data)
b64data = base64.b64encode(str_json.encode('utf-8'))

print(b64data)
```

Let's name the Python script as `base64encode.py`. We can store the result of the script, which is a base64 string of `credential.json`, to AWS System Manager Parameter Store with `aws` command (ref: [Online manual of aws ssm put-parameter](https://docs.aws.amazon.com/kms/latest/developerguide/services-parameter-store.html)):

```
$ aws ssm put-parameter --name MyParameter --value $(./base64encode.py) --type SecureString --description "description of the parameter, which is optional"
{
    "Version": 1
}
```

By the command above, new parameter "MyParameter" in Parameter Store has just become available. Yay!

To retrieve the parameter, try running a script like following:

```python
#!/usr/bin/env python3

import boto3

# "region_name" here may be different depending on your default region
ssm = boto3.client('ssm', region_name='ap-northeast-1')

response = ssm.get_parameters(
    Names=['MyParameter'],
    WithDecryption=True
)

print(response['Parameters'][0]['Value'])
```

Enjoy!
