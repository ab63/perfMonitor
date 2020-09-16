import React from "react";
import "./App.css";

import socket from "./utilities/socket";

import Widget from "./Widget";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      performanceData: {},
    };
  }

  componentDidMount() {
    socket.on("data", (data) => {
      const currentState = { ...this.state.performanceData };
      currentState[data.macA] = data;

      this.setState({
        performanceData: currentState,
      });
    });
  }

  render() {
    let widgets=[];
    const data = this.state.performanceData;
    Object.entries(data).forEach((key,value)=>{
      widgets.push(<Widget key={key} data={key[1]}/>)
    })
    return (
      <div className="App">
        {widgets}
      </div>
    );
  }
}

export default App;
