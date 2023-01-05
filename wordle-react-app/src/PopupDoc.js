import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import './popup-doc.scss';

export default function PopupDoc({doc, children, label}) {
  const anchorLabel = label ? label : <div className='default-anchor'><sup>?</sup></div>;

  function showDoc() {
    return <Popup
             trigger={open => (
               <a>{anchorLabel}</a>
             )}
             modal
           >
             <div className='doc'>{doc}</div>
           </Popup>;
  }

  return (
    <>
      <div className='popup-doc'>
         <div className='children'>
           {children}
         </div>       
        <div className='trigger'>
          {showDoc()}
        </div>
      </div>
    </>
  );
}

