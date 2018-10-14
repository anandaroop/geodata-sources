import * as lunr from 'lunr'
import * as React from 'react'
import styled from 'styled-components'

import { SearchApp } from './SearchApp'
interface State {
  error: string
  isDataLoaded: boolean
  isSearchIndexReady: boolean
}

export default class App extends React.Component<{}, State> {
  state = {
    error: '',
    isDataLoaded: false,
    isSearchIndexReady: false
  }

  private data: ApplicationData
  private searchIndex: lunr.Index

  async componentDidMount() {
    await this.fetchData()
    this.setState({ isDataLoaded: true })

    this.createIndex()
    this.setState({ isSearchIndexReady: true })
  }

  fetchData = async () => {
    try {
      const response = await fetch('/data.json')
      const data = await response.json()
      this.data = data as ApplicationData
    } catch (e) {
      this.setState({
        error:
          'Error: data file could not be loaded. Check the contents of /public/data.json'
      })
    }
  }

  createIndex = () => {
    const documents = this.data.sources
    this.searchIndex = lunr(function() {
      this.ref('offset')
      this.field('name')
      this.field('description')
      documents.forEach((doc, i) => {
        this.add({ offset: i, ...doc })
      }, this)
    })
  }

  public render() {
    if (this.state.error) {
      return <Error message={this.state.error} />
    }

    if (!this.state.isDataLoaded) {
      return <Loading />
    }

    if (!this.state.isSearchIndexReady) {
      return <Indexing />
    }

    return <SearchApp documents={this.data.sources} searchIndex={this.searchIndex} />
  }
}

const FullScreen = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ErrorScreen = styled(FullScreen)`
  background: darkred;
  color: white;
`

const Error = ({ message }: { message: string }) => (
  <ErrorScreen>{message}</ErrorScreen>
)

const NoticeScreen = styled(FullScreen)`
  background: lightgray;
  color: gray;
`

const Loading = () => <NoticeScreen>Loading data…</NoticeScreen>

const Indexing = () => <NoticeScreen>Creating search index…</NoticeScreen>

export interface GeodataSource {
  name: string
  description: string
  url: string
  queryable: boolean
  downloadable: boolean
  mapped: boolean
  spatialExtent: string
  temporalExtent: string
  subjects: string[]
  keywords: string[]
}

interface ApplicationData {
  subjects: string[]
  sources: GeodataSource[]
}
