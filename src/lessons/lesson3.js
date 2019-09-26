import React, { Component } from 'react';

import Switch from '../Switch';

const ToggleContext = React.createContext();

class Toggle extends Component {
  static On = ({ children }) => (
    <ToggleContext.Consumer>
      {({ on }) => on ? children : null}
    </ToggleContext.Consumer>
  );
  
  static Off = ({ children }) => (
    <ToggleContext.Consumer>
      {({ on }) => on ? null : children}
    </ToggleContext.Consumer>
  );
  
  static Button = props => (
    <ToggleContext.Consumer>
      {({ on, toggle }) => <Switch checked={on} onChange={toggle} {...props} />}
    </ToggleContext.Consumer>
  );

  state = { checked: false };

  onChange = () => this.setState(
    ({ checked }) => ({ checked: !checked }),
    () => { this.props.onToggle(this.state.checked); },
  );

  // Use Context to get access to the props regardless of the element location.
  render() {
    return (
      <ToggleContext.Provider value={{ on: this.state.checked, toggle: this.onChange }}>
        {this.props.children}
      </ToggleContext.Provider>
    )
  }
}
  
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    // Code will crash when Context Provider is not wrapping Toggle elements.
    <div>
      <Toggle.On>Toggle is On</Toggle.On>
      <Toggle.Off>Toggle is Off</Toggle.Off>
      <div>
        <Toggle.Button />
      </div>
    </div>
  );
}

export default Usage;
