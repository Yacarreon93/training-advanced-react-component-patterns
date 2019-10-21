import React, { Component } from 'react';

import Switch from '../Switch';

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
      togglerProps: {
        onClick: this.toggle,
        onChange: this.toggle,
        'aria-pressed': this.state.on,
      },
    };
  }

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
      {({ on, togglerProps }) => (
        <div>
          Toggle is {on ? 'On' : 'Off'}
          <div>
            <Switch checked={on} {...togglerProps} />
          </div>
          <hr />
          <button
            {...togglerProps}
            aria-label="custom-button"            
            onClick={() => {
              // Overwritten "onClick" solved!
              onButtonClick();
              togglerProps.onClick();
            }}
          >
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    </Toggle>
  );
}

export default Usage;
