import React from 'react';
import {Box, Card, CardContent, Typography,CardActionArea,} from '@mui/material';

type DistributionData = Record<string, number>;

type CardsProps = {
    title: string;
    value: number | unknown;
};

const getMaxEntry = (data: DistributionData): [string, number] | null => {
    const entries = Object.entries(data);
    if (entries.length === 0) return null;
    return entries.reduce((max, curr) => (curr[1] > max[1] ? curr : max));
};

const formatLabel = (label: string): string => {
    return label.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

export const Cards: React.FC<CardsProps> = ({ title, value }) => {
    const isObject = typeof value === 'object' && value !== null;
    const maxEntry = isObject ? getMaxEntry(value as DistributionData) : null;

    return (
        <Card sx={{ height: '100%' }}>
            <CardActionArea
                sx={{
                    height: '100%',
                    '&[data-active]': {
                        backgroundColor: 'action.selected',
                        '&:hover': {
                            backgroundColor: 'action.selectedHover',
                        },
                    },
                }}
            >
                <CardContent>
                    <Typography
                        variant="subtitle2"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'medium' ,color: 'text.secondary'}}
                    >
                        Most {formatLabel(title)}
                    </Typography>

                    {typeof value === 'number' ? (
                        <Typography variant="h4" align="center" color="primary">
                            {value}
                        </Typography>
                    ) : maxEntry ? (
                        <Box display="flex" justifyContent="space-between" mt={1}>
                            <Typography variant="body2" fontSize={24} fontWeight={600}>

                                {formatLabel(maxEntry[0])}
                            </Typography>
                            <Typography variant="h5" color="text.primary" fontWeight={600}>
                                {maxEntry[1]}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No data available
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
};


