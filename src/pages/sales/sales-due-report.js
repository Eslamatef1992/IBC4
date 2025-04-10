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

const SalesDueReport = ()=> {
    let user_id, user_group, user_company, user_branch;
    if (typeof window !== 'undefined') {
        user_id         = localStorage.getItem('user_id');
        user_group      = localStorage.getItem('user_group');
        user_company    = localStorage.getItem('user_company');
        user_branch     = localStorage.getItem('user_branch');

        // user_group =1 Super Admin, user_group =2 Admin, user_group =3 Manager, user_group =4 Accounts User, user_group =5 Sales & Sales, user_group =6 Sales, user_group =7 Sales
        if(user_group == 1 || user_group == 2 || user_group == 3 || user_group == 3 || user_group == 4 || user_group == 5 || user_group == 6 || user_group == 7) { } else {
            router.replace('/logout');
            return true;
        }
    }

    const lang = getTranslation();

    const [searchButton, setSearchButton]               = useState(false);
    
    const [company_list, setCompany_list]               = useState([]);
    const [branch_list, setBranch_list]                 = useState([]);
    const [customer_list, setCustomer_list]             = useState([]);
    const status_list = [
        {
            status_id:1,
            status_code: 'A',
            status_name: 'Active'
        },
        {
            status_id:0,
            status_code: 'I',
            status_name: 'Inactive'
        }
    ];
    const [sales_due_report, setSales_due_report] = useState([]);
    const total_sales_amount = sales_due_report.reduce((amount, data) => amount + parseFloat((data.sales_payable_amount)), 0);
    const total_paid_amount     = sales_due_report.reduce((amount, data) => amount + parseFloat((data.sales_paid_amount)), 0);
    const total_due_amount      = sales_due_report.reduce((amount, data) => amount + parseFloat((data.sales_due_amount)), 0);

    const [company_info, setCompany_info]               = useState('');
    const [branch_info, setBranch_info]                 = useState('');
    const [customer_info, setCustomer_info]             = useState('');
    const [company, setCompany]                         = useState(user_company || '');
    const [branch, setBranch]                           = useState(user_branch || '');
    const [customer, setCustomer]                       = useState('all');
    const [from_date, setFrom_date]                     = useState(new Date().toISOString().split('T')[0]);
    const [to_date, setTo_date]                         = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus]                           = useState(1);

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
    const customerData = () => {
        const axios = apiUrl.get("/customers/customer-list-active/"+company)
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setCustomer_list(result_data.data);
            } else {
                setCustomer_list([]);
            }
        }).catch((e) => console.log(e));
    }

    const searchSalesDueReport = () => {
        setSearchButton(true);
        const axios = apiUrl.get("/sales/sales-due-report/?company="+company+"&branch="+branch+"&customer="+customer+"&from_date="+from_date+"&to_date="+to_date+"&status="+status);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setSales_due_report(result_data.data);
                setCompany_info(result_data.company);
                setBranch_info(result_data.branch);
                setCustomer_info(result_data.customer);
                setSearchButton(false);
            } else {
                setSales_due_report([]);
                setCompany_info('');
                setBranch_info('');
                setCustomer_info('');
                setSearchButton(false);
            }
        }).catch((e) => console.log(e));
    }

    useEffect(() => {
        companyData();
        branchData();
        customerData();
    }, [company]);

    return (
        
        <Layout>
            <style>
            
        </style>
            <HeaderTitle title={lang.sales_due_report} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5 d-print-none">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.sales_due_report}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/sales">{lang.sales}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.sales_due_report}</span>
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
                        <div className="row clearfix d-print-none">
                            <div className="col-md-4 mt-3">
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
                            
                            <div className="col-md-4 col-sm-12 mt-3">
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
                            <div className="col-lg-4 col-md-6 col-sm-12 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="customer">{lang.customer}</label>
                                    <select type="text" className="form-control bd-info" id="customer" name="customer" value={customer} onChange={(e) => setCustomer(e.target.value)}>
                                        <option value="all">All</option>
                                        {customer_list.map(customer_row => (
                                        <option key={customer_row.customer_id} value={customer_row.customer_id}>{customer_row.customer_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row clearfix mb-3 d-print-none">
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="from_date">{lang.from_date}</label>
                                    <input type="date" className="form-control bd-info" id="from_date" name="from_date" value={from_date} onChange={(e) => setFrom_date(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="to_date">{lang.to_date}</label>
                                    <input type="date" className="form-control bd-info" id="search" name="to_date" value={to_date} onChange={(e) => setTo_date(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-md-2 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="status">{lang.status}</label>
                                    <select type="text" className="form-control bd-info" id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        {status_list.map(status_row => (
                                        <option key={status_row.status_id} value={status_row.status_id}>{status_row.status_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-2 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-uppercase tx-semibold" htmlFor="search">&nbsp;</label>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className={`btn btn-success pd-t-6-force pd-b-5-force mg-r-3 tx-uppercase ${searchButton?'disabled': ''}`} onClick={() => searchSalesDueReport()}>{searchButton?lang.process: lang.search}</button>
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
                                                <span className='tx-uppercase tx-16 text-decoration-underline'>{lang.sales_due_report}</span>
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
                                        <tr className="">
                                            <th className="tx-left" colSpan="3" valign="top">
                                                {lang.customer}: {customer_info.customer_name}<br/>
                                                {lang.status}: {status==1?lang.active:lang.inactive}
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
                            {sales_due_report.length > 0 ?
                            <>
                            <table className="table table-striped table-bordered" width="100%">
                                <thead className="tx-12 tx-uppercase">
                                    <tr>
                                        <th className="tx-center">{lang.sn}</th>
                                        <th className="tx-center">{lang.date}</th>
                                        <th className="tx-center">{lang.invoice}</th>
                                        <th className="tx-center">{lang.customer}</th>
                                        <th className="tx-center">{lang.sales}</th>
                                        <th className="tx-center">{lang.paid}</th>
                                        <th className="tx-center">{lang.due}</th>
                                    </tr>
                                </thead>
                                {searchButton?
                                <tbody>
                                    <tr className=''>
                                        <th className="tx-center d-print-none" colSpan={15}>
                                            <Image src="/assets/images/loading/loader.gif" alt="Loading" width={40} height={40} />
                                        </th>
                                    </tr>
                                </tbody>
                                :
                                <tbody>
                                    {sales_due_report.map((row, index) => {
                                    return (
                                    <tr className='' key={row.sales_id}>
                                        <td className="tx-center">{(index+1).toString().padStart(2, '0')}</td>
                                        <td className="tx-center">{new Date(row.sales_date).toLocaleString('en-in', {day: '2-digit', month:'2-digit', year: 'numeric'})}</td>
                                        <td className="tx-center">{row.sales_invoice}</td>
                                        <td className="tx-left">{row.sales_customer_name}</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={row.sales_payable_amount}/></td>
                                        <td className="tx-right"><AccountsNumberFormat amount={row.sales_paid_amount}/></td>
                                        <td className="tx-right"><AccountsNumberFormat amount={row.sales_due_amount}/></td>
                                    </tr>
                                    )})}
                                    <tr className="">
                                        <th className="tx-right text-uppercase" colSpan={4}>{lang.total}</th>
                                        <th className="tx-right"><AccountsNumberFormat amount={total_sales_amount} /></th>
                                        <th className="tx-right"><AccountsNumberFormat amount={total_paid_amount} /></th>
                                        <th className="tx-right"><AccountsNumberFormat amount={total_due_amount} /></th>
                                    </tr>
                                </tbody>
                                }
                            </table>
                            <br/><br/><br/><br/>
                            <table className="" width="100%" align="center">
                                <tbody>
                                    <tr className="text-uppercase">
                                        <th width="20%" className="tx-center"></th>
                                        <th width="20%"></th>
                                        <th width="20%" className="tx-center"></th>
                                        <th width="20%"></th>
                                        <th width="20%" className="tx-center bd-top">{lang.prepared_by}</th>
                                    </tr>
                                </tbody>
                            </table>
                            </>
                            : ''}
                            </>
                            }
                        </div>
                    </div>
                </div>
                {/* Content End */}
            </div>
        </Layout>
    );
}

export default SalesDueReport;