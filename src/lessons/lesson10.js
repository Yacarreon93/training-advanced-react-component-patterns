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
    return this.props.children(this.getStateAndHelpers());
  }
}
  
class Usage extends Component {
  initialState = { timesClicked: 0 };

  state = this.initialState;

  handleToggle =  (...args) => {
    this.setState(({ timesClicked }) => ({
      timesClicked: timesClicked + 1,
    }));
  }
  
  handleReset = (...args) => {
    this.setState(this.initialState);
  };

  toggleStateReducer = (state, changes) => {
    if (changes.type === 'forced') {
      return changes;
    }

    if (this.state.timesClicked >= 4) {
      return { ...changes, on: false };
    }

    return changes;
  }

  render() {
    const { timesClicked } = this.state;

    console.log('timesClicked', timesClicked);

    return (
      <Toggle
        stateReducer={this.toggleStateReducer}
        onToggle={this.handleToggle}
        onReset={this.handleReset}
      >
        {({ on, getTogglerProps, reset, toggle }) => (
          <div>
            Toggle is {on ? 'On' : 'Off'}
            <br />
            <div>
              <Switch {...getTogglerProps({ checked: on })} />
            </div>
            {timesClicked > 4 ? (
              <div>
                Whoa, you clicked too much!
                <br />
                <br />
                <button onClick={() => toggle({ type: 'forced' })}>
                  Force toggle!
                </button>
                <br />
              </div>
            ) : timesClicked > 0 ? (
              <div>
                Click count: {timesClicked}<br />
              </div>
            ) : null}
            <hr />
            <button onClick={reset}>
              Reset
            </button>
          </div>
        )}
      </Toggle>
    );
  }
}

export default Usage;
