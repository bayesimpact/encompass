# Performance Testing Resources
## Summary
This directory contains resources for testing Encompass using [Apache JMeter](https://jmeter.apache.org).

## Scenario 1
This test simulates typical user behaviour through the HTTP interface. Each agent performs the following steps in sequence:
1. Requests the home page.
2. Selects a dataset at random and requests its representative points.
3. Requests the adequacies for that dataset using the driving distance metric.
4. Idles for 60-90 seconds to simulate playing with the frontend analysis and features.
