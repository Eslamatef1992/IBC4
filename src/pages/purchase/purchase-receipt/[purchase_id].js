import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect, useRef} from 'react';

import HeaderTitle from '@/components/header-title';
import getTranslation from '@/languages';
import apiUrl from '@/components/api-url';
import router from 'next/router';
import AccountsNumberFormat from '@/components/accounts-number-format';
import Barcode from 'react-barcode';
import QRCode from "react-qr-code";
const PurchaseReceipt = ({data})=> {
    let user_id, user_group, user_company, user_branch;
    if (typeof window !== 'undefined') {
        user_id         = localStorage.getItem('user_id');
        user_group      = localStorage.getItem('user_group');
        user_company    = localStorage.getItem('user_company');
        user_branch     = localStorage.getItem('user_branch');
    }
    const lang = getTranslation();

    const [print_date, setPrint_date]               = useState(new Date().toISOString().split('T')[0]);
    const [purchase, setPurchase_data]              = useState('');
    const [purchase_details, setPurchase_details]   = useState([]);
    const [purchase_company, setPurchase_company]   = useState('');
    const [purchase_branch, setPurchase_branch]     = useState('');
    const [company_data, setCompany_data]           = useState('');
    const [branch_data, setBranch_data]             = useState('');
    const [currentURL, setCurrentURL]               = useState('');

    const purchaseData = ()=> {
        const axios = apiUrl.get("purchase/get-purchase/"+data);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setPurchase_data(result_data.data);
                setPurchase_details(result_data.data.purchase_details);
                setPurchase_company(result_data.data.purchase_company);
                setPurchase_branch(result_data.data.purchase_branch);
            } else {
                setPurchase_data('');
                setPurchase_details([]);
                setPurchase_company('');
                setPurchase_branch('');
            }
        }).catch((e) => console.log(e));
    }
    
    const companyData = ()=> {
        const axios = apiUrl.get("/company/get-company/"+purchase_company);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setCompany_data(result_data.data);
            } else {
                setCompany_data('');
            }
        }).catch((e) => console.log(e));
    }
    
    const branchData = ()=> {
        const axios = apiUrl.get("/branch/get-branch/"+purchase_branch);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setBranch_data(result_data.data);
            } else {
                setBranch_data('');
            }
        }).catch((e) => console.log(e));
    }

    const barcode_options ={
        width: 2,
        height: 40,
        textMargin: 1,
        margin: 2,
        format: "CODE128",
        fontSize: 12,
    }

    useEffect(() => {
        purchaseData();
        companyData();
        branchData();
        setCurrentURL(window.location.href);
    }, [purchase_company]);
    return (
        <>
            <HeaderTitle title={lang.purchase+' '+lang.receipt} keywords='' description=''/>
            {purchase_details.length > 0?
            <div className="invoice-pos">
                <div className="col tx-center tx-bold"> 
                    {/* <Image src="/assets/images/CLS.svg" className="rounded mx-auto d-block" alt="Logo" width={70} height={70} /> */}
                    {!branch_data?<>
                    <h2 className="tx-16 tx-bold tx-uppercase">{company_data.company_name}</h2>
                    <address>{lang.cel}: {company_data.company_phone}<br/>{company_data.company_address}</address>
                    </>
                    :<>
                    <h2 className="tx-16 tx-bold tx-uppercase">{company_data.company_name}<br/>{branch_data.branch_name}</h2>
                    <address>{lang.cel}: {branch_data.branch_phone}<br/>{branch_data.branch_address}</address>
                    </>
                    }
                    <hr className='bd-top'/>

                    <Barcode value={purchase.purchase_invoice} {...barcode_options} />

                    <table width="100%">
                        <tbody>
                            <tr>
                                <th className="tx-left">{lang.inv}: {purchase.purchase_invoice}</th>
                                <th className="tx-right">{lang.date}: {purchase.purchase_date}</th>
                            </tr>
                            <tr>
                                <th className="tx-left" colSpan={2}>{lang.supplier}: {purchase.purchase_supplier_name}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <table className="table m-0">
                    <thead className="bd-bottom-dashed">
                        <tr className="tx-8-force">
                            <th className="tx-center" colSpan={2}>{lang.description}</th>
                            <th className="tx-right">{lang.amount}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchase_details.map((row, index) => (
                        <tr className="tx-8-force" key={index}>
                            <td className="tx-left">{row.purchase_details_product_name}</td>
                            <td className="tx-right"><AccountsNumberFormat amount={row.purchase_details_unit_price}/> X {row.purchase_details_purchase_quantity}{row.purchase_details_product_unit_code}</td>
                            <td className="tx-right"><AccountsNumberFormat amount={row.purchase_details_product_amount}/></td>
                        </tr>
                        ))}

                        <tr className="tx-8-force tx-uppercase bd-top-dashed">
                            <th className="tx-right" colSpan={2}>{lang.sub_total}</th>
                            <th className="tx-right"><AccountsNumberFormat amount={purchase.purchase_product_amount}/></th>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <td className="tx-right" colSpan={2}>{lang.discount}</td>
                            <td className="tx-right"><AccountsNumberFormat amount={0}/></td>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <td className="tx-right" colSpan={2}>{lang.tax_vat}</td>
                            <td className="tx-right"><AccountsNumberFormat amount={parseFloat(purchase.purchase_tax_vat_amount)}/></td>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <th className="tx-right" colSpan={2}>{lang.total_amount}</th>
                            <th className="tx-right"><AccountsNumberFormat amount={parseFloat(purchase.purchase_total_amount)}/></th>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <td className="tx-right" colSpan={2}>{lang.adjustment}</td>
                            <td className="tx-right"><AccountsNumberFormat amount={purchase.purchase_adjustment_amount}/></td>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <th className="tx-right" colSpan={2}>{lang.payable}</th>
                            <th className="tx-right"><AccountsNumberFormat amount={purchase.purchase_payable_amount}/></th>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <th className="tx-right" colSpan={2}>{lang.paid}</th>
                            <th className="tx-right"><AccountsNumberFormat amount={purchase.purchase_paid_amount}/></th>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <th className="tx-right" colSpan={2}>{lang.due}</th>
                            <th className="tx-right"><AccountsNumberFormat amount={purchase.purchase_due_amount}/></th>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <th className="tx-center" colSpan={3}>{lang.purchase} {lang.status}: {purchase.purchase_payment_status}</th>
                        </tr>
                    </tbody>
                </table>

                <div className="col tx-center">
                    <QRCode value={currentURL} style={{ height: "auto", maxWidth: "30%", width: "30%", margin:"2px"}} />
                </div>

                <div className="col d-print-none tx-center">
                    <button type="button" className="btn btn-info tx-uppercase" onClick={()=> (window.print())}><i className="fal fa-print"></i> {lang.print}</button>&nbsp;
                    <button type="button" className="btn btn-danger tx-uppercase" onClick={()=> (window.close())}><i className="fal fa-times"></i> {lang.close}</button>
                </div>
            </div>
            :''}
        </>
    );
}


export const getServerSideProps = async (context) => {
    const data = context.params.purchase_id;
    return {
        props:{
            // voucher_data, company_data
            data
        }
    }
}

export default PurchaseReceipt;