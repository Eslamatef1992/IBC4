import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect} from 'react';

import HeaderTitle from '@/components/header-title';
import getTranslation from '@/languages';
import apiUrl from '@/components/api-url';
import { useRouter } from 'next/router';
import Barcode from 'react-barcode';

const ProductBarcode = ()=> {
    let user_id, user_group, user_company, user_branch;
    if (typeof window !== 'undefined') {
        user_id         = localStorage.getItem('user_id');
        user_group      = localStorage.getItem('user_group');
        user_company    = localStorage.getItem('user_company');
        user_branch     = localStorage.getItem('user_branch');
    }
    const lang          = getTranslation();
    const router        = useRouter();
    const product       = router.query.product;
    const quantity      = router.query.quantity;
    const barcode       = router.query.barcode;

    const [product_data, setProduct_data]   = useState('');

    const barcode_options ={
        width: 1,
        height: 40,
        textMargin: 1,
        margin: 2,
        format: "CODE128",
        fontSize: 12,
    }
    
    const productData = ()=> {
        const axios = apiUrl.get("product/get-product/"+product);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setProduct_data(result_data.data);
            } else {
                setProduct_data('');
            }
        }).catch((e) => console.log(e));
    }

    useEffect(() => {
        productData();
    }, [product, quantity, barcode]);
    return (
        <>
            <HeaderTitle title={lang.product+' '+lang.barcode} keywords='' description='' />
            <div className="container">
                <div className="row clearfix mb-3 d-print-none">
                    <div className="col-12 tx-center">
                        <div className="mt-1">
                            <button type="button" className="btn btn-info tx-uppercase" onClick={()=> (window.print())}><i className="fal fa-print"></i> {lang.print}</button> &nbsp;
                            <button type="button" className="btn btn-danger tx-uppercase" onClick={()=> (window.close())}><i className="fal fa-times"></i> {lang.close}</button>
                        </div>
                    </div>
                </div>
                <div className="row clearfix mb-3">
                {(() => {
                    const data = [];
                    for (let i = 0; i < quantity; i++) {
                        data.push(
                        <div className="col-3 tx-center mt-3 p-0 border">
                            <p className="tx-bold tx-9  m-0">{product_data.product_name}</p>
                            <Barcode value={barcode} {...barcode_options} />
                            <p className="tx-bold tx-10 m-0">{lang.price}: {product_data.product_sales_price}</p>
                        </div>
                        );
                    }
                    return data;
                })()}
                </div>
                <div className="row clearfix mt-3  mb-3 d-print-none">
                    <div className="col-12 tx-center">
                        <div className="mt-1">
                            <button type="button" className="btn btn-info tx-uppercase" onClick={()=> (window.print())}><i className="fal fa-print"></i> {lang.print}</button> &nbsp;
                            <button type="button" className="btn btn-danger tx-uppercase" onClick={()=> (window.close())}><i className="fal fa-times"></i> {lang.close}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductBarcode;