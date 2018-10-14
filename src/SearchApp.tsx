import * as React from 'react'
import styled from 'styled-components'

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

  handleChangeQuery = (e: any) => {
    const value = e.target.value
    this.setState({ query: value })
  }

  searchResults = () => {
    const q = this.state.query
    return this.props.searchIndex
      .search(q)
      .map(match => this.props.documents[match.ref])
  }

  render() {
    const isSearching = this.state.query.length > 0
    const documents = isSearching ? this.searchResults() : this.props.documents

    return (
      <Main>
        {/* tslint:disable-next-line:jsx-no-lambda */}
        <Form autoComplete="off" onSubmit={e => e.preventDefault()}>
          <SearchInput
            name="query"
            value={this.state.query}
            onChange={this.handleChangeQuery}
          />
        </Form>

        <ResultList>{documents.map(formatResultItem)}</ResultList>
      </Main>
    )
  }
}

const formatResultItem = (source: GeodataSource) => (
  <ResultItem key={source.name}>
    <section>
      <h1 tabIndex={0}>{source.name}</h1>
      <p>{source.description}</p>
      {source.subjects.map(s => (
        <code key={s}>{s}</code>
      ))}
    </section>
  </ResultItem>
)

const Main = styled.main`
  padding: 1em;
  max-width: 60em;
  margin: auto;
`

const Form = styled.form``

const SearchInput = styled.input.attrs({
  placeholder: 'Enter search term',
  type: 'text'
})`
  font-size: 1.2em;
`

const ResultList = styled.ul`
  list-style-type: none;
`

const ResultItem = styled.li`
  margin: 1em 0;

  h1 {
    font-size: 1.2em;
    font-weight: 500;
  }

  p {
    color: #999;
  }

  code {
    font-size: 0.75em;
    color: #bbb;
    border-radius: 1em;

    &::after {
      content: ' • ';
    }

    &:last-of-type::after {
      content: none;
    }
  }
`
