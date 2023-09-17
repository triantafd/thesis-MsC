import React from 'react';
import logo from './logo.svg';
import './App.css';
import Footer from './layouts/Footer';
import Header from './layouts/Header';
import { useDarkMode } from './context/darkModeContext';

function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="App">
      <Header />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <button onClick={toggleDarkMode}>
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </button>
          <div className={`bg-white dark:bg-gray-900`}>
            This is your content. It'll be white in light mode and gray-900 in
            dark mode.
          </div>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Footer />
    </div>
  );
}

export default App;
