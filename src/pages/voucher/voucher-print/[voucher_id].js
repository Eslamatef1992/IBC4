import apiUrl from '@/components/api-url';
import getTranslation from '@/languages';
import React, {useState, useEffect, useRef} from 'react';
import Image from 'next/image';

import router from 'next/router';
import AccountsNumberFormat from '@/components/accounts-number-format';
import numberToWords from 'number-to-words';
import CompanyInfo from '@/components/company-info';

const VoucherPrint = ({data})=> {
    let user_id, user_group, user_company, user_branch;
    if (typeof window !== 'undefined') {
        user_id         = localStorage.getItem('user_id');
        user_group      = localStorage.getItem('user_group');
        user_company    = localStorage.getItem('user_company');
        user_branch     = localStorage.getItem('user_branch');

        // user_group =1 Super Admin, user_group =2 Admin, user_group =3 Manager, user_group =4 User
        if(user_group == 1 || user_group == 2 || user_group == 3 || user_group == 3 || user_group == 4) { } else {
            router.replace('/logout');
            return true;
        }
    }

    const lang = getTranslation();

    const [company_info, setCompany_info]           = useState('');
    const [branch_info, setBranch_info]             = useState('');
    const [voucher_data, setVoucher_data]           = useState('');
    const [company_picture, setCompany_picture]     = useState('');
    const [company_data, setCompany_data]           = useState('');
    const [accounts_details, setAccounts_details]   = useState([]);

    const voucherData = ()=> {
        const axios = apiUrl.get("accounts/get-voucher/"+data);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setVoucher_data(result_data.data);
                setAccounts_details(result_data.data.accounts_details || []);
                setCompany_info(result_data.company)
                setBranch_info(result_data.branch)
            } else {
                setVoucher_data('');
                setAccounts_details([]);
                setCompany_info("")
                setBranch_info("")
            }
        }).catch((e) => console.log(e));
    }

    useEffect(() => {
        voucherData();
    }, []);

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 p-3 tx-center">
                        <CompanyInfo company_data={company_info} branch_data={branch_info} />

                        <table className="tx-uppercase mt-3" width="100%" align="center">
                            <tbody>
                                <tr className="">
                                    <th className="tx-center tx-uppercase text-decoration-underline tx-18" colSpan="2" width="100%">{voucher_data.accounts_voucher_type_name}</th>
                                </tr>
                                <tr className="">
                                    <th className="tx-left" width="50%">{lang.voucher_no}: {voucher_data.accounts_voucher_number}</th>
                                    <th className="tx-right" width="50%">{lang.date}: {new Date(voucher_data.accounts_posting_date).toLocaleString("en-in", { day : '2-digit', month: '2-digit', year:'numeric'})}</th>
                                </tr>
                            </tbody>
                        </table><br/>
                        <table className="tx-uppercase" width="100%" align="center">
                            <tbody>
                                <tr className="">
                                    <th className="tx-left" width="10%">{lang.narration}: </th>
                                    <th className="tx-left" width="85%">{voucher_data.accounts_narration}</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 p-3 pt-0">
                        <table className="table table-bordered">
                            <thead className="tx-12 tx-uppercase">
                                <tr>
                                    <th className="text-center">{lang.sn}</th>
                                    <th className="text-center">{lang.head_of_accounts}</th>
                                    <th className="text-center">{lang.particulars}</th>
                                    <th className="text-center">{lang.debit}</th>
                                    <th className="text-center">{lang.credit}</th>
                                </tr>
                            </thead>
                            {accounts_details.length > 0 ?
                            <tbody>
                                {accounts_details.map((row, index) => {
                                return (
                                <tr className='' key={row.accounts_details_id}>
                                    <td className="tx-center">{(index+1).toString().padStart(2, '0')}</td>
                                    <td className="tx-left">{row.accounts_details_general_ledger_code} - {row.accounts_details_general_ledger_name}</td>
                                    <td className="tx-left">{row.accounts_details_subsidiary_ledger_code} - {row.accounts_details_subsidiary_ledger_name}</td>
                                    <td className="tx-right"><AccountsNumberFormat amount={row.accounts_details_debit} /></td>
                                    <td className="tx-right"><AccountsNumberFormat amount={row.accounts_details_credit} /></td>
                                </tr>
                                )})}
                                <tr className="text-uppercase">
                                    <th className="tx-right" colSpan={3}>{lang.total_amount}</th>
                                    <th className="tx-right"><AccountsNumberFormat amount={voucher_data.accounts_total_debit} /></th>
                                    <th className="tx-right"><AccountsNumberFormat amount={voucher_data.accounts_total_credit} /></th>
                                </tr>
                                <tr className="tx-uppercase">
                                    <th className="tx-left" colSpan={5}>
                                        {lang.in_words}: {numberToWords.toWords(voucher_data.accounts_total_debit)} Only.
                                    </th>
                                </tr>
                            </tbody>
                            :
                            <tbody>
                                <tr>
                                    <th className="tx-center tx-uppercase text-danger" colSpan="5">{lang.data_not_found}</th>
                                </tr>
                            </tbody>
                            }
                        </table>
                        <center>
                            <button type="button" className="btn btn-info d-print-none m-2" onClick={() => window.print()} title={lang.print}><i className="fal fa-print"></i></button>
                            <button type="button" className="btn btn-danger d-print-none m-2" onClick={()=> (window.close())} title={lang.close}><i className="fal fa-times-circle"></i></button>
                        </center>
                        <br/><br/><br/>
                        <table className="" width="100%" align="center">
                            <tbody><tr className="text-uppercase">
                                    <th width="15%" className="text-center bd-top">{lang.prepared_by}</th>
                                    <th width="20%"></th>
                                    <th width="15%" className="text-center bd-top">{lang.checked_by}</th>
                                    <th width="20%"></th>
                                    <th width="15%" className="text-center bd-top">{lang.authorized}</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps = async (context) => {
    const data = context.params.voucher_id;

    return {
        props:{
            data
        }
    }
}

export default VoucherPrint;