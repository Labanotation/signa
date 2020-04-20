import * as React from 'react'
import Head from 'next/head'
import Header from './header'
import Footer from './footer'
import '../styles/styles.scss'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

type Props = {
  title?: string
}

const Layout = ({
  children,
  title = 'Signa'
}) => (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container fluid id="container">
        <Row>
          <Col><Header /></Col>
        </Row>
        <Row>
          <Col id="main">{children}</Col>
        </Row>
        <Row>
          <Col><Footer /></Col>
        </Row>
      </Container>
    </>
  )

export default Layout