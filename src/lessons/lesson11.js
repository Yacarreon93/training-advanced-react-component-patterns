import React, { Component } from 'react';

import Switch from '../Switch';

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

class Toggle extends Component {
  static defaultProps = {
    initialOn: false,
    onReset: () => {},
    stateReducer: (state, changes) => changes,
  };

  static stateChangeTypes = {
    reset: '__reset__',
    toggle: '__toggle__',
  };

  initialState = { on: this.props.initialOn };

  state = this.initialState;

  internalSetState(changes, callback) {
    this.setState(state => {
      const changesObject = typeof changes === 'function' ? changes(state) : changes;
      
      const reducedChanges = this.props.stateReducer(state, changesObject);

      /*
        Ignore "type" to avoid re-render unnecessarily.
      */
      const { type: ignoredType, ...onlyChanges } = reducedChanges;

      return onlyChanges;
    }, callback);
  }

  toggle = ({ type = Toggle.stateChangeTypes.toggle } = {}) => this.internalSetState(({ on }) => ({
    type,
    on: !on,
  }), () => this.props.onToggle(this.state.on));

  reset = () => this.internalSetState({
    ...this.initialState,
    type: Toggle.stateChangeTypes.reset,
  }, () => this.props.onReset(this.state.on));

  getStateAndHelpers() {
    return {
      on: this.state.on,
      reset: this.reset,
      toggle: this.toggle,
      getTogglerProps: this.getTogglerProps,
    };
  }

  getTogglerProps = ({ onClick, ...props }) => ({
    onClick: callAll(onClick, () => this.toggle()),
    onChange: () => this.toggle(),
    'aria-pressed': this.state.on,
    ...props,
  });

  render() {
    return this.props.children
      ? this.props.children(this.getStateAndHelpers())
      : <Switch {...this.getTogglerProps({ checked: this.getStateAndHelpers().on })} />;
  }
}
  
class Usage extends Component {
  initialState = { bothOn: false };

  state = this.initialState;

  handleToggle = on => this.setState(({ bothOn: on }));

  render() {
    const { bothOn } = this.state;

    /*
      The idea is to make both Toggles controlled by "bothOn".
      The Toggle "on" prop is ignored for now.
    */
    return (
      <div>
        <Toggle on={bothOn} onToggle={this.handleToggle} />
        <Toggle on={bothOn} onToggle={this.handleToggle} />
      </div>
    );
  }
}

export default Usage;
