import React, { Component } from 'react';

import Switch from '../Switch';

const ToggleContext = React.createContext();

function ToggleConsumer(props) {
  return (
    <ToggleContext.Consumer>
      {(context) => {
        if (!context) {
          throw new Error('Toggle compound components must be rendered within the Toggle component');
        }

        return props.children(context);
      }}
    </ToggleContext.Consumer>
  );
}

class Toggle extends Component {
  static On = ({ children }) => (
    <ToggleConsumer>
      {({ on }) => on ? children : null}
    </ToggleConsumer>
  );
  
  static Off = ({ children }) => (
    <ToggleConsumer>
      {({ on }) => on ? null : children}
    </ToggleConsumer>
  );
  
  static Button = props => (
    <ToggleConsumer>
      {({ on, toggle }) => <Switch checked={on} onChange={toggle} {...props} />}
    </ToggleConsumer>
  );

  toggle = () => this.setState(
    ({ on }) => ({ on: !on }),
    () => { this.props.onToggle(this.state.checked); },
  );

  /*
    Use the "state" as Context value to aviod unnecesary changes.
    This is a common pattern when using Context.
  */
  state = { on: false, toggle: this.toggle };

  render() {
    return (
      <ToggleContext.Provider
        /*
          This way the "value" is a new object every single time "render" is called,
          so, the Consumers are rendered every single time the value changes.
        */
        // value={{ on: this.state.on, toggle: this.toggle }}
        value={this.state}
      >
        {this.props.children}
      </ToggleContext.Provider>
    )
  }
}
  
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      <div>
        <Toggle.On>Toggle is On</Toggle.On>
        <Toggle.Off>Toggle is Off</Toggle.Off>
        <div>
            <Toggle.Button />
        </div>
      </div>
    </Toggle>
  );
}

export default Usage;
