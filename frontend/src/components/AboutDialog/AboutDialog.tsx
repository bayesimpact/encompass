import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import * as React from 'react'
import { SecureLink } from '../../utils/link'
import './AboutDialog.css'

type Props = {
  isOpen: boolean
  onCloseClick: () => void
}

export let AboutDialog: React.StatelessComponent<Props> = ({
  isOpen, onCloseClick
}) => {
  let bayesLink = SecureLink('https://www.bayesimpact.org', 'Bayes Impact')
  let emailLink = SecureLink('mailto:encompass@bayesimpact.org?subject=About%20Encompass', 'encompass@bayesimpact.org')
  let githubLink = SecureLink('https://github.com/bayesimpact/encompass', 'GitHub repository')

  return <Dialog
    autoScrollBodyContent={true}
    open={isOpen}
    onRequestClose={onCloseClick}
    title={
      <div className='CloseButton'>
        <IconButton onClick={onCloseClick}><NavigationClose /></IconButton>
      </div>
    }
  >
    <div>
      <div className='Flex -Center'>
        <img className='AboutLogoImg' alt='bayes-logo' src='https://www.bayesimpact.org/images/logo_sq.png' />
      </div>
      <p>
        Encompass is an analytics and mapping tool built by {bayesLink} that enables policymakers, researchers,
        and consumer advocates to analyze how accessibility to social services varies across demographic groups.
        Inadequate and untimely access to health care services is a major barrier to health equity for disadvantaged communities.
        Existing tools used to map systems at this scale are prohibitively expensive, require significant amounts of manual data processing, and are too coarse
        to accurately depict accessibility issues. We set out to build a solution that eliminates those barriers.
      </p>
      <p>
        This is an open-source project. If you are a researcher or policy expert, we would love to hear from you.
        Please contact us at {emailLink} and let us know how Encompass might be useful to you.
        If you are a software developer interested in contributing to our mission, please visit our {githubLink} for more details.
      </p>
    </div>
  </Dialog>
}
