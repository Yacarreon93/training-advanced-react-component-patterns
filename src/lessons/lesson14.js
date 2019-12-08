import React, { Component } from 'react';

import Switch from '../Switch';

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

class Toggle extends Component {
  static defaultProps = {
    initialOn: false,
    onReset: () => {},
    onToggle: () => {},
    onStateChange: () => {},
    stateReducer: (state, changes) => changes,
  };

  static stateChangeTypes = {
    reset: '__reset__',
    toggle: '__toggle__',
  };

  initialState = { on: this.props.initialOn };

  state = this.initialState;

  getState(state = this.state) {
    return Object.entries(state).reduce((combinedState, [key, value]) => {
      if (this.isControlled(key)) {
        combinedState[key] = this.props[key];
      } else {
        combinedState[key] = value;
      }

      return combinedState; 
    }, {});
  }

  isControlled(prop) {
    return this.props[prop] !== undefined;
  }

  internalSetState(changes, callback) {
    let allChanges;

    this.setState(state => {
      const combinedState = this.getState(state);
      
      const changesObject = typeof changes === 'function' ? changes(combinedState) : changes;

      allChanges = changesObject;

      const nonControlledChanges = Object.entries(changesObject).reduce((newChanges, [key, value]) => {
        if (!this.isControlled(key)) {
          newChanges[key] = value;
        }
        
        return newChanges;
      }, {});
      
      const reducedChanges = this.props.stateReducer(state, nonControlledChanges);

      /*
        Ignore "type" to avoid re-render unnecessarily.
      */
      const { type: ignoredType, ...onlyChanges } = reducedChanges;

      return onlyChanges;
    }, () => {
      this.props.onStateChange(allChanges);

      callback();
    });
  }

  toggle = ({ type = Toggle.stateChangeTypes.toggle } = {}) => {
    this.internalSetState(({ on }) => ({
      type,
      on: !on,
    }), () => this.props.onToggle(this.getState().on));
  };

  reset = () => this.internalSetState({
    ...this.initialState,
    type: Toggle.stateChangeTypes.reset,
  }, () => this.props.onReset(this.state.on));

  getStateAndHelpers() {
    return {
      on: this.getState().on,
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

  handleOffClick = () => this.toggle({ on: false });

  handleOnClick = () => this.toggle({ on: true });

  render() {
    return this.props.children
      ? this.props.children(this.getStateAndHelpers())
      : (
        <div>
          <Switch {...this.getTogglerProps({ checked: this.getStateAndHelpers().on })} />
          <button onClick={this.handleOffClick}>off</button>
          <button onClick={this.handleOnClick}>on</button>
        </div>
      );
  }
}
  
class Usage extends Component {
  initialState = { bothOn: false };

  state = this.initialState;

  handleToggle = on => this.setState(({ bothOn: on }));

  handleStateChange = ({ on }) => this.setState({ bothOn: on });

  render() {
    const { bothOn } = this.state;

    /*
      What if we want to send all control props?
    */
    return (
      <div>
        <Toggle on={bothOn} onStateChange={this.handleStateChange} />
        <Toggle on={bothOn} onStateChange={this.handleStateChange} />
      </div>
    );
  }
}

export default Usage;
