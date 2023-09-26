import { useDarkMode } from '../../context/darkModeContext';
import logo from '../../logo.svg';
import '../../App.css';

const LandingPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
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
  )
}

export default LandingPage