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

const PurchaseCreate = ()=> {
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
    const [product_list, setProduct_list]           = useState([]);
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

    const [company, setCompany]                                       = useState(user_company || '');
    const [branch, setBranch]                                         = useState(user_branch || '');
    const [warehouse, setWarehouse]                                   = useState('');
    const [supplier, setSupplier]                                     = useState('');
    const [purchase_date, setPurchase_date]                           = useState(new Date().toISOString().split('T')[0]);
    const [purchase_product_amount, setPurchase_product_amount]       = useState(0);
    const [purchase_total_amount, setPurchase_total_amount]           = useState(0);
    const [purchase_adjustment_amount, setPurchase_adjustment_amount] = useState(0);
    const [purchase_payable_amount, setPurchase_payable_amount]       = useState(0);
    const [purchase_paid_amount, setPurchase_paid_amount]             = useState(0);
    const [purchase_due_amount, setPurchase_due_amount]               = useState(0);
    const [purchase_reference_number, setPurchase_reference_number]   = useState('');
    const [purchase_payment_type, setPurchase_payment_type]           = useState('');
    const [purchase_payment_method, setPurchase_payment_method]       = useState('');
    const [purchase_status, setPurchase_status]                       = useState(1);
    const [get_item, setGet_item]                                     = useState('');
    const [purchase_id, setPurchase_id]                              = useState(0);

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

    const productData = (e) => {
        if(product_search.length > 0) {
            const axios = apiUrl.get("/product/product-search/?company="+company+"&search="+product_search);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setProduct_list(result_data.data);
                } else {
                    setProduct_list([]);
                }
            }).catch((e) => console.log(e));
        } else {
            return false;
        }
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
        const axios = apiUrl.get("/chart-of-accounts/get-chart-of-accounts-category/?company="+company+"&category="+purchase_payment_type);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setPayment_method_list(result_data.data);
            } else {
                setPayment_method_list([]);
            }
        }).catch((e) => console.log(e));
    }

    const addCartItem = (product_data) => {
        const items = {
            product_id          : product_data.product_id,
            product_code        : product_data.product_code,
            product_name        : product_data.product_name,
            product_unit        : product_data.product_unit,
            unit_price          : product_data.unit_price,
            quantity            : 1,
            product_amount      : parseFloat(product_data.unit_price)*1,
            discount_percent    : 0,
            discount_amount     : 0,
            tax_percent         : 0,
            tax_amount          : 0,
            vat_percent         : 0,
            vat_amount          : 0,
            purchase_price      : product_data.unit_price,
            purchase_amount     : parseFloat(product_data.unit_price)*1
        };

        const row = item_list.find(data => data.product_id === product_data.product_id);
        row?
        ''
        :
        setItem_list([...item_list, items]);

        const purchase_product_amount = parseFloat([...item_list, items].reduce((acc, item) => acc + item.product_amount, 0));
        setPurchase_product_amount(purchase_product_amount);
        const purchase_total_amount = parseFloat([...item_list, items].reduce((acc, item) => acc + item.purchase_amount, 0));
        setPurchase_total_amount(purchase_total_amount);

        setPurchase_adjustment_amount(0);
        setPurchase_payable_amount(purchase_total_amount);
        setPurchase_paid_amount(0);
        setPurchase_due_amount(purchase_total_amount);

        setProduct_search('');
    };

    const editCartItem = (product_data) => {
        const product_amount    = parseFloat(product_data.unit_price)*parseFloat(product_data.quantity);
        const discount_amount   = parseFloat(product_amount)*parseFloat(product_data.discount_percent)/100;
        const tax_amount        = parseFloat(product_amount)*parseFloat(product_data.tax_percent)/100;
        const vat_amount        = parseFloat(product_amount)*parseFloat(product_data.vat_percent)/100;

        const purchase_price    = (parseFloat(product_data.unit_price)-(parseFloat(product_data.unit_price)*parseFloat(product_data.discount_percent)/100))+(parseFloat(product_data.unit_price)*parseFloat(product_data.tax_percent)/100+parseFloat(product_data.unit_price)*parseFloat(product_data.vat_percent)/100);
        const purchase_amount= (product_amount-discount_amount)+(tax_amount+vat_amount);

        const items = {
            product_id          : product_data.product_id,
            product_code        : product_data.product_code,
            product_name        : product_data.product_name,
            product_unit        : product_data.product_unit,
            unit_price          : product_data.unit_price || 0,
            quantity            : product_data.quantity || 0,
            product_amount      : product_amount || 0,
            discount_percent    : product_data.discount_percent || 0,
            discount_amount     : discount_amount || 0,
            tax_percent         : product_data.tax_percent || 0,
            tax_amount          : tax_amount || 0,
            vat_percent         : product_data.vat_percent || 0,
            vat_amount          : vat_amount || 0,
            purchase_price      : purchase_price || 0,
            purchase_amount     : purchase_amount || 0,
        };
        setGet_item(items);

        const updatedArray = item_list.map((data) =>
            data.product_id === product_data.product_id ? items : data
        );

        setItem_list(updatedArray);

        const purchase_product_amount = parseFloat(updatedArray.reduce((acc, item) => acc + item.product_amount, 0));
        setPurchase_product_amount(purchase_product_amount);

        const purchase_total_amount = parseFloat(updatedArray.reduce((acc, item) => acc + item.purchase_amount, 0));
        setPurchase_total_amount(purchase_total_amount);

        setPurchase_adjustment_amount(0);
        setPurchase_payable_amount(purchase_total_amount);
        setPurchase_paid_amount(0);
        setPurchase_due_amount(purchase_total_amount);
    };

    const deleteCartItem = (product_id) => {
        const deleteArray = item_list.filter((data) => data.product_id !== product_id);
        setItem_list(deleteArray);
        setGet_item('');
        const purchase_product_amount = parseFloat(deleteArray.reduce((acc, item) => acc + item.product_amount, 0));
        setPurchase_product_amount(purchase_product_amount);

        const purchase_total_amount = parseFloat(deleteArray.reduce((acc, item) => acc + item.purchase_amount, 0));
        setPurchase_total_amount(purchase_total_amount);

        setPurchase_adjustment_amount(0);
        setPurchase_payable_amount(0);
        setPurchase_paid_amount(0);
        setPurchase_due_amount(0);
    }

    const itemEditModel = (product_id) => {
        const data = item_list.find(item => item.product_id === product_id);
        setGet_item(data);
        setShowItemEditModel(true);
    };

    const totalEditAmount = (data) => {
        const adjustment_amount = data.purchase_adjustment_amount;
        const payable_amount    = parseFloat(purchase_total_amount)-parseFloat(adjustment_amount);
        const paid_amount       = payable_amount>data.purchase_paid_amount?data.purchase_paid_amount:payable_amount;
        const due_amount        = parseFloat(payable_amount)-parseFloat(paid_amount);

        setPurchase_adjustment_amount(adjustment_amount);
        setPurchase_payable_amount(payable_amount);
        setPurchase_paid_amount(paid_amount);
        setPurchase_due_amount(payable_amount > paid_amount?due_amount:0);
    };

    const viewInvoice = (data) => {
        window.open("/purchase/purchase-invoice/"+data, "Popup", "width=700, height=700");
    }

    const viewReceipt = (data) => {
        window.open("/purchase/purchase-receipt/"+data, "Popup", "width=700, height=700");
    }

    const formSubmit = (e) => {
        e.preventDefault();
        setSubmitButton(true);

        if(company <= 0) {
            setMassage('Select Company');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(branch <= 0) {
            setMassage('Select Branch');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(warehouse <= 0) {
            setMassage('Select Warehouse');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(supplier <= 0) {
            setMassage('Select Supplier');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(purchase_date.length <= 0) {
            setMassage('Choose Date');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(item_list.length == 0) {
            setMassage('Select Product');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(purchase_paid_amount >0 && purchase_payment_type <= 0) {
            setMassage('Select Payment Type');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(purchase_paid_amount >0 && purchase_payment_method <= 0) {
            setMassage('Select Payment Method');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(cash_bank_balance < purchase_paid_amount) {
            setMassage('Do not have Sufficient Balance');
            setWarningModal(true);
            setSubmitButton(false);
            setAddCashBankBalanceModel(true);
        } else {
            const purchase_data = {
                purchase_company            : company,
                purchase_branch             : branch,
                purchase_supplier           : supplier,
                purchase_warehouse          : warehouse,
                purchase_date               : purchase_date,

                purchase_product_amount     : parseFloat(item_list.reduce((acc, item) => acc + item.product_amount, 0)),
                purchase_discount_percent   : parseFloat(item_list.reduce((acc, item) => acc + item.discount_percent, 0))/item_list.length,
                purchase_discount_amount    : parseFloat(item_list.reduce((acc, item) => acc + item.discount_amount, 0)),
                purchase_tax_percent        : parseFloat(item_list.reduce((acc, item) => acc + item.tax_percent, 0))/item_list.length,
                purchase_tax_amount         : parseFloat(item_list.reduce((acc, item) => acc + item.tax_amount, 0)),
                purchase_vat_percent        : parseFloat(item_list.reduce((acc, item) => acc + item.vat_percent, 0))/item_list.length,
                purchase_vat_amount         : parseFloat(item_list.reduce((acc, item) => acc + item.vat_amount, 0)),

                purchase_total_amount       : purchase_total_amount,
                purchase_adjustment_amount  : purchase_adjustment_amount,
                purchase_payable_amount     : purchase_payable_amount,
                purchase_paid_amount        : purchase_paid_amount,
                purchase_due_amount         : purchase_due_amount,
                purchase_reference_number   : purchase_reference_number,
                purchase_payment_type       : purchase_payment_type,
                purchase_payment_method     : purchase_payment_method,
                purchase_payment_status     : purchase_due_amount > 0 ? 'Due' : 'Paid',
                purchase_status             : purchase_status
            }

            const purchase_details_data = item_list.map((row) => ({
                purchase_details_company            : company,
                purchase_details_branch             : branch,
                purchase_details_warehouse          : warehouse,
                purchase_details_supplier           : supplier,
                purchase_details_purchase_date      : purchase_date,
                purchase_details_product            : row.product_id,
                purchase_details_product_code       : row.product_code,
                purchase_details_product_name       : row.product_name,
                purchase_details_product_unit       : row.product_unit,
                purchase_details_unit_price         : row.unit_price,
                purchase_details_purchase_quantity  : row.quantity,
                purchase_details_product_amount     : row.product_amount,
                purchase_details_discount_percent   : row.discount_percent,
                purchase_details_discount_amount    : row.discount_amount,
                purchase_details_tax_percent        : row.tax_percent,
                purchase_details_tax_amount         : row.tax_amount,
                purchase_details_vat_percent        : row.vat_percent,
                purchase_details_vat_amount         : row.vat_amount,
                purchase_details_purchase_price     : row.purchase_price,
                purchase_details_purchase_amount    : row.purchase_amount,
                purchase_details_status             : purchase_status,
            }));

            const axios = apiUrl.post("/purchase/purchase-create/",{purchase_data:purchase_data, purchase_details_data:purchase_details_data})
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setMassage(result_data.message);
                    setSuccessModal(true);
                    setSubmitButton(false);
                    setSupplier('');
                    setWarehouse('');
                    setPurchase_date('');
                    setItem_list([]);
                    setPurchase_total_amount(0);
                    setPurchase_adjustment_amount(0);
                    setPurchase_payable_amount(0);
                    setPurchase_paid_amount(0);
                    setPurchase_due_amount(0);
                    setPurchase_reference_number('');
                    setPurchase_payment_type('');
                    setPurchase_payment_method('');
                    setPurchase_id(result_data.data.purchase_id)
                } else {
                    setMassage(result_data.message);
                    setWarningModal(true);
                    setSubmitButton(false);
                    setSupplier('');
                    setWarehouse('');
                    setPurchase_date('');
                    setItem_list([]);
                    setPurchase_total_amount(0);
                    setPurchase_adjustment_amount(0);
                    setPurchase_payable_amount(0);
                    setPurchase_paid_amount(0);
                    setPurchase_change_amount(0);
                    setPurchase_due_amount(0);
                    setPurchase_reference_number('');
                    setPurchase_payment_type('');
                    setPurchase_payment_method('');
                    setPurchase_id(0);
                }
            }).catch((e) => {
                setSubmitButton(false);
                console.log(e)
            });
        }
    }
    

    const cash_bank_balance = payment_type_list.reduce((chart_of_accounts_balance, data) => chart_of_accounts_balance + parseFloat(data.chart_of_accounts_balance), 0);
    const [addCashBankBalanceModel, setAddCashBankBalanceModel] = useState(false);
    
    const paymentMethodDataBalance = () => {
        const axios = apiUrl.get("/chart-of-accounts/get-chart-of-accounts-category/?company="+company+"&category="+p_type);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setPayment_method_list(result_data.data);
            } else {
                setPayment_method_list([]);
            }
        }).catch((e) => console.log(e));
    }
    const [p_type, setP_type]       = useState('');
    const [p_method, setP_method]   = useState('');
    const [balance_amount, setBalance_amount] = useState(0);

    const addCashBankBalance = () => {
        setAddCashBankBalanceModel(true);
    }

    const closeCashBankBalanceModel = () => {
        setAddCashBankBalanceModel(false);
        setBalance_amount(0);
    }

    const cashBankBalanceCreate = () => {
        const formData = {
            company             : company,
            branch              : branch,
            general_ledger      : p_type,
            subsidiary_ledger   : p_method,
            amount              : balance_amount,
        }
        const axios = apiUrl.post("/accounts/add-cash-bank-balance/",formData);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                paymentTypeData();
                paymentMethodData();
                setTimeout(() => {
                    toast.success(result_data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000
                    });
                }, 300);
                setAddCashBankBalanceModel(false);
                setBalance_amount(0);
            } else {
                setTimeout(() => {
                    toast.error(result_data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    });
                }, 300);
            }
        }).catch((e) => console.log(e));
    }

    useEffect(() => {
        companyData();
        branchData();
        warehouseData();
        supplierData();
        productData();
        coaAccountsLinkData();
        paymentTypeData();
        paymentMethodData();
        paymentMethodDataBalance();
    }, [company, branch, product_search, coa_accounts_link_id, purchase_payment_type, p_type, p_method]);

    return (
        <Layout>
            <HeaderTitle title={lang.new_purchase} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.new_purchase}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/purchase">{lang.purchase}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.new_purchase}</span>
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
                            <div className="row">
                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
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
                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
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
                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="warehouse">{lang.warehouse}</label>
                                        <select type="text" className="form-control bd-danger" id="warehouse" name="warehouse" value={warehouse} onChange={(e) => setWarehouse(e.target.value)} required>
                                            <option value="">{lang.select}</option>
                                            {warehouse_list.map(warehouse_row => (
                                            <option key={warehouse_row.warehouse_id} value={warehouse_row.warehouse_id}>{warehouse_row.warehouse_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
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
                            </div>
                            <div className="row">
                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="purchase_date">{lang.purchase_date}</label>
                                        <input type="date" className="form-control bd-danger" id="purchase_date" name="purchase_date" value={purchase_date} onChange={(e) => setPurchase_date(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="col-lg-9 col-md-9 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="product">{lang.product}</label>
                                        <div className="input-group mb-3">
                                            <label className="input-group-text bd-info tx-info" htmlFor="product_search"><i className="far fa-barcode tx-18"></i></label>
                                            <input type="text" className="form-control form-control-lg bd-info" style={{fontSize:"12px"}} id="product_search" name="product_search" value={product_search} onChange={(e) => setProduct_search(e.target.value)} placeholder={lang.product+" "+lang.search+" ("+lang.barcode+"/"+lang.product_name+")"} autoComplete="off" />

                                            <div className={`custom-search-list d-block ${product_search? 'd-block' : 'd-none'} `}>
                                                <ul className="nav flex-column">
                                                    {product_list.map((product_row) => (
                                                    <li className="nav-item" key={product_row.product_id}>
                                                        <Link className="nav-link" href="#" onClick={() => addCartItem({
                                                            product_id:product_row.product_id,
                                                            product_code:product_row.product_code,
                                                            product_name:product_row.product_name,
                                                            product_unit:product_row.product_unit,
                                                            unit_price:product_row.product_purchase_price,
                                                            purchase_price:product_row.product_purchase_price
                                                        })}>{product_row.product_name} ({lang.stock}-{product_row.product_stock_quantity} {product_row.product_unit_code}) </Link>
                                                    </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <label className="input-group-text bd-info tx-info" htmlFor="product_search"><i className="far fa-barcode tx-18"></i></label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-9 bg-warning-subtle mt-3">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered">
                                            <thead className="table-success tx-uppercase">
                                                <tr>
                                                    <th className="tx-center" width="40%">{lang.product}</th>
                                                    <th className="tx-center" width="12%">{lang.unit_price}</th>
                                                    <th className="tx-center" width="10%">{lang.qty}</th>
                                                    <th className="tx-center" width="10%">{lang.discount}(%)</th>
                                                    <th className="tx-center" width="10%">{lang.purchase_price}</th>
                                                    <th className="tx-center" width="12%">{lang.purchase} {lang.amount}</th>
                                                    <th className="tx-center" width="6%">#</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {item_list.map((row, index) => {
                                                return (
                                                <tr className='' key={index}>
                                                    <td className="tx-left">{row.product_name}</td>
                                                    <td className="tx-center">
                                                        <input type="number" className="tx-center" style={{maxWidth:"100px"}} id="unit_price" name="unit_price" value={row.unit_price} onChange={(e) => editCartItem({
                                                            product_id          : row.product_id,
                                                            product_code        : row.product_code,
                                                            product_name        : row.product_name,
                                                            product_unit        : row.product_unit,
                                                            unit_price          : e.target.value,
                                                            quantity            : row.quantity,
                                                            product_amount      : row.product_amount,
                                                            discount_percent    : row.discount_percent,
                                                            discount_amount     : row.discount_amount,
                                                            tax_percent         : row.tax_percent,
                                                            tax_amount          : row.tax_amount,
                                                            vat_percent         : row.vat_percent,
                                                            vat_amount          : row.vat_amount,
                                                            purchase_price      : row.purchase_price,
                                                            purchase_amount     : row.purchase_amount,
                                                        })} autoComplete="off" />
                                                    </td>
                                                    <td className="tx-center">
                                                        <input type="number" className="tx-center" style={{maxWidth:"100px"}} id="quantity" name="quantity" value={row.quantity} onChange={(e) => editCartItem({
                                                            product_id          : row.product_id,
                                                            product_code        : row.product_code,
                                                            product_name        : row.product_name,
                                                            product_unit        : row.product_unit,
                                                            unit_price          : row.unit_price,
                                                            quantity            : e.target.value,
                                                            product_amount      : row.product_amount,
                                                            discount_percent    : row.discount_percent,
                                                            discount_amount     : row.discount_amount,
                                                            tax_percent         : row.tax_percent,
                                                            tax_amount          : row.tax_amount,
                                                            vat_percent         : row.vat_percent,
                                                            vat_amount          : row.vat_amount,
                                                            purchase_price      : row.purchase_price,
                                                            purchase_amount     : row.purchase_amount,
                                                        })} autoComplete="off" />
                                                    </td>
                                                    <td className="tx-center">
                                                        <input type="number" className="tx-center" style={{maxWidth:"100px"}} id="discount_percent" name="discount_percent" value={row.discount_percent} onChange={(e) => editCartItem({
                                                            product_id          : row.product_id,
                                                            product_code        : row.product_code,
                                                            product_name        : row.product_name,
                                                            product_unit        : row.product_unit,
                                                            unit_price          : row.unit_price,
                                                            quantity            : row.quantity,
                                                            product_amount      : row.product_amount,
                                                            discount_percent    : e.target.value,
                                                            discount_amount     : row.discount_amount,
                                                            tax_percent         : row.tax_percent,
                                                            tax_amount          : row.tax_amount,
                                                            vat_percent         : row.vat_percent,
                                                            vat_amount          : row.vat_amount,
                                                            purchase_price      : row.purchase_price,
                                                            purchase_amount     : row.purchase_amount,
                                                        })} autoComplete="off" />
                                                    </td>
                                                    <td className="tx-right">{<AccountsNumberFormat amount={row.purchase_price} />}</td>
                                                    <td className="tx-right">{<AccountsNumberFormat amount={row.purchase_amount} />}</td>
                                                    <td className="tx-center">
                                                        <Link className="link-info tx-center" href="#" onClick={() => itemEditModel(row.product_id)}><i className="fas fa-pencil"></i></Link>&nbsp;&nbsp;&nbsp;
                                                        <Link className="link-danger tx-center" href="#" onClick={() => deleteCartItem(row.product_id)}><i className="fas fa-times"></i></Link>
                                                    </td>
                                                </tr>
                                                )})}
                                                <tr className="table-info tx-uppercase">
                                                    <th className="tx-right" colSpan={5}>{lang.total} {lang.amount}</th>
                                                    <th className="tx-right"><AccountsNumberFormat amount={purchase_total_amount} /></th>
                                                    <th className="tx-center">

                                                    </th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-3 bg-info-subtle mt-3">
                                    <div className="col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="purchase_adjustment">{lang.adjustment} {lang.amount} (+/-)</label>
                                            <input type="number" className="form-control bd-info tx-center tx-bold" id="purchase_adjustment_amount" name="purchase_adjustment_amount" value={purchase_adjustment_amount} onChange={(e) => totalEditAmount({
                                                purchase_adjustment_amount  : e.target.value,
                                                purchase_paid_amount        : purchase_paid_amount,
                                            })} />
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="purchase_payable_amount">{lang.payable} {lang.amount}</label>
                                            <input type="number" className="form-control bd-danger tx-center bg-warning-subtle tx-bold" id="purchase_payable_amount" name="purchase_payable_amount" value={parseFloat(purchase_payable_amount).toFixed(2)} onChange={(e) => setPurchase_payable_amount(e.target.value)} readOnly/>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="purchase_paid_amount">{lang.paid} {lang.amount}</label>
                                            <input type="number" className="form-control bd-info tx-center tx-bold" id="purchase_paid_amount" name="purchase_paid_amount" value={purchase_paid_amount} onChange={(e) => totalEditAmount({
                                                purchase_adjustment_amount  : purchase_adjustment_amount,
                                                purchase_paid_amount        : e.target.value,
                                            })} />
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 mt-3 mb-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="purchase_due_amount">{lang.due} {lang.amount}</label>
                                            <input type="number" className="form-control bd-info tx-center bg-danger-subtle tx-bold" id="purchase_due_amount" name="purchase_due_amount" value={parseFloat(purchase_due_amount).toFixed(2)} onChange={(e) => setPurchase_due_amount(e.target.value)} readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-5">
                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="purchase_reference_number">{lang.reference_number}</label>
                                        <input type="text" className="form-control bd-info" id="purchase_reference_number" name="purchase_reference_number" value={purchase_reference_number} onChange={(e) => setPurchase_reference_number(e.target.value)}/>
                                    </div>
                                </div>

                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="purchase_payment_type">{lang.payment_type}</label>
                                        <select type="text" className="form-control bd-danger" id="purchase_payment_type" name="purchase_payment_type" value={purchase_payment_type} onChange={(e) => setPurchase_payment_type(e.target.value)} >
                                            <option value="">{lang.select}</option>
                                            {payment_type_list.map(row => (
                                            <option key={row.chart_of_accounts_id} value={row.chart_of_accounts_id} disabled={row.chart_of_accounts_balance>0?null:true}>{row.chart_of_accounts_name} ({row.chart_of_accounts_balance})</option>
                                            ))}
                                        </select>
                                    </div>
                                    {company>0 && cash_bank_balance<=0 || cash_bank_balance<purchase_paid_amount?
                                    <div className="d-grid gap-2 mt-3">
                                        <button type="button" className="btn btn-primary tx-uppercase" onClick={()=>addCashBankBalance()}><i className="fal fa-money-bill"></i> {lang.add_balance}</button>
                                    </div>
                                    :''}
                                </div>

                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="purchase_payment_method">{lang.payment_method}</label>
                                        <select type="text" className="form-control bd-danger" id="purchase_payment_method" name="purchase_payment_method" value={purchase_payment_method} onChange={(e) => setPurchase_payment_method(e.target.value)} >
                                            <option value="">{lang.select}</option>
                                            {payment_method_list.map(row => (
                                            <option key={row.chart_of_accounts_id} value={row.chart_of_accounts_id} disabled={row.chart_of_accounts_balance>0?null:true}>{row.chart_of_accounts_name} ({row.chart_of_accounts_balance})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="submit">&nbsp;</label>
                                        <div className="d-grid gap-2">
                                            <button type="submit" className={`btn btn-success pd-t-6-force pd-b-5-force mg-r-3 tx-uppercase ${submitButton?'disabled':(company>0 && cash_bank_balance<=0 || cash_bank_balance<purchase_paid_amount)?'disabled':''}`} onClick={(e) => formSubmit(e)}>{submitButton?lang.process: lang.save}</button>
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
                                            discount_percent    : e.target.value,
                                            discount_amount     : get_item.discount_amount,
                                            tax_percent         : get_item.tax_percent,
                                            tax_amount          : get_item.tax_amount,
                                            vat_percent         : get_item.vat_percent,
                                            vat_amount          : get_item.vat_amount,
                                            purchase_price      : get_item.purchase_price,
                                            purchase_amount     : get_item.purchase_amount,
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
                                            discount_percent    : get_item.discount_percent,
                                            discount_amount     : e.target.value,
                                            tax_percent         : get_item.tax_percent,
                                            tax_amount          : get_item.tax_amount,
                                            vat_percent         : get_item.vat_percent,
                                            vat_amount          : get_item.vat_amount,
                                            purchase_price      : get_item.purchase_price,
                                            purchase_amount     : get_item.purchase_amount,
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
                                            discount_percent    : get_item.discount_percent,
                                            discount_amount     : get_item.discount_amount,
                                            tax_percent         : e.target.value,
                                            tax_amount          : get_item.tax_amount,
                                            vat_percent         : get_item.vat_percent,
                                            vat_amount          : get_item.vat_amount,
                                            purchase_price      : get_item.purchase_price,
                                            purchase_amount     : get_item.purchase_amount,
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
                                            discount_percent    : get_item.discount_percent,
                                            discount_amount     : get_item.discount_amount,
                                            tax_percent         : get_item.tax_percent,
                                            tax_amount          : e.target.value,
                                            vat_percent         : get_item.vat_percent,
                                            vat_amount          : get_item.vat_amount,
                                            purchase_price      : get_item.purchase_price,
                                            purchase_amount     : get_item.purchase_amount,
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
                                            discount_percent    : get_item.discount_percent,
                                            discount_amount     : get_item.discount_amount,
                                            tax_percent         : get_item.tax_percent,
                                            tax_amount          : get_item.tax_amount,
                                            vat_percent         : e.target.value,
                                            vat_amount          : get_item.vat_amount,
                                            purchase_price      : get_item.purchase_price,
                                            purchase_amount     : get_item.purchase_amount,
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
                                            discount_percent    : get_item.discount_percent,
                                            discount_amount     : get_item.discount_amount,
                                            tax_percent         : get_item.tax_percent,
                                            tax_amount          : get_item.tax_amount,
                                            vat_percent         : get_item.vat_percent,
                                            vat_amount          : e.target.value,
                                            purchase_price      : get_item.purchase_price,
                                            purchase_amount     : get_item.purchase_amount,
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
            
            {/* Add Cash Bank Modal Start*/}
            <div className={`modal fade ${addCashBankBalanceModel ? 'show d-block' : ''}`} >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-success m-0 p-2">
                            <h6 className="modal-title text-white">{lang.add_balance}</h6>
                            <button type="button" className="btn-close" onClick={() => closeCashBankBalanceModel()}></button>
                        </div>

                        <div className="modal-body m-0 pl-3 pr-3 pt-0">
                            <div className="row">
                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="p_type">{lang.payment_type}</label>
                                        <select type="text" className="form-control bd-danger" id="p_type" name="p_type" value={p_type} onChange={(e) => setP_type(e.target.value)} >
                                            <option value="">{lang.select}</option>
                                            {payment_type_list.map(row => (
                                            <option key={row.chart_of_accounts_id} value={row.chart_of_accounts_id}>{row.chart_of_accounts_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="p_method">{lang.payment_method}</label>
                                        <select type="text" className="form-control bd-danger" id="p_method" name="p_method" value={p_method} onChange={(e) => setP_method(e.target.value)} >
                                            <option value="">{lang.select}</option>
                                            {payment_method_list.map(row => (
                                            <option key={row.chart_of_accounts_id} value={row.chart_of_accounts_id}>{row.chart_of_accounts_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="balance_amount">{lang.amount}</label>
                                        <input type="number" className="form-control bd-info tx-center" id="balance_amount" name="balance_amount" value={balance_amount} onChange={(e) => setBalance_amount(e.target.value)}required />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-top p-2">
                            <button type="button" className="btn btn-sm btn-danger rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => closeCashBankBalanceModel()}><i className="fal fa-times-circle"></i> {lang.close}</button>
                            <button type="submit" className="btn btn-sm btn-success rounded-pill text-uppercase pd-t-6-force pd-b-5-force"  onClick={() => cashBankBalanceCreate()}><i className="fal fa-check-circle"></i> {lang.save}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Add Cash Bank Modal End*/}

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
                            <button type="button" className="btn btn-sm btn-primary rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => viewReceipt(purchase_id)}><i className="fal fa-print"></i> {lang.receipt}</button>
                            <button type="button" className="btn btn-sm btn-info rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => viewInvoice(purchase_id)}><i className="fal fa-print"></i> {lang.invoice}</button>

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

export default PurchaseCreate;