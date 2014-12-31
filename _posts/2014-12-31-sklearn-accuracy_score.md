---
layout: post
title: How accuracy_score() in sklearn.metrics works
category: Machine Learning
---

`sklearn.metrics` has a method `accuracy_score()`, which returns "accuracy classification score". What it does is the calculation of "How accurate the classification is."

{% highlight python %}
#!/usr/bin/env python

import numpy as np
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score

# Input training data
training_points = [[-1, -1], [-2, -1], [-3, -2], [1, 1], [2, 1], [3, 2]]
training_labels = [1, 1, 1, 2, 2, 2]
X = np.array(training_points)
Y = np.array(training_labels)

# Create Naive Bayes classifier
clf = GaussianNB()
clf.fit(X, Y)

# Classify test data with the classifier
test_points = [[1, 1], [2, 2], [3, 3], [4, 3]]
test_labels = [2, 2, 2, 1]
predicts = clf.predict(test_points)

# Calculate Accuracy Rate manually
count = len(["ok" for idx, label in enumerate(test_labels) if label == predicts[idx]])
print "Accuracy Rate, which is calculated manually is: %f" % (float(count) / len(test_labels))

# Calculate Accuracy Rate by using accuracy_score()
print "Accuracy Rate, which is calculated by accuracy_score() is: %f" % accuracy_score(test_labels, predicts)
{% endhighlight %}
