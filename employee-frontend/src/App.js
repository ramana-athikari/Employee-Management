import './App.css';
import Navbar from './navbar.js'
import MyLogin from './login.js';

function App() {
    if(localStorage.getItem("token") == null){
      return(<MyLogin/>);
    }
    else{
      return(<Navbar/>);
    }
}

export default App;