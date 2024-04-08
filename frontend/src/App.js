import './App.css';
import SignUp from './components/SignUp';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index path='/' element={<Login />}/>
          <Route path='/signUp' element={<SignUp />}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
