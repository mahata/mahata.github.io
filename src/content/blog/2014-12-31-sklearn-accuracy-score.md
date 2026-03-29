---
title: Scikit-learn accuracy_score
date: 2014-12-31
---

I've been using scikit-learn for machine learning tasks. The `accuracy_score` function is useful for classification tasks.

```python
from sklearn.metrics import accuracy_score

y_true = [1, 2, 3, 4]
y_pred = [1, 2, 3, 3]

accuracy_score(y_true, y_pred)
# => 0.75
```

The accuracy is calculated as: (number of correct predictions) / (total number of predictions).

In this case: 3 correct out of 4 = 0.75
