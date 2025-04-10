import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect, useRef} from 'react';

import HeaderTitle from '@/components/header-title';
import getTranslation from '@/languages';
import apiUrl from '@/components/api-url';
import { useRouter } from 'next/router';
import AccountsNumberFormat from '@/components/accounts-number-format';
import Barcode from 'react-barcode';
import QRCode from "react-qr-code";
import CompanyInfo from '@/components/company-info';
const DueCollectionInvoice = ()=> {
    let user_id, user_group, user_company, user_branch;
    if (typeof window !== 'undefined') {
        user_id         = localStorage.getItem('user_id');
        user_group      = localStorage.getItem('user_group');
        user_company    = localStorage.getItem('user_company');
        user_branch     = localStorage.getItem('user_branch');
    }
    const lang          = getTranslation();
    const router        = useRouter();
    const [print_date, setPrint_date]   = useState(new Date().toISOString().split('T')[0]);
    const company                       = router.query.company;
    const branch                        = router.query.branch;
    const customer                      = router.query.customer;
    const payment_date                  = router.query.payment_date;

    const [company_data, setCompany_data]           = useState('');
    const [branch_data, setBranch_data]             = useState('');
    const [customer_data, setCustomer_data]         = useState('');
    const [currentURL, setCurrentURL]               = useState('');

    const [due_collection_list, setDue_collection_list]   = useState([]);
    
    const total_paid    = due_collection_list.reduce((amount, data) => amount + parseFloat((data.customer_payment_paid)), 0);

    const duePaymentData = ()=> {
        const axios = apiUrl.get("sales/get-due-collection/?company="+company+"&branch="+branch+"&customer="+customer+"&payment_date="+payment_date);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setDue_collection_list(result_data.data);
                setCompany_data(result_data.company);
                setBranch_data(result_data.branch);
                setCustomer_data(result_data.customer);
            } else {
                setDue_collection_list([]);
                setCompany_data('');
                setBranch_data('');
                setCustomer_data('');
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
        duePaymentData();
        setCurrentURL(window.location.href);
    }, [company, branch, customer, payment_date]);
    return (
        <>
            <HeaderTitle title={lang.due_collection+' '+lang.receipt} keywords='' description=''/>
            {due_collection_list.length > 0?
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
                                <h6 className="tx-center tx-bold tx-20 tx-uppercase tx-underline">{lang.due_collection+' '+lang.invoice}</h6>
                                <table width="100%">
                                    <tbody>
                                        <tr>
                                            <th className="tx-left" width="40%">{lang.customer}: {customer_data.customer_name}</th>
                                            <th className="tx-right">{lang.payment_date}: {new Date(payment_date).toLocaleString('en-in', {day: '2-digit', month:'2-digit', year: 'numeric'})}</th>
                                        </tr>
                                        <tr>
                                            <th className="tx-left">{lang.contact_person}: {customer_data.customer_contact_person}</th>
                                            <th className="tx-right">{lang.print_date}: {new Date(print_date).toLocaleString('en-in', {day: '2-digit', month:'2-digit', year: 'numeric'})}</th>
                                        </tr>
                                        <tr>
                                            <th className="tx-left">{lang.phone}: {customer_data.customer_phone_number}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="col-md-12 tx-center mt-3">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="tx-center" width="40%">{lang.payment_date}</th>
                                            <th className="tx-center" width="40%">{lang.invoice}</th>
                                            <th className="tx-center" width="40%">{lang.payable}</th>
                                            <th className="tx-center" width="40%">{lang.paid}</th>
                                            <th className="tx-center" width="40%">{lang.due}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {due_collection_list.map((row, index) => (
                                        <tr className="tx-8-force" key={index}>
                                            <td className="tx-center">{new Date(row.customer_payment_date).toLocaleString('en-in', {day: '2-digit', month:'2-digit', year: 'numeric'})}</td>
                                            <td className="tx-center">{row.customer_payment_sales_invoice}</td>
                                            <td className="tx-right"><AccountsNumberFormat amount={row.customer_payment_payable}/></td>
                                            <td className="tx-right"><AccountsNumberFormat amount={row.customer_payment_paid}/></td>
                                            <td className="tx-right"><AccountsNumberFormat amount={row.customer_payment_due}/></td>
                                        </tr>
                                        ))}
                                        <tr className="tx-8-force tx-uppercase">
                                            <th className="tx-right" colSpan={3}>{lang.total}</th>
                                            <th className="tx-right"><AccountsNumberFormat amount={total_paid}/></th>
                                            <th className="tx-right"></th>
                                        </tr>
                                    </tbody>
                                </table>
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
            </div>
            :''}
        </>
    );
}

export default DueCollectionInvoice;