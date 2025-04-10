import { router } from 'next/router';
import {useState, useEffect, useRef} from 'react';

const Warehouse = ()=> {
    useEffect(() => {
        router.push('warehouse/warehouse-list');
    }, []);

    return (
        <></>
    );
}

export default Warehouse;