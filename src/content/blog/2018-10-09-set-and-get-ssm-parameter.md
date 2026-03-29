---
title: Set and get SSM parameter
date: 2018-10-09
---

AWS Systems Manager Parameter Store is a great service for storing configuration data.

## Using AWS CLI

```bash
# Set a parameter
aws ssm put-parameter \
    --name "/myapp/database/host" \
    --value "mydb.example.com" \
    --type String

# Get a parameter
aws ssm get-parameter \
    --name "/myapp/database/host"
```

## Using Python (boto3)

```python
import boto3

ssm = boto3.client('ssm')

# Set parameter
ssm.put_parameter(
    Name='/myapp/database/host',
    Value='mydb.example.com',
    Type='String'
)

# Get parameter
response = ssm.get_parameter(Name='/myapp/database/host')
value = response['Parameter']['Value']
```

Parameters can be encrypted using KMS for sensitive data.
