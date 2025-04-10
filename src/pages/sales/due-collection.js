import {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout';

import HeaderTitle from '@/components/header-title';
import getTranslation from '@/languages';
import apiUrl from '@/components/api-url';
import apiUrlFormData from '@/components/api-url-form-data';
import { toast, ToastContainer } from 'react-toastify';
import router from 'next/router';
import AccountsNumberFormat from '@/components/accounts-number-format';

const DueCollection = ()=> {
    let user_id, user_group, user_company, user_branch;
    if (typeof window !== 'undefined') {
        user_id      = localStorage.getItem('user_id');
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

    const [searchButton, setSearchButton]           = useState(false);
    const [submitButton, setSubmitButton]           = useState(false);
    const [warningModal, setWarningModal]           = useState(false);
    const [successModal, setSuccessModal]           = useState(false);
    const [message, setMassage]                     = useState('');

    const [company_list, setCompany_list]           = useState([]);
    const [branch_list, setBranch_list]             = useState([]);
    const [customer_list, setCustomer_list]         = useState([]);
    const [sales_due_list, setSales_due_list]       = useState([]);
    const [coa_accounts_link, setCoa_accounts_link] = useState('');
    const [coa_accounts_link_id, setCoa_accounts_link_id] = useState('');
    const [payment_type_list, setPayment_type_list] = useState([]);
    const [payment_method_list, setPayment_method_list] = useState([]);

    const [company, setCompany]                     = useState(user_company || '');
    const [branch, setBranch]                       = useState(user_branch || '');
    const [customer, setCustomer]                   = useState('');
    const [payment_date, setPayment_date]           = useState(new Date().toISOString().split('T')[0]);
    const [reference_number, setReference_number]   = useState('');
    const [payment_type, setPayment_type]           = useState('');
    const [payment_method, setPayment_method]       = useState('');
    const [payment_status, setPayment_status]       = useState(1);
    const [get_item, setGet_item]                   = useState('');
    const [sales_id, setSales_id]                   = useState(0);

    const total_payable_amount                      = sales_due_list.reduce((payable_amount, data) => payable_amount + parseFloat((data.payable_amount)), 0);
    const total_paid_amount                         = sales_due_list.reduce((paid_amount, data) => paid_amount + parseFloat((data.paid_amount)), 0);
    const total_due_amount                          = sales_due_list.reduce((due_amount, data) => due_amount + parseFloat((data.due_amount)), 0);
    const [total_new_amount, setTotal_new_amount]   = useState(0);

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
    };

    const branchData = () => {
        const axios = apiUrl.get("/branch/branch-list-active/"+company)
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setBranch_list(result_data.data);
            } else {
                setBranch_list([]);
            }
        }).catch((e) => console.log(e));
    };

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
    };

    const editItem = (row) => {
        const items = {
            sales_id            : row.sales_id,
            sales_date          : row.sales_date,
            sales_invoice       : row.sales_invoice,
            payable_amount      : row.payable_amount,
            paid_amount         : row.paid_amount,
            due_amount          : row.due_amount,
            new_payment         : parseFloat(row.new_payment)
        };
        setGet_item(items);

        const updatedArray = sales_due_list.map((data) =>
            data.sales_id === row.sales_id ? items : data
        );

        setSales_due_list(updatedArray);

        const total_new_amount = parseFloat(updatedArray.reduce((acc, item) => acc + item.new_payment, 0));
        setTotal_new_amount(total_new_amount);
    };

    const formSubmit = (e) => {
        e.preventDefault();
        setSubmitButton(true);
        const due_list = sales_due_list.filter((data) => data.new_payment > 0);
        if(company <= 0) {
            setMassage('Select Company');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(branch <= 0) {
            setMassage('Select Branch');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(customer <= 0) {
            setMassage('Select Customer');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(payment_date.length <= 0) {
            setMassage('Choose Date');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(due_list.length == 0) {
            setMassage('Enter New Payment');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(total_new_amount <=0) {
            setMassage('Enter New Payment');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(total_new_amount >0 && payment_type <= 0) {
            setMassage('Select Payment Type');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(total_new_amount >0 && payment_method <= 0) {
            setMassage('Select Payment Method');
            setWarningModal(true);
            setSubmitButton(false);
        } else {
            const payment_data = {
                company     : company,
                branch      : branch,
                customer    : customer,
                payment_date: payment_date
            };
            const sales_data = due_list.map((row) => ({
                sales_id                         : row.sales_id,
                sales_paid_amount                : parseFloat(row.paid_amount)+parseFloat(row.new_payment),
                sales_due_amount                 : parseFloat(row.payable_amount)-(parseFloat(row.paid_amount)+parseFloat(row.new_payment)),
                sales_reference_number           : reference_number,
                sales_payment_type               : payment_type,
                sales_payment_method             : payment_method,
                sales_payment_status             : parseFloat(row.payable_amount)-(parseFloat(row.paid_amount)+parseFloat(row.new_payment)) > 0?'Due':'Paid',
            }));

            const customer_payment_data = due_list.map((row) => ({
                customer_payment_company                : company,
                customer_payment_branch                 : branch,
                customer_payment_date                   : payment_date,
                customer_payment_sales                  : row.sales_id,
                customer_payment_sales_invoice          : row.sales_invoice,
                customer_payment_customer               : customer,
                customer_payment_payable                : row.due_amount,
                customer_payment_paid                   : row.new_payment,
                customer_payment_due                    : parseFloat(row.due_amount)-parseFloat(row.new_payment),
                customer_payment_type                   : 'Due',
                customer_payment_sales_reference_number : reference_number,
                customer_payment_sales_payment_type     : payment_type,
                customer_payment_sales_payment_method   : payment_method,
                customer_payment_status                 : payment_status
            }));

            const axios = apiUrl.post("/sales/due-collection-create/",{payment_data:payment_data, sales_data:sales_data, customer_payment_data:customer_payment_data})
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setMassage(result_data.message);
                    setSuccessModal(true);
                    setSubmitButton(false);
                    setReference_number('');
                    setPayment_type('');
                    setPayment_method('');
                    setPayment_date(new Date().toISOString().split('T')[0]);
                    setSales_due_list([]);
                    setTotal_new_amount(0);
                } else {
                    setMassage(result_data.message);
                    setWarningModal(true);
                    setSubmitButton(false);
                }
            }).catch((e) => {
                setSubmitButton(false);
                console.log(e)
            });
        }
    };

    const viewInvoice = (customer, payment_date) => {
        window.open("/sales/due-collection-invoice/?company="+company+"&branch="+branch+"&customer="+customer+"&payment_date="+payment_date, "Popup", "width=700, height=700");
    };

    const viewReceipt = (data) => {
        window.open("/sales/due-collection-receipt/?company="+company+"&branch="+branch+"&customer="+customer+"&payment_date="+payment_date, "Popup", "width=700, height=700");
    };
    
    const searchSalesDue = () => {
        if(company <= 0) {
            setMassage('Select Company');
            setWarningModal(true);
            setSearchButton(false);
        } else if(branch <= 0) {
            setMassage('Select Branch');
            setWarningModal(true);
        } else if(customer <= 0) {
            setMassage('Select Customer');
            setWarningModal(true);
            setSearchButton(false);
        } else {
            setSearchButton(true);
            const axios = apiUrl.get("/sales/sales-due-list/?company="+company+"&branch="+branch+"&customer="+customer);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    const sales_data = result_data.data.map((row) => ({
                        sales_id            : row.sales_id,
                        sales_date          : row.sales_date,
                        sales_invoice       : row.sales_invoice,
                        payable_amount      : row.sales_payable_amount,
                        paid_amount         : row.sales_paid_amount,
                        due_amount          : row.sales_due_amount,
                        new_payment         : 0
                    }));
                    setSales_due_list(sales_data || []);
                    setSearchButton(false);
                } else {
                    setSales_due_list([]);
                    setSearchButton(false);
                }
            }).catch((e) => console.log(e));
        }
    };

    const coaAccountsLinkData = () => {
        const axios = apiUrl.get("/chart-of-accounts/get-chart-of-accounts-accounts-link/?company="+company+"&accounts_link=cash_in_hand_bank");
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setCoa_accounts_link(result_data.data);
                setCoa_accounts_link_id(result_data.data.chart_of_accounts_id);
            } else {
                setCoa_accounts_link('');
                setCoa_accounts_link_id('');
            }
        }).catch((e) => console.log(e));
    }

    const paymentTypeData = () => {
        const axios = apiUrl.get("/chart-of-accounts/get-chart-of-accounts-category/?company="+company+"&category="+coa_accounts_link_id);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setPayment_type_list(result_data.data);
            } else {
                setPayment_type_list([]);
            }
        }).catch((e) => console.log(e));
    }

    const paymentMethodData = () => {
        const axios = apiUrl.get("/chart-of-accounts/get-chart-of-accounts-category/?company="+company+"&category="+payment_type);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setPayment_method_list(result_data.data);
            } else {
                setPayment_method_list([]);
            }
        }).catch((e) => console.log(e));
    }

    useEffect(() => {
        companyData();
        branchData();
        customerData();
        coaAccountsLinkData();
        paymentTypeData();
        paymentMethodData();
    }, [company, branch, coa_accounts_link_id, payment_type]);

    return (
        <Layout>
            <HeaderTitle title={lang.due_collection} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.due_collection}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/sales">{lang.sales}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.due_collection}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center d-print-none">
                            <Link className="btn btn-success rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.sales_list} href="/sales/sales-list"><i className="fal fa-bars"></i></Link>
                        </div>
                    </div>
                </div>
                {/* Breadcrumb End */}

                {/* Content Start */}
                <div className="row">
                    <div className="row justify-content-center">
                        <div className="col-md-12 col-sm-12 mb-3">
                            <div className="row mb-3 d-print-none">
                                <div className="col-lg-3 col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="company">{lang.company}</label>
                                        <select type="text" className="form-control bd-danger" id="company" name="company" value={company} onChange={(e) => setCompany(e.target.value)} required>
                                            <option value="">{lang.select}</option>
                                            {company_list.map(company_row => (
                                            <option key={company_row.company_id} value={company_row.company_id}>{company_row.company_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="branch">{lang.project}</label>
                                        <select type="text" className="form-control bd-danger" id="branch" name="branch" value={branch} onChange={(e) => setBranch(e.target.value)} required>
                                            <option value="">{lang.select}</option>
                                            {branch_list.map(branch_row => (
                                            <option key={branch_row.branch_id} value={branch_row.branch_id}>{branch_row.branch_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="customer">{lang.customer}</label>
                                        <select type="text" className="form-control bd-danger" id="customer" name="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} required>
                                            <option value="">{lang.select}</option>
                                            {customer_list.map(customer_row => (
                                            <option key={customer_row.customer_id} value={customer_row.customer_id}>{customer_row.customer_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="payment_date">{lang.payment_date}</label>
                                        <input type="date" className="form-control bd-danger" id="payment_date" name="payment_date" value={payment_date} onChange={(e) => setPayment_date(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-uppercase tx-semibold" htmlFor="search">&nbsp;</label>
                                        <div className="d-grid gap-2">
                                            <button type="submit" className={`btn btn-info pd-t-6-force pd-b-5-force mg-r-3 tx-uppercase ${searchButton?'disabled': ''}`} onClick={() => searchSalesDue()}>{searchButton?lang.process: lang.search}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {sales_due_list.length > 0?
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead className="tx-12 tx-uppercase">
                                        <tr>
                                            <th className="tx-center">{lang.sn}</th>
                                            <th className="tx-center">{lang.date}</th>
                                            <th className="tx-center">{lang.invoice}</th>
                                            <th className="tx-center">{lang.sales}</th>
                                            <th className="tx-center">{lang.paid}</th>
                                            <th className="tx-center">{lang.due}</th>
                                            <th className="tx-center">{lang.new_payment}</th>
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
                                        {sales_due_list.map((row, index) => {
                                        return (
                                        <tr className='' key={row.sales_id}>
                                            <td className="tx-center">{(index+1).toString().padStart(2, '0')}</td>
                                            <td className="tx-center">{new Date(row.sales_date).toLocaleString('en-in', {day: '2-digit', month:'2-digit', year: 'numeric'})}</td>
                                            <td className="tx-center">{row.sales_invoice}</td>
                                            <td className="tx-right"><AccountsNumberFormat amount={row.payable_amount}/></td>
                                            <td className="tx-right"><AccountsNumberFormat amount={row.paid_amount}/></td>
                                            <td className="tx-right"><AccountsNumberFormat amount={row.due_amount}/></td>
                                            <td className="tx-center">
                                                <input type="number" className="bd-info tx-center" style={{maxWidth:"100px"}} id="new_payment" name="new_payment" value={row.new_payment} onChange={(e) => editItem({
                                                    sales_id         : row.sales_id,
                                                    sales_date       : row.sales_date,
                                                    sales_invoice    : row.sales_invoice,
                                                    payable_amount      : row.payable_amount,
                                                    paid_amount         : row.paid_amount,
                                                    due_amount          : row.due_amount,
                                                    new_payment         : e.target.value
                                                })} />
                                            </td>
                                        </tr>
                                        )})}
                                        <tr>
                                            <th className="tx-right tx-uppercase" colSpan={3}>{lang.total}</th>
                                            <th className="tx-right"><AccountsNumberFormat amount={total_payable_amount} /></th>
                                            <th className="tx-right"><AccountsNumberFormat amount={total_paid_amount} /></th>
                                            <th className="tx-right"><AccountsNumberFormat amount={total_due_amount} /></th>
                                            <th className="tx-center"><AccountsNumberFormat amount={total_new_amount} /></th>
                                        </tr>
                                    </tbody>
                                    }
                                </table>
                            </div>
                            :''}

                            {sales_due_list.length > 0?
                            <div className="row mb-5">
                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="reference_number">{lang.reference_number}</label>
                                        <input type="text" className="form-control bd-info" id="reference_number" name="reference_number" value={reference_number} onChange={(e) => setReference_number(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="payment_type">{lang.payment_type}</label>
                                        <select type="text" className="form-control bd-danger" id="payment_type" name="payment_type" value={payment_type} onChange={(e) => setPayment_type(e.target.value)} >
                                            <option value="">{lang.select}</option>
                                            {payment_type_list.map(row => (
                                            <option key={row.chart_of_accounts_id} value={row.chart_of_accounts_id}>{row.chart_of_accounts_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="payment_method">{lang.payment_method}</label>
                                        <select type="text" className="form-control bd-danger" id="payment_method" name="payment_method" value={payment_method} onChange={(e) => setPayment_method(e.target.value)} >
                                            <option value="">{lang.select}</option>
                                            {payment_method_list.map(row => (
                                            <option key={row.chart_of_accounts_id} value={row.chart_of_accounts_id}>{row.chart_of_accounts_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="submit">&nbsp;</label>
                                        <div className="d-grid gap-2">
                                            <button type="submit" className={`btn btn-success pd-t-6-force pd-b-5-force mg-r-3 tx-uppercase ${submitButton?'disabled': ''}`} onClick={(e) => formSubmit(e)}>{submitButton?lang.process: lang.save}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : ''}
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
                            <button type="button" className="btn-close" onClick={() => setSuccessModal(false)}></button>
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
                            <button type="button" className="btn btn-sm btn-primary rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => viewReceipt(customer, payment_date)}><i className="fal fa-print"></i> {lang.receipt}</button>
                            <button type="button" className="btn btn-sm btn-info rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => viewInvoice(customer, payment_date)}><i className="fal fa-print"></i> {lang.invoice}</button>

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
                            <button type="button" className="btn-close" onClick={() => setWarningModal(false)}></button>
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
            <ToastContainer />
        </Layout>
    );
}

export default DueCollection;