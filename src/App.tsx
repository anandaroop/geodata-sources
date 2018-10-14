import * as React from 'react'
import styled from 'styled-components'

interface State {
  error: string
  isDataLoaded: boolean
}

export default class App extends React.Component<{}, State> {
  state = {
    error: '',
    isDataLoaded: false
  }

  private data: ApplicationData

  async componentDidMount() {
    await this.fetchData()
    this.setState({
      isDataLoaded: true
    })
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

  public render() {
    if (this.state.error) {
      return <Error message={this.state.error} />
    }

    if (!this.state.isDataLoaded) {
      return <Loading />
    }

    return <div>{JSON.stringify(this.data.sources.map(s => s.name))}</div>
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

const LoadingScreen = styled(FullScreen)`
  background: lightgray;
  color: gray;
`

const Loading = () => <LoadingScreen>Loading…</LoadingScreen>

interface GeodataSource {
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
