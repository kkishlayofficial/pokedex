import React from 'react'
import styled from 'styled-components';

const Checkbox = ({label, tempFilter, setFilter}) => {
    const handleCheck = (e) => {
        let arr = [...tempFilter];
        if(e.target.checked){
            arr.push(label);
            setFilter([...arr]);
        }
        else{
            let idx = arr.indexOf(label);
            arr.splice(idx, 1);
            setFilter([...arr]); 
        }
    }
    
  return (
    <CheckboxWrapper>
        <input type='checkbox' id="type" value={label} checked={tempFilter.includes(label)} onChange={handleCheck}/>
        <label className='text-capitalize px-3 py-2' htmlFor="type">{label}</label>
    </CheckboxWrapper>
  )
}

export default Checkbox

const CheckboxWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`