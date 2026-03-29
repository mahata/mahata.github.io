---
title: Self portability 2
date: 2017-02-04
---

Continuing from my previous post on code portability...

## Environment Variables

Using environment variables is a great way to make code portable:

```python
import os

# Instead of hardcoding paths:
db_path = os.environ.get('DATABASE_PATH', '/tmp/db.sqlite')
api_key = os.environ.get('API_KEY')

# With validation:
debug = os.environ.get('DEBUG', 'false').lower() == 'true'
```

## Configuration Files

Separate configuration from code:

```python
import json
import os

config_path = os.path.join(os.path.dirname(__file__), 'config.json')
with open(config_path) as f:
    config = json.load(f)
```

This approach allows different configurations for different environments without changing code.
