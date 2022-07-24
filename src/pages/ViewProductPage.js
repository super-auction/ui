import React, { useState, useEffect } from 'react';
import Page from '../components/Page'
import { useParams } from "react-router-dom";

import { Box, Button, TextField, Alert } from '@mui/material'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useContractRead, useContractWrite, useFeeData, useAccount } from 'wagmi'

import { CONTRACT_ABI, CONTRACT_ADDRESS, toEth, toWei, formatDate, formatNumber } from '../lib/utils'


export default function ViewProductPage() {
    const { id: pageId } = useParams()
    const [ productId, setProductId ] = useState()
    const [ bidPrice, setBidPrice ] = useState(0)

    const feeData = useFeeData({
        watch: false,
        cacheTime: 2_000,
    })

    const { data: productAuction } = useContractRead({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: CONTRACT_ABI,
        functionName: 'getProductById',
        args: [productId]
    })

    const { data: highestBid } = useContractRead({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: CONTRACT_ABI,
        functionName: 'getHighestBid',
        args: [productId]
    })



    const { write: execWriteBid } = useContractWrite({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: CONTRACT_ABI,
        functionName: 'bid',
        args: [productId, bidPrice],
        overrides: {
            gasLimit: 500000,
            gasPrice: feeData?.gasPrice || 0
        },
        onMutate({args}) {
            args[1] = toWei(args[1].toString())
        },
        onError(error) {
            console.log('contract write error', error)
        }
    })


    const { write: execWriteClaimProduct } = useContractWrite({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: CONTRACT_ABI,
        functionName: 'claimProduct',
        args: [productId],
        overrides: {
            value: toWei(`${toEth(highestBid?.bidAmount || 0)}`),
            gasLimit: 500000,
            gasPrice: feeData?.gasPrice || 0
        },
        onMutate({args}) {
            // args[1] = toWei(args[1].toString())
        },
        onError(error) {
            console.log('contract write error', error)
        }
    })

    const account = useAccount();

    const { data: productUrl } = useContractRead({
        enabled: true,
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: CONTRACT_ABI,
        functionName: 'getProductUrl',
        args: [productId],
        overrides: {
            from: account?.address
        },
        onMutate({args}) {
            console.log('getProductUrl args', args)
        },
    })
    console.log('productUrl', productUrl)


    useEffect(() => {
        if (pageId) {
            setProductId(pageId)
        }
    }, [pageId])

    useEffect(() => {
        if (productAuction && highestBid) {
            const initPrice = +formatNumber(productAuction.initialPrice)
            const highBid = +formatNumber(highestBid.bidAmount)

            if (highBid > 0) {
                setBidPrice(highBid + highBid*0.05)
            } else {
                setBidPrice(initPrice + initPrice*0.05)
            }            
        }
    }, [productAuction, highestBid])

    return (
        <Page>
            <h1>Product Auction {productId}</h1>

            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem>
                    <ListItemAvatar>
                    <Avatar>
                        <AttachMoneyIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Initial Price" secondary={formatNumber(productAuction?.initialPrice)} />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                    <Avatar>
                        <StorefrontIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Seller" secondary={productAuction?.seller} />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                    <Avatar>
                        <MonetizationOnIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Highest Bid Price" secondary={formatNumber(highestBid?.bidAmount)} />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                    <Avatar>
                        <PersonIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Highest Bid Owner" secondary={highestBid?.owner} />
                </ListItem>

                <ListItem>
                    <ListItemAvatar>
                    <Avatar>
                        <CalendarMonthIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Start Bid" secondary={formatDate(productAuction?.bidStart)} />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                    <Avatar>
                        <SportsScoreIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="End Date" secondary={formatDate(productAuction?.bidEnd)}/>
                </ListItem>
            </List>
            <Box component="form"
                sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }}}
                noValidate
                autoComplete="off">
                <TextField 
                    value={bidPrice || 0}
                    InputLabelProps={{ shrink: true, required: true }}
                    onChange={(e) => setBidPrice(e.target.value)}
                    label="Set Your New Bid Price" />            
            </Box>
            <p>
                <Button  onClick={() => execWriteBid()} variant="contained">BID to this product</Button>
            </p>
            <small>
                <strong>*BID:</strong>The new bid price suggestion is 5% more than the initial price or the highest bid price
            </small>

            <p>
                <Button disabled={account?.address !== highestBid?.owner} 
                onClick={() => execWriteClaimProduct()}
                variant="contained">Claim Product</Button>
            </p>
            <small>
                <strong>*Claim:</strong>You can claim this product if you are the owner of the highest bid
            </small>

            <p>
                {account?.address === highestBid?.owner && <Alert severity="success">Product URL: {productUrl}</Alert>}
            </p>
        </Page>
    )
}