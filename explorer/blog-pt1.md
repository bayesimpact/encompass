## Research Blog Post, parte une

## I want to know where the people are

(TODO: HRSAs MUAs etc.)

### ZIP Codes

The United States Potal Service (USPS) is a natural place to look for this information. Mailing addresses are a decent proxy for where people live and work<sup>[1](#footnote-mailing-addresses)</sup>. In particular, ZIP (Zone Improvement Plan) codes are an attractive option for determinining population density since they're a part of the everyday lives of American citizens. On the other hand, ZIP codes were designed to make mail delivery more efficient and *not* to form a geographic subdivision of the nation for the purposes of demography. This fact results in several unfortunate consequences when ZIP code data is used this way<sup>[2](#footnote-zip-code-annoyances)</sup>. In addition, ZIP codes are also updated quarterly, causing headaches for longitudinal research studies.

Legislation like the [Knox-Keene Act](TODO) in California enshrine ZIP codes as a fundamental unit of regulation, making their continued usage for representing population unavoidable.

### Census Divisions

In contrast, the Census Bureau is explicitly tasked with counting the number of residents across several geographic subdivisions of the country. The Bureau releases [population-weighted centroids](TODO) for census tracts and block groups. Maybe these geographic units can provide a passably-faithful representation of population distribution?

In urban areas, these divisions do an excellent job of representing population distribution and density, but their fidelity in rural areas is much less consistent. Consider the case of [TODO](TODO), where more than TODO people live TODO miles away from their census tract centroid:

TODO: Mapbox studio screenshot

This TODO might not be a problem for certain use cases, especially when data is being aggregated at the county or state levels. On the other hand, this systemic blind spot poses serious problems for the determination of MUAs and the allocation of public resources to mitigate problems caused by poor geographic access, since it means that methods that use census centroids tend to over-estimate access in the very places where it is worst<sup>[3](#footnote-centroids-near-roads)</sup>.

The TODO is most problematic in the less densely populated states of the Mountain West<sup>[3](#footnote-alaska)</sup>, but also affects rural counties nationwide.

### Satellite Data

Recent advances in satellite and machine learning technology have made it possible to detect buildings through satellite imagery and assign population totals to each rectangular pixel with the aid of census information. Two such datasets are the [High-Resolution Settlement Layer](TODO) (HRSL) and the [Global Human Settlement Layer](TODO) (GHSL)<sup>[3](#footnote-gridded-population-of-the-world)</sup>.

These datasets have the potential to provide very granular information about population distribution. Accuracy is a potential concern, as models trained on particular classes of land cover might not be easily transferrable to other regions' terrains. For many use cases, these datasets are *too* granular: the satellite images themselves are very large files, making even simple calculations computationally intractable.

Down-sampling the data can help combat this downside, resulting in more reasonable numbers of representative points for use in computation-heavy workflows (e.g., driving-time or routing calculations). This methodology forms the source of the representative points in [Encompass](TODO), a Beacon Labs initiative to measure access between people and providers of critical social services like hospitals and primary care providers.

## Conclusions



## Footnotes

<a name="footnote-mailing-addresses">1</a>: Note that mailing addresses can fail spectacularly for this purpose in places without well-defined mailing routes--for instance, in rural locations where residents pick up their mail from a single post office that isn't close to their place of residence.

<a name="footnote-zip-code-annoyances">2</a>: For example, ZIP codes are mailing routes, not polygons (source), putting the concept of a "ZIP code centroid" on shaky footing. Moreover, the routes themselves are not publicly available: the USPS sells [a variety](https://postalpro.usps.com/address-quality/delivery-statistics-product) of [products](https://postalpro.usps.com/address-quality/carrier-route-product) from which route information could be derived, but their price is a major barrier to adoption.

<a name="footnote-alaska">3</a>: And Alaska.

<a name="footnote-centroids-near-roads">3</a>: Note that there's no guarantee that the population-weighted centroids is on or near the road network, posing further problems for applications using driving distance or time. TODO: Find an example of this?

<a name="footnote-gridded-population-of-the-world">3</a>: Both based on CIESIN's [Gridded Population of the World](TODO) dataset.


