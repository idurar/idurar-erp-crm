import React, { useState, useEffect } from 'react';
import './AlertComponent.css';
function AlertComponent(props) {
    const [modalDisplay, toggleDisplay] = useState('none');
    const openModal = () => {
        toggleDisplay('block');     
    }
    const closeModal = () => {
        toggleDisplay('none'); 
        props.hideError(null);
    }
    useEffect(() => {
        if(props.errorMessage !== null) {
            openModal()
        } else {
            closeModal()
        }
    });
    
    return(
        <div 
            className={"alert alert-danger alert-dismissable mt-4"} 
            role="alert" 
            id="alertPopUp"
            style={{ display: modalDisplay }}
        >
            <div className="d-flex alertMessage">
                <span>{props.errorMessage}</span>
                <button type="button" className="close" aria-label="Close" onClick={() => closeModal()}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
        </div>
    )
} 

export default AlertComponent