import * as React from 'react'

interface State {
  error: string
  isDataLoaded: boolean
}

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

class App extends React.Component<{}, State> {
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
        error: 'Error: data file could not be loaded'
      })
    }
  }

  public render() {
    if (this.state.error) {
      return <Error message={this.state.error} />
    }
    if (this.state.isDataLoaded) {
      return <div>{JSON.stringify(this.data.sources.map(s => s.name))}</div>
    } else {
      return <Loading />
    }
  }
}

const Error = ({ message }: { message: string }) => <div>{message}</div>

const Loading = () => <div>Loading…</div>

export default App
