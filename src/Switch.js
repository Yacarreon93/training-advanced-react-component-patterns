
import React from 'react';
import Switch from 'react-switch';

function MySwitch(props) {
  return (
    <label>
      <Switch
        onChange={props.onChange}
        checked={props.checked}
      />
    </label>
  );
}

export default MySwitch;