import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Game from './components/game/Game'
import RSSchool from './images/rs_school_js.svg';

function App() {    
  return (
    <div className="App">      
      <Game></Game>
      <footer>        
        <div>
          <a href="https://github.com/DmitryAstapenko">Dzmitry Astapenka</a>
        </div>
        <div>
          <span>2020</span>
        </div>
        <div>
          <a href="https://rs.school/js/">
            <img src={RSSchool} alt="rs school js" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
