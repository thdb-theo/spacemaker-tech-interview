import React from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function Operations(props) {
    return (
        <Card sx={{ marginTop: '50px', maxWidth: 300, bgcolor: 'background.paper' }}>
            <CardContent>
                <Typography sx={{ fontsize: 18, marginBottom: '10px' }} color="text.primary">
                    Operations
                </Typography>
                <ButtonGroup disabled={props.selectedPolygons.length !== 2} variant="outlined">
                    <Button onClick={props.onUnion}>Union</Button>
                    <Button onClick={props.onIntersection}>Intersection</Button>
                </ButtonGroup>
            </CardContent>
        </Card>
    );
}
