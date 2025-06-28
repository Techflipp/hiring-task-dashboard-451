import {FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import React from 'react'

const FilterControl = ( label: string,
                        value: string,
                        setValue: (val: string) => void,
                        options: string[]) => {
    return (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select value={value} label={label} onChange={(e) => setValue(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {options.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                        {opt}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
export default FilterControl
