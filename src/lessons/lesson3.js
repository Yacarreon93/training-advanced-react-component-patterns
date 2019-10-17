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
    // Use Toggle component to avoid errors.
    // <Toggle onToggle={onToggle}>
    <div>
      <Toggle.On>Toggle is On</Toggle.On>
      <Toggle.Off>Toggle is Off</Toggle.Off>
      <div>
        <Toggle.Button />
      </div>
    </div>
    // </Toggle>
  );
}

export default Usage;
