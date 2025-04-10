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
const SalesReturnReceipt = ({data})=> {
    let user_id, user_group, user_company, user_branch;
    if (typeof window !== 'undefined') {
        user_id         = localStorage.getItem('user_id');
        user_group      = localStorage.getItem('user_group');
        user_company    = localStorage.getItem('user_company');
        user_branch     = localStorage.getItem('user_branch');
    }
    const lang = getTranslation();

    const [print_date, setPrint_date]               = useState(new Date().toISOString().split('T')[0]);
    const [sales_return, setSales_return_data]              = useState('');
    const [sales_return_details, setSales_return_details]   = useState([]);
    const [sales_return_company, setSales_return_company]   = useState('');
    const [sales_return_branch, setSales_return_branch]     = useState('');
    const [company_data, setCompany_data]           = useState('');
    const [branch_data, setBranch_data]             = useState('');
    const [currentURL, setCurrentURL]               = useState('');

    const sales_returnData = ()=> {
        const axios = apiUrl.get("sales/get-sales-return/"+data);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setSales_return_data(result_data.data);
                setSales_return_details(result_data.data.sales_return_details);
                setSales_return_company(result_data.data.sales_return_company);
                setSales_return_branch(result_data.data.sales_return_branch);
            } else {
                setSales_return_data('');
                setSales_return_details([]);
                setSales_return_company('');
                setSales_return_branch('');
            }
        }).catch((e) => console.log(e));
    }
    
    const companyData = ()=> {
        const axios = apiUrl.get("/company/get-company/"+sales_return_company);
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
        const axios = apiUrl.get("/branch/get-branch/"+sales_return_branch);
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
        sales_returnData();
        companyData();
        branchData();
        setCurrentURL(window.location.href);
    }, [sales_return_company]);
    return (
        <>
            <HeaderTitle title={lang.sales_return+' '+lang.receipt} keywords='' description=''/>
            {sales_return_details.length > 0?
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

                    <Barcode value={sales_return.sales_return_sales_invoice} {...barcode_options} />

                    <table width="100%">
                        <tbody>
                            <tr>
                                <th className="tx-left">{lang.inv}: {sales_return.sales_return_sales_invoice}</th>
                                <th className="tx-right">{lang.date}: {sales_return.sales_return_date}</th>
                            </tr>
                            <tr>
                                <th className="tx-left" colSpan={2}>{lang.customer}: {sales_return.sales_return_customer_name}</th>
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
                        {sales_return_details.map((row, index) => (
                        <tr className="tx-8-force" key={index}>
                            <td className="tx-left">{row.sales_return_details_product_name}</td>
                            <td className="tx-right"><AccountsNumberFormat amount={row.sales_return_details_return_price}/> X {row.sales_return_details_return_quantity}{row.sales_return_details_product_unit_code}</td>
                            <td className="tx-right"><AccountsNumberFormat amount={row.sales_return_details_return_amount}/></td>
                        </tr>
                        ))}

                        <tr className="tx-8-force tx-uppercase bd-top-dashed">
                            <th className="tx-right" colSpan={2}>{lang.total}</th>
                            <th className="tx-right"><AccountsNumberFormat amount={sales_return.sales_return_total_amount}/></th>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <td className="tx-right" colSpan={2}>{lang.adjustment}</td>
                            <td className="tx-right"><AccountsNumberFormat amount={sales_return.sales_return_adjustment_amount}/></td>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <th className="tx-right" colSpan={2}>{lang.payable}</th>
                            <th className="tx-right"><AccountsNumberFormat amount={sales_return.sales_return_payable_amount}/></th>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <th className="tx-right" colSpan={2}>{lang.paid}</th>
                            <th className="tx-right"><AccountsNumberFormat amount={sales_return.sales_return_paid_amount}/></th>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <th className="tx-right" colSpan={2}>{lang.due}</th>
                            <th className="tx-right"><AccountsNumberFormat amount={sales_return.sales_return_due_amount}/></th>
                        </tr>
                        <tr className="tx-8-force tx-uppercase">
                            <th className="tx-center" colSpan={3}>{lang.sales} {lang.return} {lang.status}: {sales_return.sales_return_payment_status}</th>
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
    const data = context.params.sales_return_id;
    return {
        props:{
            data
        }
    }
}

export default SalesReturnReceipt;