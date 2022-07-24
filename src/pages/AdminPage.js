import React, { useState } from 'react';
import Page from '../components/Page'
import { TextField, Box, Button } from '@mui/material'
import { useContractWrite } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS, toWei } from '../lib/utils'

export default function AdminPage() {
    const [price, setPrice] = useState(0.01)
    const [seller, setSeller] = useState('0xAba72FdecAe3C3B476e972599cbe8E29DC89dDBA')
    const [url, setUrl] = useState('http:example.com/product/1')
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
    const [endDate, setEndDate] = useState (new Date().toISOString().slice(0, 10))

    const { write: execWrite } = useContractWrite({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: CONTRACT_ABI,
        functionName: 'addProduct',
        args: [price, seller, url, startDate, endDate],
        onMutate({args}) {
            args[0] = toWei(args[0].toString())
            args[3] = +new Date(startDate)
            args[4] = +new Date(endDate)
        },
        onError(error) {
            console.log('contract write error', error)
        }
    })

    return (
        <Page>
            <h1>Admin Page</h1>
            <h3>New Auction</h3>
            <Box component="form"
                sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }}}
                noValidate
                autoComplete="off">
                    <TextField 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        label="Initial Price" />

                    <TextField 
                        value={seller}
                        onChange={(e) => setSeller(e.target.value)}
                        label="Seller"/>

                    <TextField 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        label="URL"/>

                    <TextField 
                        id="end_date"
                        type="date"
                        value={startDate}
                        InputLabelProps={{ shrink: true, required: true }}
                        onChange={(e) => setStartDate(e.target.value)}
                        label="Bid Start"/>

                    <TextField 
                        id="end_date"
                        type="date"
                        value={endDate}
                        InputLabelProps={{ shrink: true, required: true }}
                        onChange={(e) => setEndDate(e.target.value)}
                        label="Bid End"/>

            </Box>

            <Button onClick={() => execWrite()} sx={{marginTop: '10px', marginLeft: '10px'}}  variant="contained" >Add Product Auction</Button>

        </Page>
    )
}