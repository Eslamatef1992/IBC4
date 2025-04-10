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
import CompanyInfo from '@/components/company-info';
import numberToWords from 'number-to-words';

const SalesReturnInvoice = ({data})=> {
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
            <HeaderTitle title={lang.sales_return+' '+lang.invoice} keywords='' description=''/>
            {sales_return_details.length > 0?
            <div className="container">
                <div className="row">
                    <div className="col-md-12 mg-b-15">
                        <div className="row clearfix mb-3">
                            <div className="col-md-12 tx-center">
                                <CompanyInfo company_data={company_data} branch_data={branch_data} />
                            </div>
                            <div className="d-print-none tx-center mt-1">
                                <button type="button" className="btn btn-info tx-uppercase" onClick={()=> (window.print())}><i className="fal fa-print"></i> {lang.print}</button> &nbsp;
                                <button type="button" className="btn btn-danger tx-uppercase" onClick={()=> (window.close())}><i className="fal fa-times"></i> {lang.close}</button>
                            </div>
                            
                            <div className="col-md-12 tx-center mt-3">
                                <h6 className="tx-center tx-bold tx-20 tx-uppercase tx-underline">{lang.sales_return+' '+lang.invoice}</h6>
                                <table width="100%">
                                    <tbody>
                                        <tr>
                                            <th className="tx-left" width="40%">{lang.customer}: {sales_return.sales_return_customer_name}</th>
                                            <th className="tx-center tx-uppercase tx-16" width="20%" rowSpan={3}>
                                                
                                                <Barcode value={sales_return.sales_return_sales_invoice} {...barcode_options} />
                                                {sales_return.sales_return_payment_status}
                                                </th>
                                            <th className="tx-right" width="40%">{lang.invoice}: {sales_return.sales_return_sales_invoice}</th>
                                        </tr>
                                        <tr>
                                            <th className="tx-left">{lang.contact_person}: {sales_return.sales_return_customer_contact_person}</th>
                                            <th className="tx-right">{lang.sales_date}: {sales_return.sales_return_sales_date}</th>
                                        </tr>
                                        <tr>
                                            <th className="tx-left">{lang.phone}: {sales_return.sales_return_customer_phone}</th>
                                            <th className="tx-right">{lang.return_date}: {sales_return.sales_return_date}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="col-md-12 tx-center mt-3">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="tx-center" width="40%">{lang.product}</th>
                                            <th className="tx-center" width="12%">{lang.return} {lang.price}</th>
                                            <th className="tx-center" width="10%">{lang.qty}</th>
                                            <th className="tx-center" width="12%">{lang.return}<br/>{lang.amount}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales_return_details.map((row, index) => (
                                        <tr className="tx-8-force" key={index}>
                                            <td className="tx-left">{row.sales_return_details_product_name}</td>
                                            <td className="tx-right"><AccountsNumberFormat amount={row.sales_return_details_return_price}/></td>
                                            <td className="tx-center">{(row.sales_return_details_return_quantity).toString().padStart(2, '0')}{row.sales_return_details_product_unit_code}</td>
                                            <td className="tx-right"><AccountsNumberFormat amount={row.sales_return_details_return_amount}/></td>
                                        </tr>
                                        ))}
                                        <tr className="tx-8-force tx-uppercase">
                                            <th className="tx-right" colSpan={3}>{lang.total}</th>
                                            <th className="tx-right"><AccountsNumberFormat amount={sales_return.sales_return_total_amount}/></th>
                                        </tr>
                                        <tr className="tx-8-force tx-uppercase">
                                            <th className="tx-right" colSpan={3}>{lang.adjustment}(+/-)</th>
                                            <th className="tx-right"><AccountsNumberFormat amount={sales_return.sales_return_adjustment_amount}/></th>
                                        </tr>
                                        <tr className="tx-8-force tx-uppercase">
                                            <th className="tx-right" colSpan={3}>{lang.payable}</th>
                                            <th className="tx-right"><AccountsNumberFormat amount={sales_return.sales_return_payable_amount}/></th>
                                        </tr>
                                        <tr className="tx-8-force tx-uppercase">
                                            <th className="tx-right" colSpan={3}>{lang.paid}</th>
                                            <th className="tx-right"><AccountsNumberFormat amount={sales_return.sales_return_paid_amount}/></th>
                                        </tr>
                                        <tr className="tx-8-force tx-uppercase">
                                            <th className="tx-right" colSpan={3}>{lang.due}</th>
                                            <th className="tx-right"><AccountsNumberFormat amount={sales_return.sales_return_due_amount}/></th>
                                        </tr>
                                    </tbody>
                                </table>
                                <h6 className="tx-bold tx-left tx-uppercase">{lang.in_words}: {numberToWords.toWords(sales_return.sales_return_paid_amount)} only</h6>
                                <QRCode value={currentURL} style={{ height: "auto", maxWidth: "15%", width: "15%", margin:"2px"}} />
                                
                                <table className="" width="100%" align="center">
                                    <tbody><tr className="text-uppercase">
                                            <th width="15%" className="text-center bd-top">{lang.customers}</th>
                                            <th width="20%"></th>
                                            <th width="15%" className="text-center"> </th>
                                            <th width="20%"></th>
                                            <th width="15%" className="text-center bd-top">{lang.authorized}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                        </div>
                    </div>
                </div>
                {/* Content End */}
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

export default SalesReturnInvoice;