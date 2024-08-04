import React from 'react';
import './App.css';
import { GitHubRepo } from './Project';

const App: React.FC = () => {
  return (
    <div className="app">
      <GitHubRepo/>
    </div>
  );
};

export default App;