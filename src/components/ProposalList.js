import React from "react";
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function ProposalList(props) {
    return (
        <>
        <Card sx={{marginTop: '50px',  minWidth: 200, bgcolor: 'background.paper' }}>
        <CardContent>
        <Typography sx={{ fontSize: 18 }} color="text.primary">
            Proposals
        </Typography>
            <List>
                {props.proposals.map((proposal, index) => {
                    return (
                        <ListItem key={index}>
                            <Button onClick={() => props.selectProposal(proposal)} variant="outlined">
                                Proposal {index + 1}
                            </Button>
                        </ListItem>
                    )
                })}
            </List>
            </CardContent>
        </Card>
        </>
    );
}