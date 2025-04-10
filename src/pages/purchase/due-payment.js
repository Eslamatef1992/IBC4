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

const DuePayment = ()=> {
    let user_id, user_group, user_company, user_branch;
    if (typeof window !== 'undefined') {
        user_id      = localStorage.getItem('user_id');
        user_group      = localStorage.getItem('user_group');
        user_company    = localStorage.getItem('user_company');
        user_branch     = localStorage.getItem('user_branch');

        // user_group =1 Super Admin, user_group =2 Admin, user_group =3 Manager, user_group =4 Accounts User, user_group =5 Sales & Purchase, user_group =6 Sales, user_group =7 Purchase
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
    const [supplier_list, setSupplier_list]         = useState([]);
    const [purchase_due_list, setPurchase_due_list] = useState([]);
    const [coa_accounts_link, setCoa_accounts_link] = useState('');
    const [coa_accounts_link_id, setCoa_accounts_link_id] = useState('');
    const [payment_type_list, setPayment_type_list] = useState([]);
    const [payment_method_list, setPayment_method_list] = useState([]);

    const [company, setCompany]                     = useState(user_company || '');
    const [branch, setBranch]                       = useState(user_branch || '');
    const [supplier, setSupplier]                   = useState('');
    const [payment_date, setPayment_date]           = useState(new Date().toISOString().split('T')[0]);
    const [reference_number, setReference_number]   = useState('');
    const [payment_type, setPayment_type]           = useState('');
    const [payment_method, setPayment_method]       = useState('');
    const [payment_status, setPayment_status]       = useState(1);
    const [get_item, setGet_item]                   = useState('');
    const [purchase_id, setPurchase_id]             = useState(0);

    const total_payable_amount                      = purchase_due_list.reduce((payable_amount, data) => payable_amount + parseFloat((data.payable_amount)), 0);
    const total_paid_amount                         = purchase_due_list.reduce((paid_amount, data) => paid_amount + parseFloat((data.paid_amount)), 0);
    const total_due_amount                          = purchase_due_list.reduce((due_amount, data) => due_amount + parseFloat((data.due_amount)), 0);
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

    const supplierData = () => {
        const axios = apiUrl.get("/suppliers/supplier-list-active/"+company)
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setSupplier_list(result_data.data);
            } else {
                setSupplier_list([]);
            }
        }).catch((e) => console.log(e));
    };

    const editItem = (row) => {
        const items = {
            purchase_id         : row.purchase_id,
            purchase_date       : row.purchase_date,
            purchase_invoice    : row.purchase_invoice,
            payable_amount      : row.payable_amount,
            paid_amount         : row.paid_amount,
            due_amount          : row.due_amount,
            new_payment         : parseFloat(row.new_payment)
        };
        setGet_item(items);

        const updatedArray = purchase_due_list.map((data) =>
            data.purchase_id === row.purchase_id ? items : data
        );

        setPurchase_due_list(updatedArray);

        const total_new_amount = parseFloat(updatedArray.reduce((acc, item) => acc + item.new_payment, 0));
        setTotal_new_amount(total_new_amount);
    };

    const formSubmit = (e) => {
        e.preventDefault();
        setSubmitButton(true);
        const due_list = purchase_due_list.filter((data) => data.new_payment > 0);
        if(company <= 0) {
            setMassage('Select Company');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(branch <= 0) {
            setMassage('Select Branch');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(supplier <= 0) {
            setMassage('Select Supplier');
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
                supplier    : supplier,
                payment_date: payment_date
            };
            const purchase_data = due_list.map((row) => ({
                purchase_id                         : row.purchase_id,
                purchase_paid_amount                : parseFloat(row.paid_amount)+parseFloat(row.new_payment),
                purchase_due_amount                 : parseFloat(row.payable_amount)-(parseFloat(row.paid_amount)+parseFloat(row.new_payment)),
                purchase_reference_number           : reference_number,
                purchase_payment_type               : payment_type,
                purchase_payment_method             : payment_method,
                purchase_payment_status             : parseFloat(row.payable_amount)-(parseFloat(row.paid_amount)+parseFloat(row.new_payment)) > 0?'Due':'Paid',
            }));

            const supplier_payment_data = due_list.map((row) => ({
                supplier_payment_company            : company,
                supplier_payment_branch             : branch,
                supplier_payment_date               : payment_date,
                supplier_payment_purchase           : row.purchase_id,
                supplier_payment_purchase_invoice   : row.purchase_invoice,
                supplier_payment_supplier           : supplier,
                supplier_payment_payable            : row.due_amount,
                supplier_payment_paid               : row.new_payment,
                supplier_payment_due                : parseFloat(row.due_amount)-parseFloat(row.new_payment),
                supplier_payment_type               : 'Due',
                supplier_payment_purchase_reference_number  : reference_number,
                supplier_payment_purchase_payment_type      : payment_type,
                supplier_payment_purchase_payment_method    : payment_method,
                supplier_payment_status             : payment_status
            }));

            const axios = apiUrl.post("/purchase/due-payment-create/",{payment_data:payment_data, purchase_data:purchase_data, supplier_payment_data:supplier_payment_data})
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
                    setPurchase_due_list([]);
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

    const viewInvoice = (supplier, payment_date) => {
        window.open("/purchase/due-payment-invoice/?company="+company+"&branch="+branch+"&supplier="+supplier+"&payment_date="+payment_date, "Popup", "width=700, height=700");
    };

    const viewReceipt = (supplier, payment_date) => {
        window.open("/purchase/due-payment-receipt/?company="+company+"&branch="+branch+"&supplier="+supplier+"&payment_date="+payment_date, "Popup", "width=700, height=700");
    };

    const searchPurchaseDue = () => {
        if(company <= 0) {
            setMassage('Select Company');
            setWarningModal(true);
            setSearchButton(false);
        } else if(branch <= 0) {
            setMassage('Select Branch');
            setWarningModal(true);
        } else if(supplier <= 0) {
            setMassage('Select Supplier');
            setWarningModal(true);
            setSearchButton(false);
        } else {
            setSearchButton(true);
            const axios = apiUrl.get("/purchase/purchase-due-list/?company="+company+"&branch="+branch+"&supplier="+supplier);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    const purchase_data = result_data.data.map((row) => ({
                        purchase_id         : row.purchase_id,
                        purchase_date       : row.purchase_date,
                        purchase_invoice    : row.purchase_invoice,
                        payable_amount      : row.purchase_payable_amount,
                        paid_amount         : row.purchase_paid_amount,
                        due_amount          : row.purchase_due_amount,
                        new_payment         : 0
                    }));
                    setPurchase_due_list(purchase_data || []);
                    setSearchButton(false);
                } else {
                    setPurchase_due_list([]);
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
        supplierData();
        coaAccountsLinkData();
        paymentTypeData();
        paymentMethodData();
    }, [company, branch, coa_accounts_link_id, payment_type]);

    return (
        <Layout>
            <HeaderTitle title={lang.due_payment} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.due_payment}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/purchase">{lang.purchase}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.due_payment}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center d-print-none">
                            <Link className="btn btn-success rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.purchase_list} href="/purchase/purchase-list"><i className="fal fa-bars"></i></Link>
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
                                        <label className="form-label tx-semibold" htmlFor="supplier">{lang.supplier}</label>
                                        <select type="text" className="form-control bd-danger" id="supplier" name="supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} required>
                                            <option value="">{lang.select}</option>
                                            {supplier_list.map(supplier_row => (
                                            <option key={supplier_row.supplier_id} value={supplier_row.supplier_id}>{supplier_row.supplier_name}</option>
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
                                            <button type="submit" className={`btn btn-info pd-t-6-force pd-b-5-force mg-r-3 tx-uppercase ${searchButton?'disabled': ''}`} onClick={() => searchPurchaseDue()}>{searchButton?lang.process: lang.search}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {purchase_due_list.length > 0?
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead className="tx-12 tx-uppercase">
                                        <tr>
                                            <th className="tx-center">{lang.sn}</th>
                                            <th className="tx-center">{lang.date}</th>
                                            <th className="tx-center">{lang.invoice}</th>
                                            <th className="tx-center">{lang.purchase}</th>
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
                                        {purchase_due_list.map((row, index) => {
                                        return (
                                        <tr className='' key={row.purchase_id}>
                                            <td className="tx-center">{(index+1).toString().padStart(2, '0')}</td>
                                            <td className="tx-center">{new Date(row.purchase_date).toLocaleString('en-in', {day: '2-digit', month:'2-digit', year: 'numeric'})}</td>
                                            <td className="tx-center">{row.purchase_invoice}</td>
                                            <td className="tx-right"><AccountsNumberFormat amount={row.payable_amount}/></td>
                                            <td className="tx-right"><AccountsNumberFormat amount={row.paid_amount}/></td>
                                            <td className="tx-right"><AccountsNumberFormat amount={row.due_amount}/></td>
                                            <td className="tx-center">
                                                <input type="number" className="bd-info tx-center" style={{maxWidth:"100px"}} id="new_payment" name="new_payment" value={row.new_payment} onChange={(e) => editItem({
                                                    purchase_id         : row.purchase_id,
                                                    purchase_date       : row.purchase_date,
                                                    purchase_invoice    : row.purchase_invoice,
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

                            {purchase_due_list.length > 0?
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
                            <button type="button" className="btn btn-sm btn-primary rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => viewReceipt(supplier, payment_date)}><i className="fal fa-print"></i> {lang.receipt}</button>
                            <button type="button" className="btn btn-sm btn-info rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => viewInvoice(supplier, payment_date)}><i className="fal fa-print"></i> {lang.invoice}</button>

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

export default DuePayment;