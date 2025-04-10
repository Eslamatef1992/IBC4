import {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import Layout from '@/components/layout';

import HeaderTitle from '@/components/header-title';
import getTranslation from '@/languages';
import apiUrl from '@/components/api-url';
import apiUrlFormData from '@/components/api-url-form-data';
import { toast, ToastContainer } from 'react-toastify';
import router from 'next/router';
import AccountsNumberFormat from '@/components/accounts-number-format';

const SalesReturnUpdate = ({data})=> {
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

    const [submitButton, setSubmitButton]           = useState(false);
    const [warningModal, setWarningModal]           = useState(false);
    const [successModal, setSuccessModal]           = useState(false);
    const [showItemEditModel, setShowItemEditModel] = useState(false);
    const [message, setMassage]                     = useState('');

    const [company_list, setCompany_list]           = useState([]);
    const [branch_list, setBranch_list]             = useState([]);
    const [warehouse_list, setWarehouse_list]       = useState([]);
    const [customer_list, setCustomer_list]         = useState([]);
    const [sales_return_list, setSales_return_list] = useState([]);
    const [item_list, setItem_list]                 = useState([]);
    const [coa_accounts_link, setCoa_accounts_link] = useState('');
    const [coa_accounts_link_id, setCoa_accounts_link_id] = useState('');
    const [payment_type_list, setPayment_type_list] = useState([]);
    const [payment_method_list, setPayment_method_list] = useState([]);
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
    const [product_search, setProduct_search]       = useState("");
    const [invoice, setInvoice]       = useState("");

    const [company, setCompany]                                       = useState(user_company || '');
    const [branch, setBranch]                                         = useState(user_branch || '');
    const [warehouse, setWarehouse]                                   = useState('');
    const [customer, setCustomer]                                     = useState('');
    const [sales_date, setSales_date]                           = useState(new Date().toISOString().split('T')[0]);
    const [sales_return_date, setSales_return_date]             = useState(new Date().toISOString().split('T')[0]);

    const [sales_return_previous_total_amount, setSales_return_previous_total_amount]           = useState(0);
    const [sales_return_previous_adjustment_amount, setSales_return_previous_adjustment_amount] = useState(0);
    const [sales_return_previous_payable_amount, setSales_return_previous_payable_amount]       = useState(0);
    const [sales_return_previous_paid_amount, setSales_return_previous_paid_amount]             = useState(0);
    const [sales_return_previous_due_amount, setSales_return_previous_due_amount]               = useState(0);

    const [sales_total_amount, setSales_total_amount]                         = useState(0);
    const [sales_return_total_amount, setSales_return_total_amount]           = useState(0);
    const [sales_return_adjustment_amount, setSales_return_adjustment_amount] = useState(0);
    const [sales_return_payable_amount, setSales_return_payable_amount]       = useState(0);
    const [sales_return_paid_amount, setSales_return_paid_amount]             = useState(0);
    const [sales_return_due_amount, setSales_return_due_amount]               = useState(0);
    const [sales_return_reference_number, setSales_return_reference_number]   = useState('');
    const [sales_return_payment_type, setSales_return_payment_type]           = useState('');
    const [sales_return_payment_method, setSales_return_payment_method]       = useState('');
    const [sales_return_status, setSales_return_status]                       = useState(1);
    const [get_item, setGet_item]                                                   = useState('');
    const [sales_return_id, setSales_return_id]                               = useState(0);
    const [sales_id, setSales_id]                                             = useState('');
    const [sales_invoice, setSales_invoice]                                   = useState('');

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
        const axios = apiUrl.get("/branch/branch-list-active/"+company)
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setBranch_list(result_data.data);
            } else {
                setBranch_list([]);
            }
        }).catch((e) => console.log(e));
    }

    const warehouseData = () => {
        const axios = apiUrl.get("/warehouse/warehouse-list-active/?company="+company+"&branch="+branch)
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setWarehouse_list(result_data.data);
            } else {
                setWarehouse_list([]);
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

    const returnData = (e) => {
        if(product_search.length > 0) {
            const axios = apiUrl.get("/product/product-return-search/?company="+company+"&search="+product_search);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setSales_return_list(result_data.data);
                } else {
                    setSales_return_list([]);
                }
            }).catch((e) => console.log(e));
        } else {
            return false;
        }
    }

    const editCartItem = (product_data) => {
        const return_amount     = parseFloat(product_data.return_price)*parseFloat(product_data.return_quantity);

        const items = {
            product_id          : product_data.product_id,
            product_code        : product_data.product_code,
            product_name        : product_data.product_name,
            product_unit        : product_data.product_unit,
            sales_price      : product_data.sales_price || 0,
            sales_quantity   : product_data.sales_quantity || 0,
            sales_amount     : product_data.sales_amount || 0,
            return_price        : product_data.return_price || 0,
            previous_return_quantity: product_data.previous_return_quantity,
            return_quantity     : product_data.return_quantity,
            return_amount       : return_amount || 0
        };
        setGet_item(items);

        const updatedArray = item_list.map((data) =>
            data.product_id === product_data.product_id ? items : data
        );

        setItem_list(updatedArray);
        const sales_return_total_amount = parseFloat(updatedArray.reduce((acc, item) => acc + item.return_amount, 0));
        setSales_return_total_amount(sales_return_total_amount);

        setSales_return_adjustment_amount(0);
        setSales_return_payable_amount(sales_return_total_amount);
        setSales_return_paid_amount(sales_return_paid_amount);
        setSales_return_due_amount(sales_return_total_amount-parseFloat(sales_return_paid_amount));
    };

    const totalEditAmount = (data) => {
        const adjustment_amount = data.sales_return_adjustment_amount;
        const payable_amount    = parseFloat(sales_return_total_amount)-parseFloat(adjustment_amount);
        const paid_amount       = data.sales_return_paid_amount;
        const due_amount        = parseFloat(payable_amount)-parseFloat(paid_amount);

        setSales_return_adjustment_amount(adjustment_amount);
        setSales_return_payable_amount(payable_amount);
        setSales_return_paid_amount(payable_amount>paid_amount?paid_amount:payable_amount);
        setSales_return_due_amount(payable_amount > paid_amount?due_amount:0);
    };

    const formSubmit = (e) => {
        e.preventDefault();
        setSubmitButton(true);

        const item_return_list = item_list.filter((data) => data.return_quantity > 0);

        if(company <= 0) {
            setMassage('Select Company');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(branch <= 0) {
            setMassage('Select Branch');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(item_return_list.length == 0) {
            setMassage('Select Product');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(sales_return_paid_amount >0 && sales_return_payment_type <= 0) {
            setMassage('Select Payment Type');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(sales_return_paid_amount >0 && sales_return_payment_method <= 0) {
            setMassage('Select Payment Method');
            setWarningModal(true);
            setSubmitButton(false);
        } else {
            const sales_return_data = {
                sales_return_company             : company,
                sales_return_branch              : branch,
                sales_return_customer            : customer,
                sales_return_warehouse           : warehouse,
                sales_return_sales            : sales_id,
                sales_return_sales_invoice    : sales_invoice,
                sales_return_sales_date       : sales_date,
                sales_return_date                : sales_return_date,
                sales_return_total_amount        : sales_return_total_amount,
                sales_return_adjustment_amount   : sales_return_adjustment_amount,
                sales_return_payable_amount      : sales_return_payable_amount,
                sales_return_paid_amount         : sales_return_paid_amount,
                sales_return_due_amount          : sales_return_due_amount,
                sales_return_previous_total_amount   : sales_return_previous_total_amount,
                sales_return_previous_adjustment_amount: sales_return_previous_adjustment_amount,
                sales_return_previous_payable_amount : sales_return_previous_payable_amount,
                sales_return_previous_paid_amount    : sales_return_previous_paid_amount,
                sales_return_previous_due_amount     : sales_return_previous_due_amount,
                sales_return_reference_number    : sales_return_reference_number,
                sales_return_payment_type        : sales_return_payment_type,
                sales_return_payment_method      : sales_return_payment_method,
                sales_return_payment_status      : sales_return_due_amount > 0 ? 'Due' : 'Paid',
                sales_return_status              : sales_return_status
            }

            const sales_return_details_data = item_return_list.map((row) => ({
                sales_return_details_company             : company,
                sales_return_details_branch              : branch,
                sales_return_details_customer            : customer,
                sales_return_details_warehouse           : warehouse,
                sales_return_details_sales            : sales_id,
                sales_return_details_sales_invoice    : sales_invoice,
                sales_return_details_sales_date       : sales_date,
                sales_return_details_sales_return     : sales_return_id,
                sales_return_details_return_date         : sales_return_date,
                sales_return_details_product             : row.product_id,
                sales_return_details_product_code        : row.product_code,
                sales_return_details_product_name        : row.product_name,
                sales_return_details_product_unit        : row.product_unit,
                sales_return_details_sales_price      : row.sales_price,
                sales_return_details_sales_quantity   : row.sales_quantity,
                sales_return_details_sales_amount     : row.sales_amount,
                sales_return_details_previous_return_quantity : row.previous_return_quantity,
                sales_return_details_return_price        : row.return_price,
                sales_return_details_return_quantity     : row.return_quantity,
                sales_return_details_return_amount       : row.return_amount,
                sales_return_details_status              : sales_return_status,
            }));

            const axios = apiUrl.put("/sales/sales-return-update/"+data,{sales_return_data:sales_return_data, sales_return_details_data:sales_return_details_data})
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setMassage(result_data.message);
                    setSuccessModal(true);
                    setSubmitButton(false);
                    setSales_return_id(result_data.data.sales_return_id);
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
    }

    const viewInvoice = (data) => {
        window.open("/sales/sales-return-invoice/"+data, "Popup", "width=700, height=700");
    }

    const viewReceipt = (data) => {
        window.open("/sales/sales-return-receipt/"+data, "Popup", "width=700, height=700");
    }

    const salesReturnData = () => {
        const axios = apiUrl.get("/sales/get-sales-return/"+data);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setSales_return_id(result_data.data.sales_return_id);
                setCompany(result_data.data.sales_return_company);
                setBranch(result_data.data.sales_return_branch);
                setWarehouse(result_data.data.sales_return_warehouse);
                setCustomer(result_data.data.sales_return_customer);
                setSales_date(result_data.data.sales_return_sales_date);
                setSales_id(result_data.data.sales_return_sales);
                setSales_invoice(result_data.data.sales_return_sales_invoice);
                setSales_return_date(result_data.data.sales_return_date);

                setSales_return_previous_total_amount(result_data.data.sales_return_total_amount);
                setSales_return_previous_adjustment_amount(result_data.data.sales_return_adjustment_amount);
                setSales_return_previous_payable_amount(result_data.data.sales_return_payable_amount);
                setSales_return_previous_paid_amount(result_data.data.sales_return_paid_amount);
                setSales_return_previous_due_amount(result_data.data.sales_return_due_amount);

                setSales_return_total_amount(result_data.data.sales_return_total_amount);
                setSales_return_adjustment_amount(result_data.data.sales_return_adjustment_amount);
                setSales_return_payable_amount(result_data.data.sales_return_payable_amount);
                setSales_return_paid_amount(result_data.data.sales_return_paid_amount);
                setSales_return_due_amount(result_data.data.sales_return_due_amount);
                setSales_return_reference_number(result_data.data.sales_return_reference_number);
                setSales_return_payment_type(result_data.data.sales_return_payment_type);
                setSales_return_payment_method(result_data.data.sales_return_payment_method);
                const sales_return_details_data = result_data.data.sales_return_details.map((row) => ({
                    product_id          : row.sales_return_details_product,
                    product_code        : row.sales_return_details_product_code,
                    product_name        : row.sales_return_details_product_name,
                    product_unit        : row.sales_return_details_product_unit,
                    sales_price      : parseFloat(row.sales_return_details_sales_price) || 0,
                    sales_quantity   : parseFloat(row.sales_return_details_sales_quantity) || 0,
                    sales_amount     : parseFloat(row.sales_return_details_sales_amount) || 0,
                    return_price        : parseFloat(row.sales_return_details_return_price) || 0,
                    previous_return_quantity: parseFloat(row.sales_return_details_return_quantity) || 0,
                    return_quantity     : parseFloat(row.sales_return_details_return_quantity) || 0,
                    return_amount       : parseFloat(row.sales_return_details_return_amount) || 0,
                }));
                setSales_total_amount(parseFloat(sales_return_details_data.reduce((acc, item) => acc + item.sales_amount, 0)));
                setItem_list(sales_return_details_data || []);
            } else {
                setSales_return_id('');
                setCompany('');
                setBranch('');
                setWarehouse('');
                setCustomer('');
                setSales_date('');
                setSales_id('');
                setSales_invoice('');
                setSales_return_date('');
                setSales_total_amount('');
                setSales_return_total_amount('');
                setSales_return_adjustment_amount('');
                setSales_return_payable_amount('');
                setSales_return_paid_amount('');
                setSales_return_due_amount('');
                setSales_return_reference_number('');
                setSales_return_payment_type('');
                setSales_return_payment_method('');
                setItem_list([]);
            }
        }).catch((e) => console.log(e));
    }

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
        const axios = apiUrl.get("/chart-of-accounts/get-chart-of-accounts-category/?company="+company+"&category="+sales_return_payment_type);
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
        salesReturnData();
    }, []);

    useEffect(() => {
        companyData();
        branchData();
        warehouseData();
        customerData();
        returnData();
        coaAccountsLinkData();
        paymentTypeData();
        paymentMethodData();
    }, [company, branch, product_search, coa_accounts_link_id, sales_return_payment_type]);

    return (
        <Layout>
            <HeaderTitle title={lang.sales_return_edit} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.sales_return_edit}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/sales">{lang.sales}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.sales_return_edit}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center d-print-none">
                            <Link className="btn btn-success rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.sales_return_list} href="/sales/sales-return-list"><i className="fal fa-bars"></i></Link>
                        </div>
                    </div>
                </div>
                {/* Breadcrumb End */}

                {/* Content Start */}
                <div className="row">
                    <div className="row justify-content-center">
                        <div className="col-md-12 col-sm-12 mb-3">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="company">{lang.company}</label>
                                        <select type="text" className="form-control bd-danger" id="company" name="company" value={company} onChange={(e) => setCompany(e.target.value)} disabled>
                                            <option value="">{lang.select}</option>
                                            {company_list.map(company_row => (
                                            <option key={company_row.company_id} value={company_row.company_id}>{company_row.company_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="branch">{lang.project}</label>
                                        <select type="text" className="form-control bd-danger" id="branch" name="branch" value={branch} onChange={(e) => setBranch(e.target.value)} disabled>
                                            <option value="">{lang.select}</option>
                                            {branch_list.map(branch_row => (
                                            <option key={branch_row.branch_id} value={branch_row.branch_id}>{branch_row.branch_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {item_list.length > 0?
                            <div className="row">
                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="sales_date">{lang.sales_date}</label>
                                        <input type="date" className="form-control bd-danger" id="sales_return_sales_date" name="sales_return_sales_date" value={sales_date} onChange={(e) => setSales_date(e.target.value)} disabled />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="sales_return_date">{lang.return_date}</label>
                                        <input type="date" className="form-control bd-info" id="sales_return_date" name="sales_return_date" value={sales_return_date} onChange={(e) => setSales_return_date(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="sales_invoice">{lang.sales} {lang.invoice}</label>
                                        <input type="text" className="form-control bd-danger" id="sales_invoice" name="sales_invoice" value={sales_invoice} onChange={(e) => setSales_invoice(e.target.value)} disabled />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="customer">{lang.customer}</label>
                                        <select type="text" className="form-control bd-danger" id="customer" name="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} disabled>
                                            <option value="">{lang.select}</option>
                                            {customer_list.map(customer_row => (
                                            <option key={customer_row.customer_id} value={customer_row.customer_id}>{customer_row.customer_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            : ''}

                            <div className="row">
                                <div className="col-md-9 bg-warning-subtle mt-3">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered">
                                            <thead className="table-success tx-uppercase">
                                                <tr>
                                                    <th className="tx-center" width="44%">{lang.product}</th>
                                                    <th className="tx-center" width="10%">{lang.sales_price}</th>
                                                    <th className="tx-center" width="10%">{lang.sales} {lang.qty}</th>
                                                    <th className="tx-center" width="12%">{lang.sales} {lang.amount}</th>
                                                    <th className="tx-center" width="12%">{lang.return} {lang.qty}</th>
                                                    <th className="tx-center" width="12%">{lang.return} {lang.amount}</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                            {item_list.map((row, index) => {
                                                return (
                                                <tr className='' key={index}>
                                                    <td className="tx-left">{row.product_name}</td>
                                                    <td className="tx-right"><AccountsNumberFormat amount={row.sales_price} /></td>
                                                    <td className="tx-center" title={lang.previous_return+': '+row.previous_return_quantity}>{row.sales_quantity}</td>
                                                    <td className="tx-right">{<AccountsNumberFormat amount={row.sales_amount} />}</td>
                                                    <td className="tx-center">
                                                        <input type="number" className="tx-center bd-info" style={{maxWidth:"100px"}} id="return_quantity" name="return_quantity" value={row.return_quantity} onChange={(e) => editCartItem({
                                                            product_id          : row.product_id,
                                                            product_code        : row.product_code,
                                                            product_name        : row.product_name,
                                                            product_unit        : row.product_unit,
                                                            sales_price      : row.sales_price,
                                                            sales_quantity   : row.sales_quantity,
                                                            sales_amount     : row.sales_amount,
                                                            previous_return_quantity : row.previous_return_quantity,
                                                            return_price        : row.return_price,
                                                            return_quantity     : e.target.value,
                                                            return_amount       : row.return_amount,
                                                        })} autoComplete="off" />
                                                    </td>
                                                    <td className="tx-right">{<AccountsNumberFormat amount={row.return_amount} />}</td>
                                                </tr>
                                                )})}
                                                <tr className="table-info tx-uppercase">
                                                    <th className="tx-right" colSpan={3}>{lang.sub_total}</th>
                                                    <th className="tx-right"><AccountsNumberFormat amount={sales_total_amount} /></th>
                                                    <th className="tx-center"></th>
                                                    <th className="tx-right"><AccountsNumberFormat amount={sales_return_total_amount} /></th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-3 bg-info-subtle mt-3">
                                    <div className="col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="sales_return_adjustment">{lang.adjustment} {lang.amount} (+/-)</label>
                                            <input type="number" className="form-control bd-info tx-center tx-bold" id="sales_return_adjustment_amount" name="sales_return_adjustment_amount" value={sales_return_adjustment_amount} onChange={(e) => totalEditAmount({
                                                sales_return_adjustment_amount  : e.target.value,
                                                sales_return_paid_amount        : sales_return_paid_amount,
                                            })} />
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="sales_return_payable_amount">{lang.return} {lang.amount}</label>
                                            <input type="number" className="form-control bd-danger tx-center bg-warning-subtle tx-bold" id="sales_return_payable_amount" name="sales_return_payable_amount" value={parseFloat(sales_return_payable_amount).toFixed(2)} onChange={(e) => setSales_return_payable_amount(e.target.value)} readOnly/>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="sales_return_paid_amount">{lang.paid} {lang.amount}</label>
                                            <input type="number" className="form-control bd-info tx-center tx-bold" id="sales_return_paid_amount" name="sales_return_paid_amount" value={sales_return_paid_amount} onChange={(e) => totalEditAmount({
                                                sales_return_adjustment_amount  : sales_return_adjustment_amount,
                                                sales_return_paid_amount        : e.target.value,
                                            })} />
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 mt-3 mb-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="sales_return_due_amount">{lang.due} {lang.amount}</label>
                                            <input type="number" className="form-control bd-info tx-center bg-danger-subtle tx-bold" id="sales_return_due_amount" name="sales_return_due_amount" value={parseFloat(sales_return_due_amount).toFixed(2)} onChange={(e) => setSales_return_due_amount(e.target.value)} readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-5">
                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="sales_return_reference_number">{lang.reference_number}</label>
                                        <input type="text" className="form-control bd-info" id="sales_return_reference_number" name="sales_return_reference_number" value={sales_return_reference_number} onChange={(e) => setSales_return_reference_number(e.target.value)}/>
                                    </div>
                                </div>

                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="sales_return_payment_type">{lang.payment_type}</label>
                                        <select type="text" className="form-control bd-danger" id="sales_return_payment_type" name="sales_return_payment_type" value={sales_return_payment_type} onChange={(e) => setSales_return_payment_type(e.target.value)} >
                                            <option value="">{lang.select}</option>
                                            {payment_type_list.map(row => (
                                            <option key={row.chart_of_accounts_id} value={row.chart_of_accounts_id}>{row.chart_of_accounts_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="sales_return_payment_method">{lang.payment_method}</label>
                                        <select type="text" className="form-control bd-danger" id="sales_return_payment_method" name="sales_return_payment_method" value={sales_return_payment_method} onChange={(e) => setSales_return_payment_method(e.target.value)} >
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
                        </div>
                    </div>
                </div>
                {/* Content End */}
            </div>

            {/* Item Edit Modal Start*/}
            <div className={`modal fade ${showItemEditModel ? 'show d-block' : ''}`} >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-success m-0 p-2">
                            <h6 className="modal-title text-white">{get_item.product_name}</h6>
                            <button type="button" className="btn-close" onClick={() => setShowItemEditModel(false)}></button>
                        </div>

                        <div className="modal-body m-0 pl-3 pr-3 pt-0">
                            <div className="row">
                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="discount_percent">{lang.discount_percent} (%)</label>
                                        <input type="number" className="form-control bd-info tx-center" id="discount_percent" name="discount_percent" value={get_item.discount_percent} onChange={(e) => editCartItem({
                                            product_id          : get_item.product_id,
                                            product_code        : get_item.product_code,
                                            product_name        : get_item.product_name,
                                            product_unit        : get_item.product_unit,
                                            unit_price          : get_item.unit_price,
                                            quantity            : get_item.quantity,
                                            product_amount      : get_item.product_amount,
                                            previous_quantity   : get_item.previous_quantity,
                                            discount_percent    : e.target.value,
                                            discount_amount     : get_item.discount_amount,
                                            tax_percent         : get_item.tax_percent,
                                            tax_amount          : get_item.tax_amount,
                                            vat_percent         : get_item.vat_percent,
                                            vat_amount          : get_item.vat_amount,
                                            sales_return_price      : get_item.sales_return_price,
                                            sales_return_amount     : get_item.sales_return_amount
                                        })} required />
                                    </div>
                                </div>
                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="discount_amount">{lang.discount_amount}</label>
                                        <input type="number" className="form-control bd-danger tx-center" id="discount_amount" name="discount_amount" value={parseFloat(get_item.discount_amount).toFixed(2)} onChange={(e) => editCartItem({
                                            product_id          : get_item.product_id,
                                            product_code        : get_item.product_code,
                                            product_name        : get_item.product_name,
                                            product_unit        : get_item.product_unit,
                                            unit_price          : get_item.unit_price,
                                            quantity            : get_item.quantity,
                                            product_amount      : get_item.product_amount,
                                            previous_quantity   : get_item.previous_quantity,
                                            discount_percent    : get_item.discount_percent,
                                            discount_amount     : e.target.value,
                                            tax_percent         : get_item.tax_percent,
                                            tax_amount          : get_item.tax_amount,
                                            vat_percent         : get_item.vat_percent,
                                            vat_amount          : get_item.vat_amount,
                                            sales_return_price      : get_item.sales_return_price,
                                            sales_return_amount     : get_item.sales_return_amount,
                                        })} readOnly />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="tax_percent">{lang.tax_percent} (%)</label>
                                        <input type="number" className="form-control bd-info tx-center" id="tax_percent" name="tax_percent" value={get_item.tax_percent} onChange={(e) => editCartItem({
                                            product_id          : get_item.product_id,
                                            product_code        : get_item.product_code,
                                            product_name        : get_item.product_name,
                                            product_unit        : get_item.product_unit,
                                            unit_price          : get_item.unit_price,
                                            quantity            : get_item.quantity,
                                            product_amount      : get_item.product_amount,
                                            previous_quantity   : get_item.previous_quantity,
                                            discount_percent    : get_item.discount_percent,
                                            discount_amount     : get_item.discount_amount,
                                            tax_percent         : e.target.value,
                                            tax_amount          : get_item.tax_amount,
                                            vat_percent         : get_item.vat_percent,
                                            vat_amount          : get_item.vat_amount,
                                            sales_return_price      : get_item.sales_return_price,
                                            sales_return_amount     : get_item.sales_return_amount,
                                        })} required />
                                    </div>
                                </div>
                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="tax_amount">{lang.tax_amount}</label>
                                        <input type="number" className="form-control bd-danger tx-center" id="tax_amount" name="tax_amount" value={parseFloat(get_item.tax_amount).toFixed(2)} onChange={(e) => editCartItem({
                                            product_id          : get_item.product_id,
                                            product_code        : get_item.product_code,
                                            product_name        : get_item.product_name,
                                            product_unit        : get_item.product_unit,
                                            unit_price          : get_item.unit_price,
                                            quantity            : get_item.quantity,
                                            product_amount      : get_item.product_amount,
                                            previous_quantity   : get_item.previous_quantity,
                                            discount_percent    : get_item.discount_percent,
                                            discount_amount     : get_item.discount_amount,
                                            tax_percent         : get_item.tax_percent,
                                            tax_amount          : e.target.value,
                                            vat_percent         : get_item.vat_percent,
                                            vat_amount          : get_item.vat_amount,
                                            sales_return_price      : get_item.sales_return_price,
                                            sales_return_amount     : get_item.sales_return_amount,
                                        })} readOnly />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="vat_percent">{lang.vat_percent} (%)</label>
                                        <input type="number" className="form-control bd-info tx-center" id="vat_percent" name="vat_percent" value={get_item.vat_percent} onChange={(e) => editCartItem({
                                            product_id          : get_item.product_id,
                                            product_code        : get_item.product_code,
                                            product_name        : get_item.product_name,
                                            product_unit        : get_item.product_unit,
                                            unit_price          : get_item.unit_price,
                                            quantity            : get_item.quantity,
                                            product_amount      : get_item.product_amount,
                                            previous_quantity   : get_item.previous_quantity,
                                            discount_percent    : get_item.discount_percent,
                                            discount_amount     : get_item.discount_amount,
                                            tax_percent         : get_item.tax_percent,
                                            tax_amount          : get_item.tax_amount,
                                            vat_percent         : e.target.value,
                                            vat_amount          : get_item.vat_amount,
                                            sales_return_price      : get_item.sales_return_price,
                                            sales_return_amount     : get_item.sales_return_amount,
                                        })} required />
                                    </div>
                                </div>
                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="vat_amount">{lang.vat_amount}</label>
                                        <input type="number" className="form-control bd-danger tx-center" id="vat_amount" name="vat_amount" value={parseFloat(get_item.vat_amount).toFixed(2)} onChange={(e) => editCartItem({
                                            product_id          : get_item.product_id,
                                            product_code        : get_item.product_code,
                                            product_name        : get_item.product_name,
                                            product_unit        : get_item.product_unit,
                                            unit_price          : get_item.unit_price,
                                            quantity            : get_item.quantity,
                                            product_amount      : get_item.product_amount,
                                            previous_quantity   : get_item.previous_quantity,
                                            discount_percent    : get_item.discount_percent,
                                            discount_amount     : get_item.discount_amount,
                                            tax_percent         : get_item.tax_percent,
                                            tax_amount          : get_item.tax_amount,
                                            vat_percent         : get_item.vat_percent,
                                            vat_amount          : e.target.value,
                                            sales_return_price      : get_item.sales_return_price,
                                            sales_return_amount     : get_item.sales_return_amount,
                                        })} readOnly />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-top p-2">
                            <button type="button" className="btn btn-sm btn-danger rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => setShowItemEditModel(false)}><i className="fal fa-times-circle"></i> {lang.close}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Item Edit Modal End*/}

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
                            <button type="button" className="btn btn-sm btn-primary rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => viewReceipt(sales_return_id)}><i className="fal fa-print"></i> {lang.receipt}</button>
                            <button type="button" className="btn btn-sm btn-info rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => viewInvoice(sales_return_id)}><i className="fal fa-print"></i> {lang.invoice}</button>

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

export const getServerSideProps = async (context) => {
    const data = context.params.sales_return_edit;
    return {
        props:{
            data
        }
    }
}
export default SalesReturnUpdate;