import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsConfig from './aws-config';
import TestSub from './graphql/testSub';
import TestMutation from './graphql/testMutation';

const NUMBER_OF_SUBS  = 10;    // Number of subscriptions for the test
const NEW_USER        = true; // Clear local storage on refresh
const NUMBER_OF_TESTS = 1;    // Run multiple tests
const DELAY_MS        = 2000; // How long to wait in between subs

class App extends Component {

  constructor(props) {
    super(props);
    this.subscriptions = [];
  }

  componentWillMount() {
    Amplify.configure(awsConfig);

    /**
     * Clear credentials to get new user
     */
    if (NEW_USER) localStorage.clear();
  }

  async componentDidMount() {
    for (let i = 0; i < NUMBER_OF_TESTS; i++) {
      await this.runTest(this.subscriptions);
    }
  }

  runTest = async subscriptions => {
    await this.subscribe(subscriptions);
    await this.testSubs();
    await this.sleep(10000);
    this.unsub(subscriptions);
  }

  unsub = subscriptions => {
    for(const subscription of subscriptions) subscription.unsubscribe();

    subscriptions = [];
  }

  testSubs = async () => {
    for (let i = 0; i < NUMBER_OF_SUBS; i++)
      await API.graphql(graphqlOperation(TestMutation, { text: `test-${i}` }));  
  }

  subscribe = async subscriptions => {
    for (let i = 0; i < NUMBER_OF_SUBS; i++) {

      subscriptions[i] = API.graphql(
        graphqlOperation(TestSub, { text: `test-${i}` })
      ).subscribe({
          next: (eventData) => console.log(eventData)
      });

      await this.sleep(DELAY_MS);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
