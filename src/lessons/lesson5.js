import React, { Component } from 'react';

import Switch from '../Switch';

const renderUI = ({ on, toggle }) => <Switch checked={on} onChange={toggle} />;

class Toggle extends Component {
  static defaultProps = { renderUI };

  state = { on: false };

  toggle = () => this.setState(
    ({ on }) => ({ on: !on }),
    () => { this.props.onToggle(this.state.on); },
  );

  render() {
    return this.props.renderUI({
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
      renderUI={({ on, toggle }) => (
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
    />
  );
}

export default Usage;
