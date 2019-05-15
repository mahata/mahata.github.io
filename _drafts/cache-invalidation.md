---
layout: post
title: How to invalidate Cache in Web Apps properly
categories: [http, cdn]
---

We have a system which roughly looks like following:

<!--
http://www.plantuml.com/plantuml/uml/SoWkIImgAStDuR8ABKujib98B5Oe1JAukFBoKr8Ld5ty80p_eipqp3mka9I2ZQwk7KX6mKh18oGaW0l410l2L3cavgK0ZGG0
-->
![Use Case Diagram](http://www.plantuml.com/plantuml/png/SoWkIImgAStDuR8ABKujib98B5Oe1JAukFBoKr8Ld5ty80p_eipqp3mka9I2ZQwk7KX6mKh18oGaW0l410l2L3cavgK0ZGG0)

A little while ago, we experienced an issue of not being able to show any contents to the users. What happened?
