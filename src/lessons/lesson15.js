import React, { Component, Fragment } from 'react';

import Switch from '../Switch';

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

const ToggleContext = React.createContext({
  on: false,
  toggle: () => {},
});

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
    toggleOff: '__toggle_off__',
    toggleOn: '__toggle_on__',
  };

  static Consumer = ToggleContext.Consumer;

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

      const reducedChanges = this.props.stateReducer(combinedState, changesObject);

      /*
        Ignore "type" to avoid re-render unnecessarily.
      */
      const { type: ignoredType, ...onlyChanges } = reducedChanges;

      const nonControlledChanges = Object.entries(onlyChanges).reduce((newChanges, [key, value]) => {
        if (!this.isControlled(key)) {
          newChanges[key] = value;
        }
        
        return newChanges;
      }, {});

      return Object.keys(nonControlledChanges).length
        ? nonControlledChanges
        : null;
    }, () => {
      this.props.onStateChange(allChanges, this.getState());

      callback();
    });
  }

  toggle = ({ on: newState, type = Toggle.stateChangeTypes.toggle } = {}) => this.internalSetState(({ on }) => ({
    type,
    on: typeof newState === 'boolean' ? newState : !on,
  }), () => this.props.onToggle(this.getState().on));

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

  handleOffClick = () => this.toggle({ on: false, type: Toggle.stateChangeTypes.toggleOff });

  handleOnClick = () => this.toggle({ on: true, type: Toggle.stateChangeTypes.toggleOn });

  render() {
    return this.props.children
      ? <ToggleContext.Provider value={this.getStateAndHelpers()} {...this.props} />
      : (
        <div>
          <Switch {...this.getTogglerProps({ checked: this.getStateAndHelpers().on })} />
          <button onClick={this.handleOffClick}>off</button>
          <button onClick={this.handleOnClick}>on</button>
        </div>
      );
  }
}

/*
  Use provider instead of passing the props to each layer:
*/
const Layer1 = () => <Layer2 />;
const Layer2 = () => (
  <Toggle.Consumer>
    {({ on }) => (
      <Fragment>
        {on ? 'The button is ON' : 'The button is OFF'}
        <Layer3 />
      </Fragment>
    )}
  </Toggle.Consumer>
);
const Layer3 = () => <Layer4 />;
const Layer4 = () => (
  <Toggle.Consumer>
    {({ on, toggle }) => <Switch checked={on} onChange={toggle} />}
  </Toggle.Consumer>
);
  
class Usage extends Component {
  initialState = { bothOn: false };

  state = this.initialState;

  lastWasButton = false;

  handleToggle = on => {
    console.log('handleToggle', on);

    this.setState(({ bothOn: on }));
  }

  handleStateChange = (changes) => {
    const isButtonChange = changes.type === Toggle.stateChangeTypes.toggleOff || changes.type === Toggle.stateChangeTypes.toggleOn;

    if ((this.lastWasButton && isButtonChange) || changes.type === Toggle.stateChangeTypes.toggle) {
      this.setState({ bothOn: changes.on });

      this.lastWasButton = false;
    } else {
      this.lastWasButton = isButtonChange;
    }
  }

  render() {
    return (
      <div>
        <Toggle onToggle={this.handleToggle}>
          <Layer1 />
        </Toggle>
      </div>
    );
  }
}

export default Usage;
