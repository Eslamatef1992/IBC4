import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect, useRef} from 'react';
import Layout from '@/components/layout';

import { useDownloadExcel } from 'react-export-table-to-excel';

import HeaderTitle from '@/components/header-title';
import getTranslation from '@/languages';
import apiUrl from '@/components/api-url';
import { toast, ToastContainer } from 'react-toastify';
import router from 'next/router';
import AccountsNumberFormat from '@/components/accounts-number-format';
import CompanyInfo from '@/components/company-info';

const DayClose = ()=> {
    let user_id, user_group, user_company, user_branch;
    if (typeof window !== 'undefined') {
        user_id         = localStorage.getItem('user_id');
        user_group      = localStorage.getItem('user_group');
        user_company    = localStorage.getItem('user_company');
        user_branch     = localStorage.getItem('user_branch');

        // user_group =1 Super Admin, user_group =2 Admin, user_group =3 Manager, user_group =4 Accounts User, user_group =5 Sales & Sales, user_group =6 Sales, user_group =7 Sales
        if(user_group == 1 || user_group == 2 || user_group == 3 || user_group == 3 || user_group == 4 || user_group == 5 || user_group == 6 || user_group == 7 || user_group == 8) { } else {
            router.replace('/logout');
            return true;
        }
    }

    const lang = getTranslation();

    const [searchButton, setSearchButton]               = useState(false);
    
    const [submitButton, setSubmitButton]           = useState(false);
    const [warningModal, setWarningModal]           = useState(false);
    const [successModal, setSuccessModal]           = useState(false);
    const [message, setMessage]                     = useState('');
    
    const [company_list, setCompany_list]               = useState([]);
    const [branch_list, setBranch_list]                 = useState([]);

    const [day_close, setday_close]           = useState('');
    const [company_info, setCompany_info]               = useState('');
    const [branch_info, setBranch_info]                 = useState('');
    const [company, setCompany]                         = useState(user_company || '');
    const [branch, setBranch]                           = useState(user_branch || '');
    const [from_date, setFrom_date]                     = useState(new Date().toISOString().split('T')[0]);
    const [to_date, setTo_date]                         = useState(new Date().toISOString().split('T')[0]);

    const companyData = () => {
        const axios = apiUrl.get("/company/company-list-active");
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setCompany_list(result_data.data);
            } else {
                setCompany_list([]);
            }
        }).catch((e) => console.log(e));
    }

    const branchData = () => {
        const axios = apiUrl.get("/branch/branch-list-active/"+company);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setBranch_list(result_data.data);
            } else {
                setBranch_list([]);
            }
        }).catch((e) => console.log(e));
    }

    const searchDayClose = () => {
        setSearchButton(true);
        if(company <= 0) {
            setMessage(lang.company_select_warning);
            setWarningModal(true);
            setSearchButton(false);
        } else if(branch <= 0) {
            setMessage(lang.branch_select_warning);
            setWarningModal(true);
            setSearchButton(false);
        } else {
            const axios = apiUrl.get("/reports/summary-report/?company="+company+"&branch="+branch+"&from_date="+from_date+"&to_date="+from_date);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setday_close(result_data.data);
                    setCompany_info(result_data.company);
                    setBranch_info(result_data.branch);
                    setSearchButton(false);
                } else {
                    setday_close('');
                    setCompany_info('');
                    setBranch_info('');
                    setSearchButton(false);
                }
            }).catch((e) => console.log(e));
        }
    }

    const dayCloseAuthorize = () => {
        setSubmitButton(true);
        if(company <= 0) {
            setMessage('Select Company');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(branch <= 0) {
            setMessage('Select Branch');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(from_date.length <= 0) {
            setMessage('Choose Closing Date');
            setWarningModal(true);
            setSubmitButton(false);
        } else {
            const data = {
                company     : company,
                branch      : branch,
                from_date   : from_date,
                to_date     : from_date
            }
            const axios = apiUrl.post("/accounts/day-close-authorize/",data)
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setMessage(result_data.message);
                    setSuccessModal(true);
                    setSubmitButton(false);
                    console.log('data', result_data.data)
                } else {
                    setMessage(result_data.message);
                    setWarningModal(true);
                    setSubmitButton(false);
                }
            }).catch((e) => console.log(e));
        }
    }

    useEffect(() => {
        companyData();
        branchData();
    }, [company]);

    return (
        
        <Layout>
            <style>
            
        </style>
            <HeaderTitle title={lang.day_close} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5 d-print-none">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.day_close}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/accounts">{lang.accounts}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.day_close}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center d-print-none">
                            <button type="button" className="btn btn-primary rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.print} onClick={() => window.print()}><i className="fal fa-print"></i></button>
                        </div>
                    </div>
                </div>
                {/* Breadcrumb End */}

                {/* Content Start */}
                <div className="row">
                    <div className="col-md-12 mg-b-15">
                        <div className="row clearfix mb-3 d-print-none">
                            <div className="col-md-3 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="company">{lang.company}</label>
                                    <select type="text" className="form-control bd-info" id="company" name="company" value={company} onChange={(e) => setCompany(e.target.value)}>
                                        <option value="">{lang.select}</option>
                                        {company_list.map(company_row => (
                                        <option key={company_row.company_id} value={company_row.company_id}>{company_row.company_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="col-md-3 col-sm-12 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="branch">{lang.project}</label>
                                    <select type="text" className="form-control bd-info" id="branch" name="branch" value={branch} onChange={(e) => setBranch(e.target.value)}>
                                        <option value="">{lang.select}</option>
                                        {branch_list.map(branch_row => (
                                        <option key={branch_row.branch_id} value={branch_row.branch_id}>{branch_row.branch_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-3 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="from_date">{lang.closing_date}</label>
                                    <input type="date" className="form-control bd-info" id="from_date" name="from_date" value={from_date} onChange={(e) => setFrom_date(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-md-3 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-uppercase tx-semibold" htmlFor="search">&nbsp;</label>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className={`btn btn-success pd-t-6-force pd-b-5-force mg-r-3 tx-uppercase ${searchButton?'disabled': ''}`} onClick={() => searchDayClose()}>{searchButton?lang.process: lang.search}</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {company_info &&
                        <div className="row clearfix mb-3 d-none d-print-block">
                            <div className="col-md-12 tx-center">
                                <CompanyInfo company_data={company_info} branch_data={branch_info} />
                                <table className="mt-3" width="100%" align="center">
                                    <tbody>
                                        <tr className="">
                                            <th className="tx-left" width="30%" valign="top">
                                            </th>
                                            <th className="tx-center tx-uppercase" width="40%" valign="top">
                                                <span className='tx-uppercase tx-16 text-decoration-underline'>{lang.day_close}</span>
                                            </th>
                                            <th className="tx-right" width="30%" valign="top">
                                                {lang.print}: {new Date().toLocaleString("en-in", { day : '2-digit', month: '2-digit', year:'numeric', hour: "2-digit", minute: "2-digit"})}
                                            </th>
                                        </tr>
                                        <tr className="">
                                            <th className="tx-center tx-uppercase" colSpan="3" valign="top">
                                                From the Date of {new Date(from_date).toLocaleString("en-US", { day : '2-digit', month: 'short', year:'numeric'})} to {new Date(to_date).toLocaleString("en-US", { day : '2-digit', month: 'short', year:'numeric'})}
                                            </th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        }

                        <div className="table-responsive">
                        {searchButton?
                            <table className="table table-striped table-bordered">
                                <tbody>
                                    <tr className=''>
                                        <th className="tx-center d-print-none">
                                            <Image src="/assets/images/loading/loader.gif" alt="Loading" width={40} height={40} />
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                            :<>
                            {day_close?
                            <>
                            <h4 className="tx-16 tx-uppercase tx-bold">Purchase & Sales:</h4>
                            <table className="table table-striped table-bordered" width="100%">
                                <thead className="tx-12 tx-uppercase">
                                    <tr>
                                        <th className="tx-center" rowSpan={2} width="6%">{lang.sn}</th>
                                        <th className="tx-center" colSpan={3} width="47%">{lang.purchase}</th>
                                        <th className="tx-center" colSpan={3} width="47%">{lang.sales}</th>
                                    </tr>
                                    <tr>
                                        <th className="tx-center" width="32%">{lang.description}</th>
                                        <th className="tx-center" width="3%"></th>
                                        <th className="tx-center" width="15%">{lang.amount}</th>

                                        <th className="tx-center" width="32%">{lang.description}</th>
                                        <th className="tx-center" width="3%"></th>
                                        <th className="tx-center" width="15%">{lang.amount}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="">
                                        <td className="tx-center">{(1).toString().padStart(2, '0')}</td>
                                        <td className="tx-left">Purchase Amount</td>
                                        <td className="tx-center"></td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.purchase.purchase_amount}/></td>
                                        <td className="tx-left">Sales Amount</td>
                                        <td className="tx-center"></td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.sales.sales_amount}/></td>
                                    </tr>
                                    <tr className="">
                                        <td className="tx-center">{(2).toString().padStart(2, '0')}</td>
                                        <td className="tx-left">Purchase Payment</td>
                                        <td className="tx-center" style={{color:"#ff0000"}}>PV</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.purchase.purchase_paid_amount}/></td>
                                        <td className="tx-left">Sales Collection</td>
                                        <td className="tx-center" style={{color:"#008000"}}>RV</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.sales.sales_paid_amount}/></td>
                                    </tr>
                                    <tr className="">
                                        <td className="tx-center">{(3).toString().padStart(2, '0')}</td>
                                        <td className="tx-left">Purchase Due</td>
                                        <td className="tx-center" style={{color:"#1E43FC"}}>JV</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.purchase.purchase_due_amount}/></td>
                                        <td className="tx-left">Sales Due</td>
                                        <td className="tx-center" style={{color:"#1E43FC"}}>JV</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.sales.sales_due_amount}/></td>
                                    </tr>
                                    <tr className="">
                                        <td className="tx-center">{(4).toString().padStart(2, '0')}</td>
                                        <td className="tx-left">Purchase Due Payment</td>
                                        <td className="tx-center" style={{color:"#ff0000"}}>PV</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.purchase.purchase_due_payment}/></td>
                                        <td className="tx-left">Sales Due Collection</td>
                                        <td className="tx-center" style={{color:"#008000"}}>RV</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.sales.sales_due_payment}/></td>
                                    </tr>
                                    <tr className="">
                                        <td className="tx-center">{(5).toString().padStart(2, '0')}</td>
                                        <td className="tx-left">Purchase Return Amount</td>
                                        <td className="tx-center"></td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.purchase.purchase_return_amount}/></td>
                                        <td className="tx-left">Sales Return Amount</td>
                                        <td className="tx-center"></td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.sales.sales_return_amount}/></td>
                                    </tr>
                                    <tr className="">
                                        <td className="tx-center">{(6).toString().padStart(2, '0')}</td>
                                        <td className="tx-left">Purchase Return Collection</td>
                                        <td className="tx-center" style={{color:"#008000"}}>RV</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.purchase.purchase_return_paid_amount}/></td>
                                        <td className="tx-left">Sales Return Payment</td>
                                        <td className="tx-center" style={{color:"#ff0000"}}>PV</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.sales.sales_return_paid_amount}/></td>
                                    </tr>
                                    <tr className="">
                                        <td className="tx-center">{(7).toString().padStart(2, '0')}</td>
                                        <td className="tx-left">Purchase Return Due</td>
                                        <td className="tx-center" style={{color:"#1E43FC"}}>JV</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.purchase.purchase_return_due_amount}/></td>
                                        <td className="tx-left">Sales Return Due</td>
                                        <td className="tx-center" style={{color:"#1E43FC"}}>JV</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.sales.sales_return_due_amount}/></td>
                                    </tr>
                                    <tr className="">
                                        <td className="tx-center">{(8).toString().padStart(2, '0')}</td>
                                        <td className="tx-left">Purchase Return Due Collection</td>
                                        <td className="tx-center" style={{color:"#008000"}}>RV</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.purchase.purchase_return_due_payment}/></td>
                                        <td className="tx-left">Sales Return Due Payment</td>
                                        <td className="tx-center" style={{color:"#ff0000"}}>PV</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.sales.sales_return_due_payment}/></td>
                                    </tr>
                                </tbody>
                            </table>
                            <h4 className="tx-16 tx-uppercase tx-bold">Receipt & Payment:</h4>
                            <table className="table table-striped table-bordered" width="100%">
                                <thead className="tx-12 tx-uppercase">
                                    <tr>
                                        <th className="tx-center" rowSpan={2} width="6%">{lang.sn}</th>
                                        <th className="tx-center" colSpan={2} width="47%">{lang.receipt}</th>
                                        <th className="tx-center" colSpan={2} width="47%">{lang.payment}</th>
                                    </tr>
                                    <tr>
                                        <th className="tx-center" width="35%">{lang.description}</th>
                                        <th className="tx-center" width="15%">{lang.amount}</th>
                                        <th className="tx-center" width="35%">{lang.description}</th>
                                        <th className="tx-center" width="15%">{lang.amount}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="">
                                        <td className="tx-center">{(1).toString().padStart(2, '0')}</td>
                                        <td className="tx-left">Cash</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.receipt_payment.receipt.cash}/></td>
                                        <td className="tx-left">Cash</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.receipt_payment.payment.cash}/></td>
                                    </tr>
                                    <tr className="">
                                        <td className="tx-center">{(2).toString().padStart(2, '0')}</td>
                                        <td className="tx-left">Bank</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.receipt_payment.receipt.bank}/></td>
                                        <td className="tx-left">Bank</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={day_close.receipt_payment.payment.bank}/></td>
                                    </tr>
                                    
                                    <tr className="">
                                        <th className="tx-right tx-uppercase" colSpan={2}>{lang.total}</th>
                                        <th className="tx-right"><AccountsNumberFormat amount={day_close.receipt_payment_amount.total_receipt_amount}/></th>

                                        <th className="tx-right tx-uppercase">{lang.total}</th>
                                        <th className="tx-right"><AccountsNumberFormat amount={day_close.receipt_payment_amount.total_payment_amount}/></th>
                                    </tr>
                                </tbody>
                            </table>

                            <h4 className="tx-16 tx-uppercase tx-bold">Fund Need:</h4>
                            <table className="table table-striped table-bordered" width="100%">
                                <tbody>
                                    <tr className="">
                                        <td className="tx-center" width="6%">{(1).toString().padStart(2, '0')}</td>
                                        <td className="tx-left" width="35%">Cash</td>
                                        <td className="tx-right" width="15%"><AccountsNumberFormat amount={day_close.fund_need.cash}/></td>
                                        <td className="tx-left" width="35%">Bank</td>
                                        <td className="tx-right" width="15%"><AccountsNumberFormat amount={day_close.fund_need.bank}/></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="d-grid gap-2 mt-10 d-print-none">
                                <button type="button" className={`btn btn-success pd-t-6-force pd-b-5-force mg-r-3 tx-uppercase ${submitButton?'disabled': ''}`} onClick={()=> dayCloseAuthorize()}>{submitButton?lang.process: lang.authorize}</button>
                            </div>
                            </>
                            : ''}
                            </>
                            }
                        </div>
                    </div>
                </div>
                {/* Content End */}
            </div>

            {/* Success Modal Start*/}
            <div className={`modal fade ${successModal ? 'show d-block' : ''}`} >
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-success m-0 p-2">
                            <h6 className="modal-title text-white"> </h6>
                            <button type="button" className="btn-close" onClick={() => setSuccessModal()}></button>
                        </div>

                        <div className="modal-body m-0 pl-3 pr-3 pt-0">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="tx-center tx-50 tx-success">
                                        <i className="fal fa-check-circle"></i>
                                    </div>
                                    <h4 className="tx-success tx-uppercase tx-13 tx-center">{message}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-top p-2">
                            <button type="button" className="btn btn-sm btn-danger rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => setSuccessModal(false)}><i className="fal fa-times-circle"></i> {lang.close}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Success Modal End*/}

            {/* Warning Modal Start*/}
            <div className={`modal fade ${warningModal ? 'show d-block' : ''}`} >
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-danger m-0 p-2">
                            <h6 className="modal-title text-white"> </h6>
                            <button type="button" className="btn-close" onClick={() => setWarningModal()}></button>
                        </div>

                        <div className="modal-body m-0 pl-3 pr-3 pt-0">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="tx-center tx-50 tx-warning">
                                        <i className="fal fa-exclamation-circle"></i>
                                    </div>
                                    <h4 className="tx-danger tx-uppercase tx-13 tx-center">{message}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-top p-2">
                            <button type="button" className="btn btn-sm btn-danger rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => setWarningModal(false)}><i className="fal fa-times-circle"></i> {lang.close}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Warning Modal End*/}
        </Layout>
    );
}

export default DayClose;