import NewThreeScene from "./threejs/newThreeScene";
//import ThreeScene from "./threejs/threeScene";
import './threejs/canvasStyling.css';
import './Components/Button.css'

function App() {
  return (
    //<div className = "logo"/>
    <div className = "Container">
      <NewThreeScene className = "testwebgl"/>
      <div className = "Buttom"></div>
      <h1 > Hellow World</h1>
      

    </div >
    




  );
}

export default App;
