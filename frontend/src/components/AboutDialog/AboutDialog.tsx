import Dialog from 'material-ui/Dialog'
import * as React from 'react'
import { SecureLink } from '../../utils/link'
import './AboutDialog.css'

type Props = {
  isOpen: boolean
  onCloseClick: (buttonClicked: boolean) => void
}

export let AboutDialog: React.StatelessComponent<Props> = ({
  isOpen, onCloseClick
}) => {
  let beaconLink = SecureLink('https://bayesimpact.org', 'Beacon Labs')
  let emailLink = SecureLink('mailto:encompass@bayesimpact.org?subject=About%20Encompass', 'here')
  let githubLink = SecureLink('https://github.com/bayesimpact/encompass', 'Github')
  let osrmLink = SecureLink('https://github.com/bayesimpact/encompass', 'OSRM')
  let usCensusLink = SecureLink('https://github.com/bayesimpact/encompass', 'U.S. Census data')

  return <Dialog
    autoScrollBodyContent={true}
    open={isOpen}
    onRequestClose={onCloseClick}>
    <div>
      <div className='Flex -Center'>
        <img className='AboutLogoImg' alt='bayes-logo' src='http://www.bayesimpact.org/images/logo_sq.png' />
      </div>
      <p>
        Encompass is a geographic analysis tool built by {beaconLink}. The application processes satellite data from the
        European Commission
        to approximate the location of people across the world. Encompass then uses a variety of open data sources and
        open-source technology,
        including {usCensusLink} and the Open Source Routing Machine ({osrmLink}), to calculate the driving times
        between critical social services and the people they are meant to serve.
      </p>
      <p>
        The primary intent for this project is to assist researchers, policymakers, and consumer advocates in measuring
        geographic accessibility to
        identify gaps and plan for strategic interventions. While the applications of this technology are broad, our
        team is most excited about how
        this can be used to promote health equity.
      </p>
      <p>
        This is an open source project. You can follow our progress and contribute on {githubLink}. To send us feedback
        or ideas for new datasets, you can contact us {emailLink}.
      </p>
    </div>
  </Dialog>
}
