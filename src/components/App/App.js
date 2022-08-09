import React, { Component } from 'react';
import './App.css';
import { getUrls } from '../../apiCalls';
import UrlContainer from '../UrlContainer/UrlContainer';
import UrlForm from '../UrlForm/UrlForm';
import Error from '../Error/Error'

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urls: [],
      error: false
    }
  }

  addNewUrl = (newUrl) => {
    console.log(newUrl)
    fetch('http://localhost:3001/api/v1/urls', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify(newUrl)
    })
      .then(response => response.json())
      .then(addition => this.setState({urls: [...this.state.urls, addition]}))
      .catch(() => this.setState({error: true}))
  }

  componentDidMount = () => {
    fetch('http://localhost:3001/api/v1/urls')
      .then(response => response.json())
      .then(data => this.setState({urls: data.urls}))
      .catch(() => this.setState({error: true}))
  }

  render = () => {
    return (
      <main className="App">
        <header>
          <h1>URL Shortener</h1>
          </header>
          {this.state.error ? <Error /> : 
          <div> 
            <UrlForm addNewUrl={this.addNewUrl}/>
            <UrlContainer urls={this.state.urls}/>
          </div>}
      </main>
    );
  }
}

export default App;
