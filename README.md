# Encompass

[![Build Status][build]](https://circleci.com/gh/bayesimpact/encompass) [![apache2]](https://www.apache.org/licenses/LICENSE-2.0)

[build]: https://img.shields.io/circleci/project/bayesimpact/encompass.svg?branch=master&style=flat-square
[apache2]: https://img.shields.io/badge/License-Apache%202.0-blue.svg
[![Waffle.io - Columns and their card count](https://badge.waffle.io/bayesimpact/encompass.svg?columns=all)](http://waffle.io/bayesimpact/encompass)

## Introduction
Encompass is an analytics and mapping tool built by [Bayes Impact](http://bayesimpact.org) that enables policymakers, researchers, and consumer advocates to analyze how accessibility to social services varies across demographic groups. Inadequate and untimely access to health care services is a major barrier to health equity for disadvantaged communities. Existing tools used to map systems at this scale are prohibitively expensive, require a lot of manual data processing, and are too coarse in their analysis methods. We set out to build a solution that eliminates those barriers.

This is an open-source project. We invite researchers, developers and the public to contribute to our project. See below for details.

__[Launch Encompass](https://encompass.bayesimpact.org)__

## Data and Resources
Encompass is an open-source project, and is built entirely on open source platforms and datasets. By committing to an open-source philosophy, we want to demonstrate how technology can empower stakeholders to create more equitable solutions. 

__Population__: Encompass uses [satellite data](http://ghsl.jrc.ec.europa.eu/ghs_pop.php) from the European Commission to approximate the location of people across the world. [GHS POP](http://ghsl.jrc.ec.europa.eu/ghs_pop.php) dataset combines human settlement satellite imagery, and census datasets to approximate the population into a grid of 250m resolution. Read more about the methodology and limitations of this dataset [here](http://ghsl.jrc.ec.europa.eu/data.php#GHSLBasics).

__Mapping__: [Mapbox](https://www.mapbox.com/) is an open source mapping platform for custom designed maps. We use Mapbox for our base map. 

__Routing__: We use [Open Source Routing Machine](http://project-osrm.org/) (OSRM) to calculate the driving times between critical social services and the people they are meant to serve. We have conducted extensive analysis to ensure the accuracy and reliability of OSRM’s performance for this use case. 

__Demographics__: Encompass uses the 2012-2016 [American Community Survey (ACS) 5-year Estimates](https://www.census.gov/programs-surveys/acs/news/data-releases/2016/release.html#par_textimage_700933727) to extract relevant demographic information.

## How to contribute
__Researchers__: We’d love to collaborate with any researchers who might find our tool useful! Please let us know what other applications or datasets you would like to analyze with Encompass. Send your inquiries to [encompass@bayesimpact.org](mailto:encmpass@bayesimpact.org).

__Developers__: We want to invite the vast community of developers to contribute to our mission of promoting a culture of evidence-based and transparent policymaking. Please read [CONTRIBUTING.md](https://github.com/bayesimpact/encompass/blob/master/CONTRIBUTING.md) to learn more about how you can get involved.
