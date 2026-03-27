---
title: Replicate AWS Elasticsearch Domain
date: 2018-11-01
---

How to replicate an AWS Elasticsearch domain configuration?

## Using AWS CLI

```bash
# Get domain config
aws es describe-elasticsearch-domain \
    --domain-name my-domain \
    --output json > domain-config.json

# Create new domain with same config
aws es create-elasticsearch-domain \
    --domain-name my-domain-copy \
    --elasticsearch-cluster-config file://domain-config.json
```

## Important Considerations

1. **IAM policies** - These need to be recreated separately
2. **Access policies** - Export and import separately
3. **Encryption** - Ensure KMS key permissions are set up

## Backing up indices

```bash
# Create snapshot
curl -X PUT "https://es-endpoint/_snapshot/my-repo/snapshot-1"

# Restore
curl -X POST "https://es-endpoint/_snapshot/my-repo/snapshot-1/_restore"
```

Remember to test the replication in a non-production environment first.
