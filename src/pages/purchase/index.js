import { router } from 'next/router';
import {useState, useEffect, useRef} from 'react';

const Purchase = ()=> {
    useEffect(() => {
        router.push('/purchase/purchase-list');
    }, []);

    return (
        <></>
    );
}

export default Purchase;