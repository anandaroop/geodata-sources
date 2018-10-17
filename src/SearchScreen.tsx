import * as React from 'react'
import styled from 'styled-components'

import { GeodataSource } from './App'

interface Props {
  /** The full list of documents  */
  documents: GeodataSource[]

  /** A built instance of the Lunr index  */
  searchIndex: lunr.Index
}

interface State {
  /** The current search query */
  query: string

  /** The WIP search query being typed, since it may not yet be valid to send to the search index */
  queryWIP: string
}

export class SearchScreen extends React.Component<Props, State> {
  state = {
    query: '',
    queryWIP: ''
  }

  handleChangeQuery = (e: any) => {
    const value = e.target.value
    if (isValidQuery(value)) {
      this.setState({ query: value, queryWIP: value })
    } else {
      this.setState({ queryWIP: value })
    }
  }

  searchResults = () => {
    const query = this.state.query
    return this.props.searchIndex
      .search(buildLunrQuery(query))
      .map(match => this.props.documents[match.ref])
  }

  renderDocuments = (documents: GeodataSource[]) =>
    documents.map(doc => (
      <ResultItem key={doc.url}>
        <section>
          <a href={doc.url} target="_new">
            <h1>{doc.name}</h1>
          </a>
          <p>{doc.description}</p>
          {doc.subjects.map(s => (
            <code key={s}>{s}</code>
          ))}
        </section>
      </ResultItem>
    ))

  render() {
    const isSearching = this.state.query.length > 0
    const documents: GeodataSource[] = isSearching
      ? this.searchResults()
      : this.props.documents

    return (
      <Main>
        {/* tslint:disable-next-line:jsx-no-lambda */}
        <Form autoComplete="off" onSubmit={e => e.preventDefault()}>
          <SearchInput
            autoFocus={true}
            name="query"
            value={this.state.queryWIP}
            onChange={this.handleChangeQuery}
          />
        </Form>
        <Feedback>{buildLunrQuery(this.state.queryWIP)}</Feedback>

        <ResultList>{this.renderDocuments(documents)}</ResultList>
      </Main>
    )
  }
}

const isValidQuery = (q: string): boolean => {
  if (q.match(/[-+]$/)) {
    return false
  }
  return true
}

/** Turn input search terms into an opinionated Lunr query */
const buildLunrQuery = (q: string): string => {
  // builds a leading substring match for all terms (even if negated or required)
  if (q.length === 0) {
    return ''
  }
  const tokens = q.trim().split(/\s+/)
  const query = tokens.map(t => `${t}*`).join(' ')
  return query
}

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
  width: 100%;
  font-size: 1.2em;
  padding: 0.2em 0.1em;
`

const Feedback = styled.code`
  color: #999;
  font-family: monospace;
`

const ResultList = styled.ul.attrs({ id: 'documents' })`
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
