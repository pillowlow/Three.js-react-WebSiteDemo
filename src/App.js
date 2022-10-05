import React, { Component } from 'react';
import NewThreeScene from "./threejs/newThreeScene";
//import ThreeScene from "./threejs/threeScene";
import './threejs/canvasStyling.css';
import Modal from './Components/Modal';
import './Components/Button.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayModal: false,
      title: "",
    }
  }

  modalOpen = (text, triggerFrom) => {
    console.log(text)
    if (text === "Cube") {
      text = "About";
    }
    if (text === "Cube003") {
      text = "Contact";
    }
    if (text === this.state.title && triggerFrom === "RayCast") {
      this.setState({ title: "" });
      this.setState({ displayModal: false });
    }
    else {
      this.setState({ title: text });
      this.setState({ displayModal: true });
    }
  };

  modalClose = () => {
    console.log("close")
    this.setState({ displayModal: false });
  };

  render() {
    return (
      <div>
        <div className="Header">
          <div className="Button" onClick={() => this.modalOpen('Project', 'Button')}>Project</div>
          <div className="Button" onClick={() => this.modalOpen('Profolio', 'Button')}>Profolio</div>
          <div className="Button" onClick={() => this.modalOpen('Cube', 'Button')}>About</div>
          <div className="Button" onClick={() => this.modalOpen('Cube003', 'Button')}>Contact</div>
        </div>
        <div className="Container">
          <NewThreeScene className="testwebgl" modalOpen={this.modalOpen} />
          {/* <div className="Button" onClick={() => this.modalOpen('hello')}></div> */}
          <div className="absolute-square">
            <h1> Hellow World</h1>
          </div>
          <Modal
            show={this.state.displayModal}
            modalClosed={this.modalClose}
          >
            <React.Fragment>
              <h3>{this.state.title}</h3>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis minima non architecto doloribus earum nihil.</p>
              <button class="btn waves-effect waves-light" onClick={this.modalClose}>Submit</button>
            </React.Fragment>
          </Modal>

        </div >
      </div >
    );
  }
}

export default App;
