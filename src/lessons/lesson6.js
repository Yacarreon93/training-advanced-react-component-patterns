import React, { Component } from 'react';

import Switch from '../Switch';

class Toggle extends Component {
  state = { on: false };

  toggle = () => this.setState(
    ({ on }) => ({ on: !on }),
    () => { this.props.onToggle(this.state.on); },
  );

  render() {
    return this.props.children({
      on: this.state.on,
      toggle: this.toggle,
    });
  }
}
  
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle
      onToggle={onToggle}
    >
      {({ on, toggle }) => (
        <div>
          Toggle is {on ? 'On' : 'Off'}
          <div>
            <Switch checked={on} onChange={toggle} />
          </div>
          <hr />
          <button aria-label="custom-button" onClick={toggle}>
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    </Toggle>
  );
}

export default Usage;
