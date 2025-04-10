import { router } from 'next/router';
import {useState, useEffect, useRef} from 'react';

const Sales = ()=> {
    useEffect(() => {
        router.push('/sales/sales-list');
    }, []);

    return (
        <></>
    );
}

export default Sales;