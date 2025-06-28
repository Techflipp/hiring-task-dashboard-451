'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

type Props = {
    placeholder?: string;
    onSearch(value: string): void;
    disableForm?: boolean;
    width?: number;
};

export function Search({ placeholder, disableForm, width, onSearch }: Props) {
    const [value, setValue] = React.useState('');
    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue(val);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearch(val.trim());
        }, 400); // debounce delay (ms)
    };

    const handleClear = () => {
        setValue('');
        onSearch('');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearch(value.trim());
    };

    return (
        <Paper
            {...(disableForm ? { component: 'div' } : { component: 'form', onSubmit: handleSubmit })}
            sx={{
                p: '0px 3px',
                display: 'flex',
                alignItems: 'center',
                width: width || 320,
                boxShadow: '0px 1px 3px 0px #0000001F',
            }}
        >
            <IconButton type="submit" sx={{ p: '7px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1, fontSize: 14 }}
                placeholder={`Search ${placeholder ? `in ${placeholder}` : ''}`}
                inputProps={{ 'aria-label': 'search in table' }}
                value={value}
                onChange={handleChange}
            />
            {value && (
                <IconButton onClick={handleClear} aria-label="clear search" sx={{ p: '7px' }}>
                    <ClearIcon />
                </IconButton>
            )}
        </Paper>
    );
}
