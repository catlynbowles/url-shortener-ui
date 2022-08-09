import React, { Component } from 'react';
import './App.css';
import { getUrls } from '../../apiCalls';
import UrlContainer from '../UrlContainer/UrlContainer';
import UrlForm from '../UrlForm/UrlForm';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urls: []
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
  }

  componentDidMount = () => {
    fetch('http://localhost:3001/api/v1/urls')
      .then(response => response.json())
      .then(data => this.setState({urls: data.urls}))
  }

  render = () => {
    return (
      <main className="App">
        <header>
          <h1>URL Shortener</h1>
          <UrlForm addNewUrl={this.addNewUrl}/>
        </header>

        <UrlContainer urls={this.state.urls}/>
      </main>
    );
  }
}

export default App;
