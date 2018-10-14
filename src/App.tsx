import * as React from 'react'

interface State {
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
    const response = await fetch('/data.json')
    const data = await response.json()
    this.data = data as ApplicationData
  }

  public render() {
    if (this.state.isDataLoaded) {
      return (
        <div>
          {JSON.stringify(this.data.sources.map(s => s.name))}
        </div>
      )
    } else {
      return <Loading />
    }
  }
}

const Loading = () => <div>Loading…</div>

export default App
