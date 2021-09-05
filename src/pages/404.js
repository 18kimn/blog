import * as React from 'react'
import {Link} from 'gatsby'
import PageContainer from '../components/PageContainer'

const NotFoundPage = () => {
  return (
    <PageContainer>
      <h1>sorry, you got a 404 error!</h1>
      <p>
        That means the page you&apos;re looking for wasn&apos;t found.
        This is probably totally my fault, as the site was made fairly
        chaotically and I&apos;m not that great at web development
        yet. You can let me know if you&apos;d like by sending me an
        email at nathan.kim@yale.edu.{' '}
      </p>
      <Link to="/">or maybe go back to the home page?</Link>.
    </PageContainer>
  )
}

export default NotFoundPage
