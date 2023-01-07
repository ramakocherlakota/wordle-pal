import React from 'react';
import './checkbox-row.scss';
import PopupDoc from './PopupDoc';

export default function CheckboxRow({ value, setValue, label, doc }) {
  function toggle(e) {
    const newval = e.currentTarget.checked;
    setValue(newval);
  }

  const checkboxStyle = {
    transform: "scale(1.5)"
  }

  return (
    <>
      <div className='row checkbox-row'>
        <div className='col label'  >
          <PopupDoc doc={doc} >
            {label}
          </PopupDoc>
        </div>
        <div className='col'>
          <input type="checkbox" style={checkboxStyle} checked={value} onChange={toggle} />
        </div>
      </div>
    </>
  );
}
