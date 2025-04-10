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
const DueCollectionReceipt = ()=> {
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

    const [due_payment_list, setDue_payment_list]   = useState([]);
    
    const total_payment_amount = due_payment_list.reduce((amount, data) => amount + parseFloat((data.customer_payment_paid)), 0);

    const duePaymentData = ()=> {
        const axios = apiUrl.get("sales/get-due-collection/?company="+company+"&branch="+branch+"&customer="+customer+"&payment_date="+payment_date);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setDue_payment_list(result_data.data);
                setCompany_data(result_data.company);
                setBranch_data(result_data.branch);
                setCustomer_data(result_data.customer);
            } else {
                setDue_payment_list([]);
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
            {due_payment_list.length > 0?
            <div className="invoice-pos">
                <div className="col tx-center tx-bold mb-3"> 
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
                    <h6 className="tx-center tx-bold tx-14 tx-uppercase tx-underline">{lang.due_collection+' '+lang.receipt}</h6>
                    <table className="m-0" width="100%">
                        <tbody>
                            <tr>
                                <th className="tx-left" colSpan={2}>{lang.customer}: {customer_data.customer_name}</th>
                            </tr>
                            <tr>
                                <th className="tx-left">{lang.phone}: {customer_data.customer_phone_number}</th>
                                <th className="tx-right">{lang.date}: {new Date(payment_date).toLocaleString('en-in', {day: '2-digit', month:'2-digit', year: 'numeric'})}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <table className="table m-0">
                    <thead className="bd-bottom-dashed">
                        <tr className="tx-8-force">
                            <th className="tx-center">{lang.date}</th>
                            <th className="tx-center">{lang.invoice}</th>
                            <th className="tx-right">{lang.amount}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {due_payment_list.map((row, index) => (
                        <tr className="tx-8-force" key={index}>
                            <td className="tx-center">{new Date(row.customer_payment_date).toLocaleString('en-in', {day: '2-digit', month:'2-digit', year: 'numeric'})}</td>
                            <td className="tx-center">{row.customer_payment_sales_invoice}</td>
                            <td className="tx-right"><AccountsNumberFormat amount={row.customer_payment_paid}/></td>
                        </tr>
                        ))}

                        <tr className="tx-8-force tx-uppercase bd-top-dashed">
                            <th className="tx-right" colSpan={2}>{lang.total}</th>
                            <th className="tx-right"><AccountsNumberFormat amount={total_payment_amount}/></th>
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

export default DueCollectionReceipt;