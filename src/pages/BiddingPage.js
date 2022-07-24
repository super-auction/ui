import React, { useState, useEffect } from 'react';
import Page from '../components/Page'

import { useContractRead } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../lib/utils'
import { Link } from "react-router-dom";

export default function BiddingPage() {

    const [totalProducts, setTotalProducts] = useState(0)

    const { data: nextId  } = useContractRead({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: CONTRACT_ABI,
        functionName: 'getNextId',
    })

    useEffect(() => {
        setTotalProducts(Number(nextId.toString())-1) 
    }, [nextId])


    return (
        <Page>
            <h1>Bidding Page</h1>
            <p>Total Product Auctions: {totalProducts}</p>

            <ul>
            {
                Array.from(Array(totalProducts).keys()).map(x => {
                    console.log(x)
                    return (
                        <li>
                            <Link to={`/product/${x+1}`}>Auction {x+1}</Link>
                        </li>
                    )
                })
            }

            </ul>
        </Page>
    )
}