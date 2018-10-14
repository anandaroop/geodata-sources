import * as React from 'react'

import { GeodataSource } from './App'

interface Props {
  documents: GeodataSource[]
  searchIndex: lunr.Index
}

interface State {
  query: string
}

export class SearchApp extends React.Component<Props, State> {
  state = {
    query: ''
  }

  render() {
    return <div>{JSON.stringify(this.props.documents.map(s => s.name))}</div>
  }
}
