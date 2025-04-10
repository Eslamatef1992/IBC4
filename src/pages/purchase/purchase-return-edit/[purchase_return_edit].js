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

const PurchaseReturnUpdate = ({data})=> {
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

    const [submitButton, setSubmitButton]           = useState(false);
    const [warningModal, setWarningModal]           = useState(false);
    const [successModal, setSuccessModal]           = useState(false);
    const [showItemEditModel, setShowItemEditModel] = useState(false);
    const [message, setMassage]                     = useState('');

    const [company_list, setCompany_list]           = useState([]);
    const [branch_list, setBranch_list]             = useState([]);
    const [warehouse_list, setWarehouse_list]       = useState([]);
    const [supplier_list, setSupplier_list]         = useState([]);
    const [purchase_return_list, setPurchase_return_list] = useState([]);
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
    const [supplier, setSupplier]                                     = useState('');
    const [purchase_date, setPurchase_date]                           = useState(new Date().toISOString().split('T')[0]);
    const [purchase_return_date, setPurchase_return_date]             = useState(new Date().toISOString().split('T')[0]);

    const [purchase_return_previous_total_amount, setPurchase_return_previous_total_amount]           = useState(0);
    const [purchase_return_previous_adjustment_amount, setPurchase_return_previous_adjustment_amount] = useState(0);
    const [purchase_return_previous_payable_amount, setPurchase_return_previous_payable_amount]       = useState(0);
    const [purchase_return_previous_paid_amount, setPurchase_return_previous_paid_amount]             = useState(0);
    const [purchase_return_previous_due_amount, setPurchase_return_previous_due_amount]               = useState(0);

    const [purchase_total_amount, setPurchase_total_amount]                         = useState(0);
    const [purchase_return_total_amount, setPurchase_return_total_amount]           = useState(0);
    const [purchase_return_adjustment_amount, setPurchase_return_adjustment_amount] = useState(0);
    const [purchase_return_payable_amount, setPurchase_return_payable_amount]       = useState(0);
    const [purchase_return_paid_amount, setPurchase_return_paid_amount]             = useState(0);
    const [purchase_return_due_amount, setPurchase_return_due_amount]               = useState(0);
    const [purchase_return_reference_number, setPurchase_return_reference_number]   = useState('');
    const [purchase_return_payment_type, setPurchase_return_payment_type]           = useState('');
    const [purchase_return_payment_method, setPurchase_return_payment_method]       = useState('');
    const [purchase_return_status, setPurchase_return_status]                       = useState(1);
    const [get_item, setGet_item]                                                   = useState('');
    const [purchase_return_id, setPurchase_return_id]                               = useState(0);
    const [purchase_id, setPurchase_id]                                             = useState('');
    const [purchase_invoice, setPurchase_invoice]                                   = useState('');

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
    }

    const returnData = (e) => {
        if(product_search.length > 0) {
            const axios = apiUrl.get("/product/product-return-search/?company="+company+"&search="+product_search);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setPurchase_return_list(result_data.data);
                } else {
                    setPurchase_return_list([]);
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
            purchase_price      : product_data.purchase_price || 0,
            purchase_quantity   : product_data.purchase_quantity || 0,
            purchase_amount     : product_data.purchase_amount || 0,
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
        const purchase_return_total_amount = parseFloat(updatedArray.reduce((acc, item) => acc + item.return_amount, 0));
        setPurchase_return_total_amount(purchase_return_total_amount);

        setPurchase_return_adjustment_amount(0);
        setPurchase_return_payable_amount(purchase_return_total_amount);
        setPurchase_return_paid_amount(purchase_return_paid_amount);
        setPurchase_return_due_amount(purchase_return_total_amount-parseFloat(purchase_return_paid_amount));
    };

    const totalEditAmount = (data) => {
        const adjustment_amount = data.purchase_return_adjustment_amount;
        const payable_amount    = parseFloat(purchase_return_total_amount)-parseFloat(adjustment_amount);
        const paid_amount       = data.purchase_return_paid_amount;
        const due_amount        = parseFloat(payable_amount)-parseFloat(paid_amount);

        setPurchase_return_adjustment_amount(adjustment_amount);
        setPurchase_return_payable_amount(payable_amount);
        setPurchase_return_paid_amount(payable_amount>paid_amount?paid_amount:payable_amount);
        setPurchase_return_due_amount(payable_amount > paid_amount?due_amount:0);
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
        } else if(purchase_return_paid_amount >0 && purchase_return_payment_type <= 0) {
            setMassage('Select Payment Type');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(purchase_return_paid_amount >0 && purchase_return_payment_method <= 0) {
            setMassage('Select Payment Method');
            setWarningModal(true);
            setSubmitButton(false);
        } else {
            const purchase_return_data = {
                purchase_return_company             : company,
                purchase_return_branch              : branch,
                purchase_return_supplier            : supplier,
                purchase_return_warehouse           : warehouse,
                purchase_return_purchase            : purchase_id,
                purchase_return_purchase_invoice    : purchase_invoice,
                purchase_return_purchase_date       : purchase_date,
                purchase_return_date                : purchase_return_date,
                purchase_return_total_amount        : purchase_return_total_amount,
                purchase_return_adjustment_amount   : purchase_return_adjustment_amount,
                purchase_return_payable_amount      : purchase_return_payable_amount,
                purchase_return_paid_amount         : purchase_return_paid_amount,
                purchase_return_due_amount          : purchase_return_due_amount,
                purchase_return_previous_total_amount   : purchase_return_previous_total_amount,
                purchase_return_previous_adjustment_amount: purchase_return_previous_adjustment_amount,
                purchase_return_previous_payable_amount : purchase_return_previous_payable_amount,
                purchase_return_previous_paid_amount    : purchase_return_previous_paid_amount,
                purchase_return_previous_due_amount     : purchase_return_previous_due_amount,
                purchase_return_reference_number    : purchase_return_reference_number,
                purchase_return_payment_type        : purchase_return_payment_type,
                purchase_return_payment_method      : purchase_return_payment_method,
                purchase_return_payment_status      : purchase_return_due_amount > 0 ? 'Due' : 'Paid',
                purchase_return_status              : purchase_return_status
            }

            const purchase_return_details_data = item_return_list.map((row) => ({
                purchase_return_details_company             : company,
                purchase_return_details_branch              : branch,
                purchase_return_details_supplier            : supplier,
                purchase_return_details_warehouse           : warehouse,
                purchase_return_details_purchase            : purchase_id,
                purchase_return_details_purchase_invoice    : purchase_invoice,
                purchase_return_details_purchase_date       : purchase_date,
                purchase_return_details_purchase_return     : purchase_return_id,
                purchase_return_details_return_date         : purchase_return_date,
                purchase_return_details_product             : row.product_id,
                purchase_return_details_product_code        : row.product_code,
                purchase_return_details_product_name        : row.product_name,
                purchase_return_details_product_unit        : row.product_unit,
                purchase_return_details_purchase_price      : row.purchase_price,
                purchase_return_details_purchase_quantity   : row.purchase_quantity,
                purchase_return_details_purchase_amount     : row.purchase_amount,
                purchase_return_details_previous_return_quantity : row.previous_return_quantity,
                purchase_return_details_return_price        : row.return_price,
                purchase_return_details_return_quantity     : row.return_quantity,
                purchase_return_details_return_amount       : row.return_amount,
                purchase_return_details_status              : purchase_return_status,
            }));

            const axios = apiUrl.put("/purchase/purchase-return-update/"+data,{purchase_return_data:purchase_return_data, purchase_return_details_data:purchase_return_details_data})
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setMassage(result_data.message);
                    setSuccessModal(true);
                    setSubmitButton(false);
                    setPurchase_return_id(result_data.data.purchase_return_id);
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
        window.open("/purchase/purchase-return-invoice/"+data, "Popup", "width=700, height=700");
    }

    const viewReceipt = (data) => {
        window.open("/purchase/purchase-return-receipt/"+data, "Popup", "width=700, height=700");
    }

    const purchaseReturnData = () => {
        const axios = apiUrl.get("/purchase/get-purchase-return/"+data);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setPurchase_return_id(result_data.data.purchase_return_id);
                setCompany(result_data.data.purchase_return_company);
                setBranch(result_data.data.purchase_return_branch);
                setWarehouse(result_data.data.purchase_return_warehouse);
                setSupplier(result_data.data.purchase_return_supplier);
                setPurchase_date(result_data.data.purchase_return_purchase_date);
                setPurchase_id(result_data.data.purchase_return_purchase);
                setPurchase_invoice(result_data.data.purchase_return_purchase_invoice);
                setPurchase_return_date(result_data.data.purchase_return_date);

                setPurchase_return_previous_total_amount(result_data.data.purchase_return_total_amount);
                setPurchase_return_previous_adjustment_amount(result_data.data.purchase_return_adjustment_amount);
                setPurchase_return_previous_payable_amount(result_data.data.purchase_return_payable_amount);
                setPurchase_return_previous_paid_amount(result_data.data.purchase_return_paid_amount);
                setPurchase_return_previous_due_amount(result_data.data.purchase_return_due_amount);

                setPurchase_return_total_amount(result_data.data.purchase_return_total_amount);
                setPurchase_return_adjustment_amount(result_data.data.purchase_return_adjustment_amount);
                setPurchase_return_payable_amount(result_data.data.purchase_return_payable_amount);
                setPurchase_return_paid_amount(result_data.data.purchase_return_paid_amount);
                setPurchase_return_due_amount(result_data.data.purchase_return_due_amount);
                setPurchase_return_reference_number(result_data.data.purchase_return_reference_number);
                setPurchase_return_payment_type(result_data.data.purchase_return_payment_type);
                setPurchase_return_payment_method(result_data.data.purchase_return_payment_method);
                const purchase_return_details_data = result_data.data.purchase_return_details.map((row) => ({
                    product_id          : row.purchase_return_details_product,
                    product_code        : row.purchase_return_details_product_code,
                    product_name        : row.purchase_return_details_product_name,
                    product_unit        : row.purchase_return_details_product_unit,
                    purchase_price      : parseFloat(row.purchase_return_details_purchase_price) || 0,
                    purchase_quantity   : parseFloat(row.purchase_return_details_purchase_quantity) || 0,
                    purchase_amount     : parseFloat(row.purchase_return_details_purchase_amount) || 0,
                    return_price        : parseFloat(row.purchase_return_details_return_price) || 0,
                    previous_return_quantity: parseFloat(row.purchase_return_details_return_quantity) || 0,
                    return_quantity     : parseFloat(row.purchase_return_details_return_quantity) || 0,
                    return_amount       : parseFloat(row.purchase_return_details_return_amount) || 0,
                }));
                setPurchase_total_amount(parseFloat(purchase_return_details_data.reduce((acc, item) => acc + item.purchase_amount, 0)));
                setItem_list(purchase_return_details_data || []);
            } else {
                setPurchase_return_id('');
                setCompany('');
                setBranch('');
                setWarehouse('');
                setSupplier('');
                setPurchase_date('');
                setPurchase_id('');
                setPurchase_invoice('');
                setPurchase_return_date('');
                setPurchase_total_amount('');
                setPurchase_return_total_amount('');
                setPurchase_return_adjustment_amount('');
                setPurchase_return_payable_amount('');
                setPurchase_return_paid_amount('');
                setPurchase_return_due_amount('');
                setPurchase_return_reference_number('');
                setPurchase_return_payment_type('');
                setPurchase_return_payment_method('');
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
        const axios = apiUrl.get("/chart-of-accounts/get-chart-of-accounts-category/?company="+company+"&category="+purchase_return_payment_type);
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
        purchaseReturnData();
    }, []);

    useEffect(() => {
        companyData();
        branchData();
        warehouseData();
        supplierData();
        returnData();
        coaAccountsLinkData();
        paymentTypeData();
        paymentMethodData();
    }, [company, branch, invoice, coa_accounts_link_id, purchase_return_payment_type]);

    return (
        <Layout>
            <HeaderTitle title={lang.purchase_return_edit} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.purchase_return_edit}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/purchase">{lang.purchase}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.purchase_return_edit}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center d-print-none">
                            <Link className="btn btn-success rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.purchase_return_list} href="/purchase/purchase-list"><i className="fal fa-bars"></i></Link>
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
                                        <label className="form-label tx-semibold" htmlFor="purchase_date">{lang.purchase_date}</label>
                                        <input type="date" className="form-control bd-danger" id="purchase_return_purchase_date" name="purchase_return_purchase_date" value={purchase_date} onChange={(e) => setPurchase_date(e.target.value)} disabled />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="purchase_return_date">{lang.return_date}</label>
                                        <input type="date" className="form-control bd-info" id="purchase_return_date" name="purchase_return_date" value={purchase_return_date} onChange={(e) => setPurchase_return_date(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="purchase_invoice">{lang.purchase} {lang.invoice}</label>
                                        <input type="text" className="form-control bd-danger" id="purchase_invoice" name="purchase_invoice" value={purchase_invoice} onChange={(e) => setPurchase_invoice(e.target.value)} disabled />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="supplier">{lang.supplier}</label>
                                        <select type="text" className="form-control bd-danger" id="supplier" name="supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} disabled>
                                            <option value="">{lang.select}</option>
                                            {supplier_list.map(supplier_row => (
                                            <option key={supplier_row.supplier_id} value={supplier_row.supplier_id}>{supplier_row.supplier_name}</option>
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
                                                    <th className="tx-center" width="10%">{lang.purchase_price}</th>
                                                    <th className="tx-center" width="10%">{lang.purchase} {lang.qty}</th>
                                                    <th className="tx-center" width="12%">{lang.purchase} {lang.amount}</th>
                                                    <th className="tx-center" width="12%">{lang.return} {lang.qty}</th>
                                                    <th className="tx-center" width="12%">{lang.return} {lang.amount}</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                            {item_list.map((row, index) => {
                                                return (
                                                <tr className='' key={index}>
                                                    <td className="tx-left">{row.product_name}</td>
                                                    <td className="tx-right"><AccountsNumberFormat amount={row.purchase_price} /></td>
                                                    <td className="tx-center" title={lang.previous_return+': '+row.previous_return_quantity}>{row.purchase_quantity}</td>
                                                    <td className="tx-right">{<AccountsNumberFormat amount={row.purchase_amount} />}</td>
                                                    <td className="tx-center">
                                                        <input type="number" className="tx-center bd-info" style={{maxWidth:"100px"}} id="return_quantity" name="return_quantity" value={row.return_quantity} onChange={(e) => editCartItem({
                                                            product_id          : row.product_id,
                                                            product_code        : row.product_code,
                                                            product_name        : row.product_name,
                                                            product_unit        : row.product_unit,
                                                            purchase_price      : row.purchase_price,
                                                            purchase_quantity   : row.purchase_quantity,
                                                            purchase_amount     : row.purchase_amount,
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
                                                    <th className="tx-right"><AccountsNumberFormat amount={purchase_total_amount} /></th>
                                                    <th className="tx-center"></th>
                                                    <th className="tx-right"><AccountsNumberFormat amount={purchase_return_total_amount} /></th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-3 bg-info-subtle mt-3">
                                    <div className="col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="purchase_return_adjustment">{lang.adjustment} {lang.amount} (+/-)</label>
                                            <input type="number" className="form-control bd-info tx-center tx-bold" id="purchase_return_adjustment_amount" name="purchase_return_adjustment_amount" value={purchase_return_adjustment_amount} onChange={(e) => totalEditAmount({
                                                purchase_return_adjustment_amount  : e.target.value,
                                                purchase_return_paid_amount        : purchase_return_paid_amount,
                                            })} />
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="purchase_return_payable_amount">{lang.return} {lang.amount}</label>
                                            <input type="number" className="form-control bd-danger tx-center bg-warning-subtle tx-bold" id="purchase_return_payable_amount" name="purchase_return_payable_amount" value={parseFloat(purchase_return_payable_amount).toFixed(2)} onChange={(e) => setPurchase_return_payable_amount(e.target.value)} readOnly/>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="purchase_return_paid_amount">{lang.paid} {lang.amount}</label>
                                            <input type="number" className="form-control bd-info tx-center tx-bold" id="purchase_return_paid_amount" name="purchase_return_paid_amount" value={purchase_return_paid_amount} onChange={(e) => totalEditAmount({
                                                purchase_return_adjustment_amount  : purchase_return_adjustment_amount,
                                                purchase_return_paid_amount        : e.target.value,
                                            })} />
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 mt-3 mb-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="purchase_return_due_amount">{lang.due} {lang.amount}</label>
                                            <input type="number" className="form-control bd-info tx-center bg-danger-subtle tx-bold" id="purchase_return_due_amount" name="purchase_return_due_amount" value={parseFloat(purchase_return_due_amount).toFixed(2)} onChange={(e) => setPurchase_return_due_amount(e.target.value)} readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-5">
                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="purchase_return_reference_number">{lang.reference_number}</label>
                                        <input type="text" className="form-control bd-info" id="purchase_return_reference_number" name="purchase_return_reference_number" value={purchase_return_reference_number} onChange={(e) => setPurchase_return_reference_number(e.target.value)}/>
                                    </div>
                                </div>

                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="purchase_return_payment_type">{lang.payment_type}</label>
                                        <select type="text" className="form-control bd-danger" id="purchase_return_payment_type" name="purchase_return_payment_type" value={purchase_return_payment_type} onChange={(e) => setPurchase_return_payment_type(e.target.value)} >
                                            <option value="">{lang.select}</option>
                                            {payment_type_list.map(row => (
                                            <option key={row.chart_of_accounts_id} value={row.chart_of_accounts_id}>{row.chart_of_accounts_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="purchase_return_payment_method">{lang.payment_method}</label>
                                        <select type="text" className="form-control bd-danger" id="purchase_return_payment_method" name="purchase_return_payment_method" value={purchase_return_payment_method} onChange={(e) => setPurchase_return_payment_method(e.target.value)} >
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
                                            purchase_return_price      : get_item.purchase_return_price,
                                            purchase_return_amount     : get_item.purchase_return_amount
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
                                            purchase_return_price      : get_item.purchase_return_price,
                                            purchase_return_amount     : get_item.purchase_return_amount,
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
                                            purchase_return_price      : get_item.purchase_return_price,
                                            purchase_return_amount     : get_item.purchase_return_amount,
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
                                            purchase_return_price      : get_item.purchase_return_price,
                                            purchase_return_amount     : get_item.purchase_return_amount,
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
                                            purchase_return_price      : get_item.purchase_return_price,
                                            purchase_return_amount     : get_item.purchase_return_amount,
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
                                            purchase_return_price      : get_item.purchase_return_price,
                                            purchase_return_amount     : get_item.purchase_return_amount,
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
                            <button type="button" className="btn btn-sm btn-primary rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => viewReceipt(purchase_return_id)}><i className="fal fa-print"></i> {lang.receipt}</button>
                            <button type="button" className="btn btn-sm btn-info rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => viewInvoice(purchase_return_id)}><i className="fal fa-print"></i> {lang.invoice}</button>

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
    const data = context.params.purchase_return_edit;
    return {
        props:{
            data
        }
    }
}
export default PurchaseReturnUpdate;