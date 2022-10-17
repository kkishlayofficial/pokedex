import React from "react";
import { capitalize } from "@mui/material";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const FilterDropdown = ({type, filterList, className, setFilter }) => {

  let arr = type === 'type' ? Object.keys(filterList).map((item) => {
    return { value: item, label: capitalize(item) };
  }): 
  filterList.map(item => {
    return{ value: item, label: capitalize(item)};
  })

  const handleChange = (selected) => {
    let arr = [];
    selected.map((item) => {
      arr.push(item.value);
    });
    setFilter([...arr]);
  };
  
  return (
    <div className={className}>
        <ReactMultiSelectCheckboxes className="select-dropdown" options={arr} checked={Object.keys(filterList).includes(arr.value)} onChange={handleChange}/>
    </div>
  );
};

export default FilterDropdown;
