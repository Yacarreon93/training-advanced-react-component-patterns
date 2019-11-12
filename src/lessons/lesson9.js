import React, { Component } from 'react';

import Switch from '../Switch';

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

class Toggle extends Component {
  static defaultProps = {
    initialOn: false,
    onReset: () => {},
  };

  initialState = { on: this.props.initialOn };

  state = this.initialState;

  toggle = () => this.setState(
    ({ on }) => ({ on: !on }),
    () => { this.props.onToggle(this.state.on); },
  );

  reset = () => this.setState(
    this.initialState,
    () => { this.props.onReset(this.state.on); },
  );

  getStateAndHelpers() {
    return {
      on: this.state.on,
      reset: this.reset,
      toggle: this.toggle,
      getTogglerProps: this.getTogglerProps,
    };
  }

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
  initialOn = true,
  onToggle = (...args) => console.log('onToggle', ...args),
  onReset = (...args) => console.log('onReset', ...args),
}) {
  return (
    <Toggle
      initialOn={initialOn}
      onToggle={onToggle}
      onReset={onReset}
    >
      {({ on, getTogglerProps, reset }) => (
        <div>
          Toggle is {on ? 'On' : 'Off'}
          <div>
            <Switch {...getTogglerProps({ checked: on })} />
          </div>
          <hr />
          <button onClick={reset}>
            Reset
          </button>
        </div>
      )}
    </Toggle>
  );
}

export default Usage;
