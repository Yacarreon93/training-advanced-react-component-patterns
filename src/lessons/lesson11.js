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

  getOn() {
    return this.props.on !== undefined ? this.props.on : this.state.on; // Make Toggle support props and state.
  }

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

  toggle = ({ type = Toggle.stateChangeTypes.toggle } = {}) => {
    if (this.props.on !== undefined) {
      this.props.onToggle(!this.getOn())
    } else {
      this.internalSetState(({ on }) => ({
        type,
        on: !on,
      }), () => this.props.onToggle(this.getOn()));
    }
  };

  reset = () => this.internalSetState({
    ...this.initialState,
    type: Toggle.stateChangeTypes.reset,
  }, () => this.props.onReset(this.state.on));

  getStateAndHelpers() {
    return {
      on: this.props.on !== undefined ? this.props.on : this.state.on, // Make Toggle support props and state.
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
      This is how both controlled and inner state are supported:
    */
    return (
      <div>
        <Toggle on={bothOn} onToggle={this.handleToggle} />
        <Toggle onToggle={this.handleToggle} />
      </div>
    );
  }
}

export default Usage;
