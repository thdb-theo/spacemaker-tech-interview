import React from "react";
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import ListSubheader from '@mui/material/ListSubheader';

export default function ProposalList(props) {
    return (
        <Box sx={{ width: '100%', maxWidth: 200, bgcolor: 'background.paper' }}>
            <List subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Proposals
                </ListSubheader>
            }>
                {props.proposals.map((proposal, index) => {
                    return (
                        <ListItem key={index}>
                            <Button onClick={() => props.selectProposal(proposal)}>
                                Proposal {index + 1}
                            </Button>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    );
}