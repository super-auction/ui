import React from 'react';
import Page from '../components/Page'

import { Link } from "react-router-dom";

export default function AdminPage() {

    return (
        <Page>
            <h1>Super Auction - Home Page</h1>
            <ul>
                <li>
                    <Link to="/admin">Add Auction</Link>
                </li>
                <li>
                    <Link to="/bid">Bid</Link>
                </li>
        </ul>
        </Page>
    )
}