import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import * as React from 'react'
import { SecureLink } from '../../utils/link'
import './MethodologyDialog.css'

type Props = {
  isOpen: boolean
  onCloseClick: () => void
}

export let MethodologyDialog: React.StatelessComponent<Props> = ({
  isOpen, onCloseClick
}) => {
  let emailLink = SecureLink('mailto:encompass@bayesimpact.org?subject=About%20Encompass', 'encompass@bayesimpact.org')
  let githubLink = SecureLink('https://github.com/bayesimpact/encompass', 'GitHub repository')
  let ghsLink = SecureLink('http://ghsl.jrc.ec.europa.eu/', 'European Commission Global Human Settlement (GHS)')
  let ghsPopLink = SecureLink('http://ghsl.jrc.ec.europa.eu/ghs_pop.php', 'GHS Population Grid')
  let unrasterizeLink = SecureLink('https://github.com/tetraptych/unrasterize', 'unrasterize')
  let unrasterizeDocumentationLink = SecureLink('http://unrasterize.readthedocs.io/en/latest/usage.html', 'documentation')
  let mapboxLink = SecureLink('https://mapbox.com', 'Mapbox')
  let osrmLink = SecureLink('http://project-osrm.org/', 'Open Source Routing Machine')
  let censusLink = SecureLink(
    'https://www.census.gov/programs-surveys/acs/news/data-releases/2016/release.html#par_textimage_700933727',
    'American Community Survey (ACS) 5-year Estimates'
  )
  let usaS3Link = SecureLink(
    'https://s3-us-west-2.amazonaws.com/encompass-public-data/GHSL/united_states_mw-8_t-0.05_with_names.geojson',
    'United States'
  )
  let worldS3Link = SecureLink(
    'https://s3-us-west-2.amazonaws.com/encompass-public-data/GHSL/world_mw-8_t-0.05.geojson',
    'world'
  )

  return <Dialog
    autoScrollBodyContent={true}
    open={isOpen}
    onRequestClose={onCloseClick}
    title={<div className='DialogCloseButton'><IconButton onClick={onCloseClick}><NavigationClose /></IconButton></div>}>
    <div className='Methodology'>
      <h2>Methodology</h2>
      <p>
        Encompass is an open-source project, and is built entirely on open-source platforms and datasets.
        We are committed to building open-source to promote transparency, build trust across stakeholders, and make our algorithms more accessible to the public sector.
        The methodology listed below elaborates on the data and methods used to power the analyses in this application.
        Please send any questions or comments to {emailLink} or visit the {githubLink} to access the source code and learn how to contribute.
      </p>
      <h4>Population</h4>
      <p>
        Encompass uses satellite data from the {ghsLink} initiative to approximate the location of people across the world.
        The {ghsPopLink} is a raster layer that combines satellite imagery and census datasets to depict the distribution and
        density of population, expressed as the number of people per pixel, where each pixel is approximately 250m x 250m.
      </p>
      <p>
        This raster data is subsampled using the {unrasterizeLink} library to obtain a manageable number of discrete points with population totals in GeoJSON format.
        The parameters here are mask width (integer), the minimum number of non-selected pixels between adjacent selected pixels, and threshold (float),
        the minimum number of people per pixel required for a pixel to be selected. Encompass uses values of 8 and 0.05 for these parameters respectively.
        This combination of parameters was chosen to ensure that populations in remote regions are included in the sampling, while also avoiding oversampling of
        densely populated areas. Refer to the {unrasterizeDocumentationLink} for more information.
        The final GeoJSON layer is available on S3 ({usaS3Link}, {worldS3Link}).
      </p>
      <h4>Mapping</h4>
      <p>
        {mapboxLink} is an open-source mapping platform for custom-designed maps. We use Mapbox for our base map.
      </p>
      <h4>Routing</h4>
      <p>
        We use {osrmLink} (OSRM) to calculate the driving times between critical social services and the people they are meant to serve.
      </p>
      <p>
        To limit the number of distance or time calculations that the app has to make, the backend uses the great-circle distance
        to bypass routing API calls for pairs of points separated by large distances.
        Conversely, pairs of points that are very close to one another also do not result in calls to the routing API.
        For this reason, any analysis of the output should favor the use of robust statistics (e.g., the median is preferred to the mean).
      </p>
      <h4>Demographics</h4>
      <p>
        Encompass uses the 2012-2016 {censusLink} to extract relevant demographic information.
        We use census information as percentages at the county level that are then assigned to population points accordingly.
      </p>
      <h4>Data</h4>
      <p>
        For information on the data sources included in our visualizations, please refer to the data sources section of
        the individual dataset by clicking the tiles in the left drawer.
      </p>
    </div>
  </Dialog>
}
