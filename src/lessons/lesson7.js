import React, { Component } from 'react';

import Switch from '../Switch';

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

class Toggle extends Component {
  state = { on: false };

  toggle = () => this.setState(
    ({ on }) => ({ on: !on }),
    () => { this.props.onToggle(this.state.on); },
  );

  getStateAndHelpers() {
    return {
      on: this.state.on,
      toggle: this.toggle,
      getTogglerProps: this.getTogglerProps,
    };
  }

  /*
    Works as a way to mix the props rqquired by the Toggle
    component and the ones declared by the developer.
  */
  getTogglerProps = ({ onClick, ...props }) => ({
    onClick: callAll(onClick, this.toggle),
    onChange: this.toggle,
    'aria-pressed': this.state.on,
    ...props,
  });

  render() {
    return this.props.children(this.getStateAndHelpers());
  }
}
  
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
  onButtonClick = () => alert('onButtonClick'),
}) {
  return (
    <Toggle
      onToggle={onToggle}
    >
      {({ on, getTogglerProps }) => (
        <div>
          Toggle is {on ? 'On' : 'Off'}
          <div>
            <Switch {...getTogglerProps({ checked: on })} />
          </div>
          <hr />
          <button {...getTogglerProps({
            ariaLabel: "custom-button",
            onClick: onButtonClick,
          })}>
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    </Toggle>
  );
}

export default Usage;
