import React, { Component } from 'react';

import Switch from '../Switch';

class Toggle extends Component {
  state = { checked: false };

  onChange = () => this.setState(
    ({ checked }) => ({ checked: !checked }),
    () => { this.props.onToggle(this.state.checked); },
  );

  render() {
    return (
      <Switch checked={this.state.checked} onChange={this.onChange} />
    );
  }
}
  
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return <Toggle onToggle={onToggle}/>;
}

export default Usage;
