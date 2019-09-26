import React, { Component } from 'react';

import Switch from '../Switch';

class Toggle extends Component {
  static On = ({ on, children }) => (on ? children : null);
  
  static Off = ({ on, children }) => (on ? null : children);

  static Button = ({ on, toggle, ...props }) => (
    <Switch checked={on} onChange={toggle} {...props} />
  );

  state = { checked: false };

  onChange = () => this.setState(
    ({ checked }) => ({ checked: !checked }),
    () => { this.props.onToggle(this.state.checked); },
  );

  render() {
    return React.Children.map(this.props.children, child => (
      React.cloneElement(child, {
        on: this.state.checked,
        toggle: this.onChange,
      })
    ));
  }
}
  
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      <Toggle.On>Toggle is On</Toggle.On>
      <Toggle.Off>Toggle is Off</Toggle.Off>
      {/*
        Since Button is wrapped in a div, it doesn't reach "on" and "toggle" props.
        See errors in the browser console.
      */}
      <div>
        <Toggle.Button />
      </div>
    </Toggle>
  );
}

export default Usage;
