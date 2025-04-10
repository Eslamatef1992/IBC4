import { router } from 'next/router';
import {useState, useEffect, useRef} from 'react';

const Products = ()=> {
    useEffect(() => {
        router.push('/products/product-list');
    }, []);

    return (
        <></>
    );
}

export default Products;