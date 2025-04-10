import { router } from 'next/router';
import {useState, useEffect, useRef} from 'react';

const Suppliers = ()=> {
    useEffect(() => {
        router.push('suppliers/supplier-list');
    }, []);

    return (
        <></>
    );
}

export default Suppliers;