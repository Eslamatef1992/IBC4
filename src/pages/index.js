import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect, useRef} from 'react';
import Layout from '@/components/layout';

import HeaderTitle from '@/components/header-title';
import getTranslation from '@/languages';
import router from 'next/router';
import apiUrl from '@/components/api-url';
import AccountsNumberFormat from '@/components/accounts-number-format';
import { toast, ToastContainer } from 'react-toastify';

const Home = ()=> {
    let user_id, user_group, user_group_name, user_name, username, user_id_number, user_designation, user_phone, user_email, user_picture, user_company, user_branch, user_language;
    if (typeof window !== 'undefined') {
        user_id             = localStorage.getItem('user_id');
        user_group          = localStorage.getItem('user_group');
        user_group_name     = localStorage.getItem('user_group_name');
        user_name           = localStorage.getItem('user_name');
        username            = localStorage.getItem('username');
        user_id_number      = localStorage.getItem('user_id_number');
        user_designation    = localStorage.getItem('user_designation');
        user_phone          = localStorage.getItem('user_phone');
        user_email          = localStorage.getItem('user_email');
        user_picture        = localStorage.getItem('user_picture');
        user_company        = localStorage.getItem('user_company');
        user_branch         = localStorage.getItem('user_branch');
        user_language       = localStorage.getItem('user_language');
    }

    const lang = getTranslation();
    const [company, setCompany]             = useState('');
    const [branch, setBranch]               = useState('');
    const [u_group, setU_group]             = useState('');
    const [total_company, setTotal_company] = useState(0);
    const [total_branch, setTotal_branch]   = useState(0);
    const [total_user, setTotal_user]       = useState(0);
    const [cash_balance, setCash_balance]   = useState(0);
    const [bank_balance, setBank_balance]   = useState(0);
    const [sales_balance, setSales_balance] = useState({});
    const [purchase_balance, setPurchase_balance] = useState({});

    const [u_language, setU_language]       = useState('');
    const [u_picture, setU_picture]         = useState('');
    const [u_name, setU_name]               = useState('');
    const [u_designation, setU_designation] = useState('');

    const [voucher_list, setVoucher_list]               = useState([]);
    const total_debit = voucher_list.reduce((debit, data) => debit + parseFloat((data.accounts_total_debit)), 0);
    const total_credit = voucher_list.reduce((credit, data) => credit + parseFloat((data.accounts_total_credit)), 0);

    const companyCount = () => {
        const axios = apiUrl.get("/company/company-count/");
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setTotal_company(result_data.data);
            } else {
                setTotal_company(0);
            }
        }).catch((e) => console.log(e));
    }

    const branchCount = () => {
        // if(company > 0) {
            let axios;
            if(company > 0 && user_group == 3){
            axios  = apiUrl.get("/branch/branch-count-company/"+company);
            } else {
            axios  = apiUrl.get("/branch/branch-count/");
            }

            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setTotal_branch(result_data.data);
                } else {
                    setTotal_branch(0);
                }
            }).catch((e) => console.log(e));
        // }
    }

    const userCount = () => {
        if(company > 0) {
            let axios;
            if(user_group == 3){
                axios  = apiUrl.get("/users/user-count-company/"+company);
            } else if(user_group == 4){
                axios  = apiUrl.get("/users/user-count-branch?company="+company+"&branch="+branch);
            } else {
                axios  = apiUrl.get("/users/user-count/");
            }
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setTotal_user(result_data.data);
                } else {
                    setTotal_user(0);
                }
            }).catch((e) => console.log(e));
        }
    }

    const cashBalance = () => {
        if(company > 0) {
            let axios;
            if(user_group == 3){
                axios  = apiUrl.get("/accounts/cash-balance-company/"+company);
            } else {
                axios  = apiUrl.get("/accounts/cash-balance-branch?company="+company+"&branch="+branch);
            }
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setCash_balance(result_data.data);
                } else {
                    setCash_balance(0);
                }
            }).catch((e) => console.log(e));
        }
    }

    const voucherData = () => {
        if(company > 0) {
            const axios = apiUrl.get("/accounts/voucher-list-latest/?company="+company+"&branch="+branch);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setVoucher_list(result_data.data);
                } else {
                    setVoucher_list([]);
                }
            }).catch((e) => console.log(e));
        }
    }

    const bankBalance = () => {
        if(company > 0) {
            let axios;
            if(user_group == 3){
                axios  = apiUrl.get("/accounts/bank-balance-company/"+company);
            } else {
                axios  = apiUrl.get("/accounts/bank-balance-branch?company="+company+"&branch="+branch);
            }
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setBank_balance(result_data.data);
                } else {
                    setBank_balance(0);
                }
            }).catch((e) => console.log(e));
        }
    }

    const salesBalanceData = () => {
        if(company > 0) {
            let axios;
            if(user_group == 3){
                axios  = apiUrl.get("/sales/sales-balance/"+company);
            } else {
                axios  = apiUrl.get("/sales/sales-balance-branch?company="+company+"&branch="+branch);
            }
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setSales_balance(result_data.data);
                } else {
                    setSales_balance({});
                }
            }).catch((e) => console.log(e));
        }
    }

    const purchaseBalanceData = () => {
        if(company > 0) {
            let axios;
            if(user_group == 3){
                axios  = apiUrl.get("/purchase/purchase-balance/"+company);
            } else {
                axios  = apiUrl.get("/purchase/purchase-balance-branch?company="+company+"&branch="+branch);
            }
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setPurchase_balance(result_data.data);
                } else {
                    setPurchase_balance({});
                }
            }).catch((e) => console.log(e));
        }
    }

    const [company_list, setCompany_list]               = useState([]);
    const [branch_list, setBranch_list]                 = useState([]);
    const [accounts_company, setAccounts_company]       = useState('');
    const [accounts_branch, setAccounts_branch]        = useState('');
    const [message, setMessage] = useState('');
    const [warningModal, setWarningModal] = useState(false);
    const [cash_bank_submit_button, setCash_bank_submit_button] = useState(false);
    const [addCashBankBalanceModel, setAddCashBankBalanceModel] = useState(false);
    const [addCashBankBalanceWithdrawModel, setAddCashBankBalanceWithdrawModel] = useState(false);
    const [coa_accounts_link_id, setCoa_accounts_link_id]       = useState('');
    const [coa_accounts_link, setCoa_accounts_link]       = useState('');
    const [general_ledger_list, setGeneral_ledger_list] = useState([]);
    const [subsidiary_ledger_list, setSubsidiary_ledger_list] = useState([]);
    const [general_ledger, setGeneral_ledger]                       = useState('');
    const [subsidiary_ledger, setSubsidiary_ledger]                   = useState('');
    const [balance_amount, setBalance_amount]                   = useState('');

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
        if(company > 0){
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
        const axios = apiUrl.get("/chart-of-accounts/get-chart-of-accounts-category/?company="+accounts_company+"&category="+coa_accounts_link_id);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setGeneral_ledger_list(result_data.data);
            } else {
                setGeneral_ledger_list([]);
            }
        }).catch((e) => console.log(e));
    }

    const paymentMethodData = () => {
        const axios = apiUrl.get("/chart-of-accounts/get-chart-of-accounts-category/?company="+accounts_company+"&category="+general_ledger);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setSubsidiary_ledger_list(result_data.data);
            } else {
                setSubsidiary_ledger_list([]);
            }
        }).catch((e) => console.log(e));
    }

    const addCashBankBalance = () => {
        setAddCashBankBalanceModel(true);
    }

    const closeCashBankBalanceModel = () => {
        setAddCashBankBalanceModel(false);
        setAccounts_company('');
        setAccounts_branch('');
        setGeneral_ledger('');
        setSubsidiary_ledger('');
        setBalance_amount('');
    }

    const cashBankBalanceCreate = () => {
        if(accounts_company <= 0) {
            setMessage(lang.company_select_warning);
            setWarningModal(true);
            setCash_bank_submit_button(false);
        } else if(accounts_branch <= 0) {
            setMessage(lang.branch_select_warning);
            setWarningModal(true);
            setCash_bank_submit_button(false);
        } else if(general_ledger <= 0) {
            setMessage('Select General Ledger');
            setWarningModal(true);
            setCash_bank_submit_button(false);
        } else if(subsidiary_ledger <= 0) {
            setMessage('Select Subsidiary Ledger');
            setWarningModal(true);
            setCash_bank_submit_button(false);
        } else if(balance_amount <= 0) {
            setMessage('Enter Amount');
            setWarningModal(true);
            setCash_bank_submit_button(false);
        } else {
            const formData = {
                company             : accounts_branch,
                branch              : accounts_branch,
                general_ledger      : general_ledger,
                subsidiary_ledger   : subsidiary_ledger,
                amount              : balance_amount,
            }
            const axios = apiUrl.post("/accounts/add-cash-bank-balance/",formData);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setTimeout(() => {
                        toast.success(result_data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 1000
                        });
                    }, 300);
                    closeCashBankBalanceModel();
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
    }

    const addCashBankBalanceWithdraw = () => {
        setAddCashBankBalanceWithdrawModel(true);
    }

    const closeCashBankBalanceWithdrawModel = () => {
        setAddCashBankBalanceWithdrawModel(false);
        setAccounts_company('');
        setAccounts_branch('');
        setGeneral_ledger('');
        setSubsidiary_ledger('');
        setBalance_amount('');
    }

    const cashBankBalanceWithdrawCreate = () => {
        if(accounts_company <= 0) {
            setMessage(lang.company_select_warning);
            setWarningModal(true);
            setCash_bank_submit_button(false);
        } else if(accounts_branch <= 0) {
            setMessage(lang.branch_select_warning);
            setWarningModal(true);
            setCash_bank_submit_button(false);
        } else if(general_ledger <= 0) {
            setMessage('Select General Ledger');
            setWarningModal(true);
            setCash_bank_submit_button(false);
        } else if(subsidiary_ledger <= 0) {
            setMessage('Select Subsidiary Ledger');
            setWarningModal(true);
            setCash_bank_submit_button(false);
        } else if(balance_amount <= 0) {
            setMessage('Enter Amount');
            setWarningModal(true);
            setCash_bank_submit_button(false);
        } else {
            const formData = {
                company             : accounts_branch,
                branch              : accounts_branch,
                general_ledger      : general_ledger,
                subsidiary_ledger   : subsidiary_ledger,
                amount              : balance_amount,
            }
            const axios = apiUrl.post("/accounts/cash-bank-balance-withdraw/",formData);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setTimeout(() => {
                        toast.success(result_data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 1000
                        });
                    }, 300);
                    closeCashBankBalanceWithdrawModel();
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
    }

    useEffect(() => {
        setTimeout(() => {
            if(user_group == 1 || user_group == 2){
                companyCount();
            }
    
            if(user_group == 1 || user_group == 2 || user_group == 3){
                branchCount();
            }
    
            if(user_group == 3 || user_group == 4 || user_group == 5){
                cashBalance();
                bankBalance();
                salesBalanceData();
                purchaseBalanceData();
            }
    
            if(user_group == 8){
                voucherData();
            }
    
            userCount();
        }, 300);
        

        setCompany(user_company);
        setBranch(user_branch);
        setAccounts_company(user_company);
        setAccounts_branch(user_branch);
        setU_group(user_group);
        setU_language(user_language);
        setU_picture(user_picture);
        setU_name(user_name);
        setU_designation(user_designation);
        
        companyData();
        branchData();
        coaAccountsLinkData();
        paymentTypeData();
        paymentMethodData();
    }, [company, branch, total_company, accounts_company, coa_accounts_link_id, general_ledger]);
    return (
        <Layout>
            <HeaderTitle title={lang.dashboard} keywords="" description=""/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-15">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.dashboard}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/">{lang.dashboard}</Link>
                            </div>
                        </div>
                        <div className="d-flex align-items-center d-print-none">
                            <button type="button" className="btn btn-success rounded-pill mr-2 d-none d-none d-lg-block pd-t-6-force pd-b-5-force" onClick={() => router.push('/purchase/create')}><i className="fal fa-plus"></i> {lang.purchase}</button>&nbsp;
                            <button type="button" className="btn btn-info rounded-pill mr-2 d-none d-none d-lg-block pd-t-6-force pd-b-5-force" onClick={() => router.push('/sales/create')}><i className="fal fa-plus"></i> {lang.sales}</button>&nbsp;
                            <button type="button" className="btn btn-primary rounded-pill mr-2 d-none d-none d-lg-block pd-t-6-force pd-b-5-force" title="Print" onClick={() => router.push('/suppliers/supplier-list')}><i className="fal fa-truck"></i> {lang.suppliers}</button>&nbsp;
                            <button type="button" className="btn btn-danger rounded-pill mr-2 d-none d-none d-lg-block pd-t-6-force pd-b-5-force" title="Excel Export" onClick={() => router.push('/customers/customer-list')}><i className="fal fa-user"></i> {lang.customers}</button>&nbsp;
                        </div>
                    </div>
                </div>
                {/* Breadcrumb End */}

                {/* Content Start */}
                <div className="row clearfix">
                    <div className="col-md-12 mg-b-15">
                        <div className="bg-success tx-14 tx-bold tx-center">
                            <div className="d-grid gap-2">
                                <button type="button" className="btn btn-success tx-uppercase">
                                    {lang.welcome_to} {u_name}, {u_designation}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Content End */}

                {/* Content Start */}
                {
                // SuperAdmin & Admin
                u_group == 1 || u_group == 2?
                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-4 col-xl-4">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.company}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0">{(total_company).toString().padStart(2, '0')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-4">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.project}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0">{(total_branch).toString().padStart(2, '0')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-4">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.users}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0">{(total_user).toString().padStart(2, '0')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                // Company Admin
                (u_group == 3)?
                <>
                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.cash_in_hand}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={cash_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.cash_at_bank}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={bank_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.project}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0">{(total_branch).toString().padStart(2, '0')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.users}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0">{(total_user).toString().padStart(2, '0')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={sales_balance.sales_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.collection}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={sales_balance.sales_paid_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.due}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={sales_balance.sales_due_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.due+' '+lang.collection}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={sales_balance.sales_due_payment} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.purchase}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={purchase_balance.purchase_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.purchase+' '+lang.payment}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={purchase_balance.purchase_paid_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.purchase+' '+lang.due}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={purchase_balance.purchase_due_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.purchase+' '+lang.due+' '+lang.payment}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={purchase_balance.purchase_due_payment} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='#' onClick={()=>{addCashBankBalance()}}>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-money-bill"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.add_balance}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='#' onClick={()=>{addCashBankBalanceWithdraw()}}>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-money-bill-alt"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.balance_withdraw}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/sales/create'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-taco"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.sales}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/purchase/create'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-shopping-bag"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.purchase}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/customers/customer-list'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-user"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.customers}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/suppliers/supplier-list'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-truck"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.suppliers}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/sales/due-collection'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-ethernet"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.due_collection}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/purchase/due-payment'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-file-invoice"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.due_payment}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-danger">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/accounts/day-close'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-times-circle"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.day_close}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                </>
                :
                // Branch Manager
                (u_group == 4)?
                <>
                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.cash_in_hand}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={cash_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.cash_at_bank}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={bank_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.project}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0">{(total_branch).toString().padStart(2, '0')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.users}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0">{(total_user).toString().padStart(2, '0')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={sales_balance.sales_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.collection}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={sales_balance.sales_paid_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.due}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={sales_balance.sales_due_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.due+' '+lang.collection}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={sales_balance.sales_due_payment} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.purchase}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={purchase_balance.purchase_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.purchase+' '+lang.payment}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={purchase_balance.purchase_paid_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.purchase+' '+lang.due}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={purchase_balance.purchase_due_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.purchase+' '+lang.due+' '+lang.payment}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={purchase_balance.purchase_due_payment} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='#' onClick={()=>{addCashBankBalance()}}>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-money-bill"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.add_balance}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='#' onClick={()=>{addCashBankBalanceWithdraw()}}>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-money-bill-alt"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.balance_withdraw}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/sales/create'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-taco"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.sales}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/purchase/create'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-shopping-bag"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.purchase}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/customers/customer-list'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-user"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.customers}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/suppliers/supplier-list'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-truck"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.suppliers}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/sales/due-collection'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-ethernet"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.due_collection}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/purchase/due-payment'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-file-invoice"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.due_payment}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-danger">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/accounts/day-close'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-times-circle"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.day_close}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                </>
                :
                // Sales &  Purchase
                (u_group == 5)?
                <>
                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.cash_in_hand}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={cash_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.cash_at_bank}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={bank_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.project}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0">{(total_branch).toString().padStart(2, '0')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.users}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0">{(total_user).toString().padStart(2, '0')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={sales_balance.sales_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.collection}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={sales_balance.sales_paid_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.due}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={sales_balance.sales_due_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.due+' '+lang.collection}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={sales_balance.sales_due_payment} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.purchase}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={purchase_balance.purchase_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.purchase+' '+lang.payment}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={purchase_balance.purchase_paid_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.purchase+' '+lang.due}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={purchase_balance.purchase_due_amount} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.purchase+' '+lang.due+' '+lang.payment}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={purchase_balance.purchase_due_payment} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='#' onClick={()=>{addCashBankBalance()}}>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-money-bill"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.add_balance}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='#' onClick={()=>{addCashBankBalanceWithdraw()}}>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-money-bill-alt"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.balance_withdraw}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/sales/create'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-taco"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.sales}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/purchase/create'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-shopping-bag"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.purchase}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/customers/customer-list'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-user"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.customers}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/suppliers/supplier-list'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-truck"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.suppliers}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/sales/due-collection'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-ethernet"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.due_collection}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/purchase/due-payment'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-file-invoice"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.due_payment}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-danger">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/accounts/day-close'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-times-circle"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.day_close}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                </>
                :
                // Accounts
                (u_group == 8)?
                <>
                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.cash_in_hand}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={cash_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.cash_at_bank}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={bank_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.project}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0">{(total_branch).toString().padStart(2, '0')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-success">
                            <div className="card-header d-flex align-items-center justify-content-between bg-success">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.users}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0">{(total_user).toString().padStart(2, '0')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={cash_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.collection}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={bank_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.due}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={bank_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-info">
                            <div className="card-header d-flex align-items-center justify-content-between bg-info">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.due+' '+lang.collection}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={bank_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={cash_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.collection}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={bank_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.due}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={bank_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bd-danger">
                            <div className="card-header d-flex align-items-center justify-content-between bg-danger">
                                <h6 className="card-header-title tx-13 mb-0 tx-white tx-uppercase"></h6>
                            </div>
                            <div className="card-body">
                                <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-12 mg-b-2">{lang.today+' '+lang.sales+' '+lang.due+' '+lang.collection}</h5>
                                <div className="">
                                    <h2 className="tx-center tx-20 tx-sm-18 tx-md-24 mg-b-0"><AccountsNumberFormat amount={bank_balance} /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/accounts/add-balance'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-money-bill"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.add_balance}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/accounts/balance-withdraw'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-money-bill-alt"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.balance_withdraw}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/sales/create'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-taco"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.sales}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/purchase/create'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-shopping-bag"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.purchase}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/customers/customer-list'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-user"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.customers}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/suppliers/supplier-list'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-truck"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.suppliers}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/sales/due-collection'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-ethernet"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.due_collection}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="card mg-b-30 bg-success">
                            <div className="card-body">
                                <Link className="text-decoration-none" href='/purchase/due-payment'>
                                    <h5 className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-24 mg-b-2 tx-white"><i className="fal fa-file-invoice"></i></h5>
                                    <div className="">
                                        <p className="tx-center tx-uppercase tx-spacing-1 tx-semibold tx-14 mg-b-2 tx-white">{lang.due_payment}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead className="tx-12 tx-uppercase">
                                <tr>
                                    <th className="tx-center">{lang.sn}</th>
                                    <th className="tx-center">{lang.date}</th>
                                    <th className="tx-center">{lang.voucher_type}</th>
                                    <th className="tx-center">{lang.voucher_no}</th>
                                    <th className="tx-center">{lang.narration}</th>
                                    <th className="tx-center">{lang.debit}</th>
                                    <th className="tx-center">{lang.credit}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voucher_list.length> 0 && voucher_list.map((row, index) => (
                                <tr className='' key={row.accounts_id}>
                                    <td className="tx-center">{(index+1).toString().padStart(2, '0')}</td>
                                    <td className="tx-center">{row.accounts_posting_date}</td>
                                    <td className="tx-center">{row.accounts_voucher_type_name}</td>
                                    <td className="tx-center">{row.accounts_voucher_number}</td>
                                    <td className="tx-left">{row.accounts_narration}</td>
                                    <td className="tx-right"><AccountsNumberFormat amount={row.accounts_total_debit} /></td>
                                    <td className="tx-right"><AccountsNumberFormat amount={row.accounts_total_credit} /></td>
                                </tr>
                                ))}
                                <tr>
                                    <th className="tx-right tx-uppercase" colSpan={5}>{lang.total}</th>
                                    <th className="tx-right"><AccountsNumberFormat amount={total_debit} /></th>
                                    <th className="tx-right"><AccountsNumberFormat amount={total_credit} /></th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                </>
                : ''}
                {/* Content End */}

                {/* Content Start */}
                <div className="row clearfix mt-5 justify-content-center">
                    <div className="col-md-12">
                        <div className="mg-b-30">
                            <div className="card-body tx-center">
                                <Image className="img-fluid wd-80 mg-b-10" src="/assets/images/logo.jpeg" priority={true} alt="" width={120} height={120} />
                                <p className="tx-uppercase tx-bold tx-16">IBC</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Content End */}
            </div>

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
                                        <label className="form-label tx-semibold" htmlFor="general_ledger">{lang.general_ledger}</label>
                                        <select type="text" className="form-control bd-danger" id="general_ledger" name="general_ledger" value={general_ledger} onChange={(e) => setGeneral_ledger(e.target.value)} >
                                            <option value="">{lang.select}</option>
                                            {general_ledger_list.map(row => (
                                            <option key={row.chart_of_accounts_id} value={row.chart_of_accounts_id}>{row.chart_of_accounts_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="subsidiary_ledger">{lang.subsidiary_ledger}</label>
                                        <select type="text" className="form-control bd-danger" id="subsidiary_ledger" name="subsidiary_ledger" value={subsidiary_ledger} onChange={(e) => setSubsidiary_ledger(e.target.value)} >
                                            <option value="">{lang.select}</option>
                                            {subsidiary_ledger_list.map(row => (
                                            <option key={row.chart_of_accounts_id} value={row.chart_of_accounts_id}>{row.chart_of_accounts_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="accounts_company">{lang.company}</label>
                                        <select type="text" className="form-control bd-danger" id="company" name="accounts_company" value={accounts_company} onChange={(e) => setAccounts_company(e.target.value)}>
                                            <option value="">{lang.select}</option>
                                            {company_list.map(company_row => (
                                            <option key={company_row.company_id} value={company_row.company_id}>{company_row.company_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="accounts_branch">{lang.project}</label>
                                        <select type="text" className="form-control bd-danger" id="accounts_branch" name="accounts_branch" value={accounts_branch} onChange={(e) => setAccounts_branch(e.target.value)}>
                                            <option value="">{lang.select}</option>
                                            {branch_list.map(branch_row => (
                                            <option key={branch_row.branch_id} value={branch_row.branch_id}>{branch_row.branch_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="balance_amount">{lang.amount}</label>
                                        <input type="number" className="form-control bd-danger tx-center" id="balance_amount" name="balance_amount" value={balance_amount} onChange={(e) => setBalance_amount(e.target.value)}required />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-top p-2">
                            <button type="button" className="btn btn-sm btn-danger rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => closeCashBankBalanceModel()}><i className="fal fa-times-circle"></i> {lang.close}</button>
                            <button type="submit" className={`btn btn-sm btn-success rounded-pill text-uppercase pd-t-6-force pd-b-5-force ${cash_bank_submit_button?'disabled':''}`} onClick={() => cashBankBalanceCreate()}><i className="fal fa-check-circle"></i> {cash_bank_submit_button?lang.process: lang.save}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Add Cash Bank Modal End*/}

            {/* Cash Bank Withdraw Modal Start*/}
            <div className={`modal fade ${addCashBankBalanceWithdrawModel ? 'show d-block' : ''}`} >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-success m-0 p-2">
                            <h6 className="modal-title text-white">{lang.balance_withdraw}</h6>
                            <button type="button" className="btn-close" onClick={() => closeCashBankBalanceWithdrawModel()}></button>
                        </div>

                        <div className="modal-body m-0 pl-3 pr-3 pt-0">
                            <div className="row">
                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="general_ledger">{lang.general_ledger}</label>
                                        <select type="text" className="form-control bd-danger" id="general_ledger" name="general_ledger" value={general_ledger} onChange={(e) => setGeneral_ledger(e.target.value)} >
                                            <option value="">{lang.select}</option>
                                            {general_ledger_list.map(row => (
                                            <option key={row.chart_of_accounts_id} value={row.chart_of_accounts_id}>{row.chart_of_accounts_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="subsidiary_ledger">{lang.subsidiary_ledger}</label>
                                        <select type="text" className="form-control bd-danger" id="subsidiary_ledger" name="subsidiary_ledger" value={subsidiary_ledger} onChange={(e) => setSubsidiary_ledger(e.target.value)} >
                                            <option value="">{lang.select}</option>
                                            {subsidiary_ledger_list.map(row => (
                                            <option key={row.chart_of_accounts_id} value={row.chart_of_accounts_id}>{row.chart_of_accounts_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="accounts_company">{lang.company}</label>
                                        <select type="text" className="form-control bd-danger" id="company" name="accounts_company" value={accounts_company} onChange={(e) => setAccounts_company(e.target.value)}>
                                            <option value="">{lang.select}</option>
                                            {company_list.map(company_row => (
                                            <option key={company_row.company_id} value={company_row.company_id}>{company_row.company_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-semibold" htmlFor="accounts_branch">{lang.project}</label>
                                        <select type="text" className="form-control bd-danger" id="accounts_branch" name="accounts_branch" value={accounts_branch} onChange={(e) => setAccounts_branch(e.target.value)}>
                                            <option value="">{lang.select}</option>
                                            {branch_list.map(branch_row => (
                                            <option key={branch_row.branch_id} value={branch_row.branch_id}>{branch_row.branch_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="balance_amount">{lang.amount}</label>
                                        <input type="number" className="form-control bd-danger tx-center" id="balance_amount" name="balance_amount" value={balance_amount} onChange={(e) => setBalance_amount(e.target.value)}required />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-top p-2">
                            <button type="button" className="btn btn-sm btn-danger rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => closeCashBankBalanceWithdrawModel()}><i className="fal fa-times-circle"></i> {lang.close}</button>
                            <button type="submit" className={`btn btn-sm btn-success rounded-pill text-uppercase pd-t-6-force pd-b-5-force ${cash_bank_submit_button?'disabled':''}`} onClick={() => cashBankBalanceWithdrawCreate()}><i className="fal fa-check-circle"></i> {cash_bank_submit_button?lang.process: lang.save}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Cash Bank Withdraw Modal End*/}

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

            <ToastContainer />
        </Layout>
    )
}

export default  Home;
