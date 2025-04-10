import { router } from 'next/router';
import {useState, useEffect, useRef} from 'react';

const Customers = ()=> {
    useEffect(() => {
        router.push('customers/customer-list');
    }, []);

    return (
        <></>
    );
}

export default Customers;