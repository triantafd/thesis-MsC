import { useDarkMode } from '../../context/darkModeContext';
import ContentWrapper from "../../components/wrappers/ContentWrapper";

const Settings = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex flex-col w-[100%] max-h-[100%]">
      <h1 className="block font-sans text-5xl font-semibold leading-tight tracking-normal text-inherit antialiased">
        Settings
      </h1>
      <ContentWrapper className="mt-10 space-y-4">
        <div className="flex flex-col md:flex-row flex-start items-center">
          <h1 className="text-2xl font-bold pr-2">Themes: </h1>
          <div>
            <button
              onClick={() => toggleDarkMode()}
              className="rounded-full px-4 py-2 bg-slate-600 text-white dark:bg-blue-400"
            >
              Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>
      </ContentWrapper >
    </div >
  );
};

export default Settings;