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

const IncomeExpenditure = ()=> {
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

    const [searchButton, setSearchButton]               = useState(false);
    const [warningModal, setWarningModal]               = useState(false);
    const [noteModal, setNoteModal]                     = useState(false);

    const excelExportRef                                = useRef(null);
    const { onDownload } = useDownloadExcel({
        currentTableRef : excelExportRef.current,
        filename        : 'income-expenditure',
        sheet           : 'Income Expenditure'
    });

    const [user_user_group, setUser_user_group]         = useState('');
    const [message, setMassage]                         = useState('');

    const [company_list, setCompany_list]               = useState([]);
    const [branch_list, setBranch_list]                 = useState([]);

    const [company, setCompany]                         = useState(user_company || '');
    const [branch, setBranch]                           = useState(user_branch || '');
    const current_date = new Date();
    const c_month = `${current_date.getFullYear()}-${(current_date.getMonth() + 1).toString().padStart(2, '0')}`;
    const [closing_month, setClosing_month]             = useState(c_month);

    const [company_info, setCompany_info]               = useState('');
    const [branch_info, setBranch_info]                 = useState('');
    const [closing_month_year, setClosing_month_year]   = useState('');
    const [financial_year, setFinancial_year]           = useState('');
    const [income_expenditure_list, setIncome_expenditure_list] = useState([]);
    const [surplus_deficit, setSurplus_deficit]         = useState('');
    const [balance_sheet_note, setBalance_sheet_note]   = useState('');
    const [note_number, setNote_number]                 = useState('');
    const [note_data, setNote_data]                     = useState('');
    const note_data_ledger                              = note_data.subsidiary_ledger || [];

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
        const axios = apiUrl.get("/branch/get-branch-company/"+company);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setBranch_list(result_data.data);
            } else {
                setBranch_list([]);
            }
        }).catch((e) => console.log(e));
    }

    const searchBalanceSheet = ()=> {
        setSearchButton(true);
        if(company <= 0) {
            setMassage(lang.company_select_warning);
            setWarningModal(true);
            setSearchButton(false);
        } else if(branch <= 0) {
            setMassage(lang.branch_select_warning);
            setWarningModal(true);
            setSearchButton(false);
        } else if(closing_month.length <= 0) {
            setMassage(lang.closing_month_select_warning);
            setWarningModal(true);
            setSearchButton(false);
        } else {
            const axios = apiUrl.get("/accounts/income-expenditure/?company="+company+"&branch="+branch+"&closing_month="+closing_month);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setCompany_info(result_data.data.company)
                    setBranch_info(result_data.data.branch)
                    setClosing_month_year(result_data.data.closing_month_year)
                    setFinancial_year(result_data.data.financial_year);
                    setIncome_expenditure_list(result_data.data.coa_data);
                    setSurplus_deficit(result_data.data.surplus_deficit);
                    setBalance_sheet_note(result_data.data.balance_sheet_note);
                    setSearchButton(false);
                } else {
                    setCompany_info('')
                    setBranch_info('')
                    setClosing_month_year('')
                    setFinancial_year('')
                    setIncome_expenditure_list([]);
                    setSurplus_deficit('');
                    setBalance_sheet_note('');
                    setSearchButton(false);
                }
            }).catch((e) => console.log(e));
        }
    }

    const viewNote = (data) => {
        setNote_number(data.note);
        const axios = apiUrl.get("accounts/get-income-expenditure-note/?note="+data.note+"&company="+data.company+"&branch="+data.branch+"&closing_month="+data.closing_month+"&coa="+data.coa);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setNote_data(result_data.data.coa_data);
                console.log('result_data', result_data.data)
            } else {
                setNote_data('');
            }
        }).catch((e) => console.log(e));

        setNoteModal(true);
    }

    const noteModalClose = ()=> {
        setNoteModal(false);
    }

    const printVoucher = (data) => {
        window.open("/voucher/voucher-print/"+data, "Popup", "width=700, height=700");
    }

    useEffect(() => {
        setUser_user_group(user_group);
        companyData();
        branchData();
    }, [company]);

    let income_expenditure_note_cg  = balance_sheet_note.balance_sheet_note_cg || 0;
    let income_expenditure_note_gl  = balance_sheet_note.balance_sheet_note_gl || 0;
    let income_expenditure_note_gl_2= balance_sheet_note.balance_sheet_note_gl || 0;

    return (
        <Layout>
            <HeaderTitle title={lang.income_expenditure} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5 d-print-none">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.income_expenditure}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/voucher">{lang.accounts_report}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.income_expenditure}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center d-print-none">
                            <button type="button" className="btn btn-primary rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.print} onClick={() => window.print()}><i className="fal fa-print"></i></button>
                            {/* <button type="button" className="btn btn-info rounded-pill pd-t-6-force pd-b-5-force" title={lang.excel_export} onClick={onDownload}><i className="fal fa-file-excel"></i></button> */}
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
                                    <label className="form-label tx-uppercase tx-semibold" htmlFor="company">{lang.company}</label>
                                    <select type="text" className="form-control bd-info" id="company" name="company" value={company} onChange={(e) => setCompany(e.target.value)}>
                                        <option value="">{lang.select}</option>
                                        {company_list.map(company_row => (
                                        <option key={company_row.company_id} value={company_row.company_id}>{company_row.company_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-3 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-uppercase tx-semibold" htmlFor="branch">{lang.project}</label>
                                    <select type="text" className="form-control bd-info" id="branch" name="branch" value={branch} onChange={(e) => setBranch(e.target.value)}>
                                        <option value="">{lang.select}</option>
                                        {user_user_group == 1 || user_user_group == 2 || user_user_group == 3?
                                        <option value="all">All</option>
                                        :''}
                                        {branch_list.map(branch_row => (
                                        <option key={branch_row.branch_id} value={branch_row.branch_id}>{branch_row.branch_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-3 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-uppercase tx-semibold" htmlFor="closing_month">{lang.closing_month}</label>
                                    <input type="month" className="form-control bd-info" id="closing_month" name="closing_month" value={closing_month} onChange={(e) => setClosing_month(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-md-3 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-uppercase tx-semibold" htmlFor="search">&nbsp;</label>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className={`btn btn-success pd-t-6-force pd-b-5-force mg-r-3 tx-uppercase ${searchButton?'disabled': ''}`} onClick={() => searchBalanceSheet()}>{searchButton?lang.process: lang.search}</button>
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
                                                    <span className='tx-uppercase tx-16 text-decoration-underline'>{lang.income_expenditure}</span>
                                                </th>
                                                <th className="tx-right" width="30%" valign="top">
                                                    {lang.print}: {new Date().toLocaleString("en-in", { day : '2-digit', month: '2-digit', year:'numeric', hour: "2-digit", minute: "2-digit"})}
                                                </th>
                                            </tr>
                                            <tr className="">
                                                <th className="tx-center tx-uppercase" colSpan="3" valign="top">
                                                    FOR THE MONTH ENDED {new Date(closing_month_year.current_month_closing_date).toLocaleString("en-US", { day : '2-digit', month: 'short', year:'numeric'})}
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
                            : <>
                            {income_expenditure_list.length > 0 ?
                            <>
                            <table className="table-striped table-hover table-centered align-middle table-nowrap" width="100%" ref={excelExportRef}>
                                <thead>
                                    <tr className="tx-uppercase bd-all">
                                        <th className="tx-center bd-all" rowSpan={2} width="28%">{lang.particulars}</th>
                                        <th className="tx-center bd-all" rowSpan={2} width="3%">{lang.notes}</th>
                                        <th className="tx-center" colSpan={8}>{lang.amount} </th>
                                    </tr>
                                    <tr className="text-uppercase bd-all">
                                        <th className="tx-center bd-all" colSpan="2" width="11%">{lang.for_this_month}<br/>{new Date(closing_month_year.current_month_closing_date).toLocaleString("en-US", {month: 'short', year:'2-digit'})}</th>
                                        <th className="tx-center bd-all" colSpan="2" width="11%">{lang.up_to} {lang.last_month}<br/>{new Date(closing_month_year.last_month_closing_date).toLocaleString("en-US", {month: 'short', year:'2-digit'})}</th>
                                        <th className="tx-center bd-all" colSpan="2" width="11%">{lang.for_the_period}<br/>FY {financial_year.financial_year_starting_month == "01"? new Date(closing_month_year.current_year_closing_date).getFullYear() : new Date(closing_month_year.current_year_closing_date).getFullYear()-1+'-'+new Date(closing_month_year.current_year_closing_date).toLocaleString("en-US", {year:'2-digit'})}</th>
                                        <th className="tx-center bd-all" colSpan="2" width="11%">{lang.for_the_period}<br/>FY {financial_year.financial_year_starting_month == "01"? new Date(closing_month_year.last_year_closing_date).getFullYear() : new Date(closing_month_year.last_year_closing_date).getFullYear()-1+'-'+new Date(closing_month_year.last_year_closing_date).toLocaleString("en-US", {year:'2-digit'})}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {income_expenditure_list.map((at_row) => (
                                    <>
                                        <tr key={at_row.accounts_type_id}>
                                            <th className="tx-start text-uppercase" colSpan={10}>{at_row.chart_of_accounts_code} - {at_row.chart_of_accounts_name}</th>
                                        </tr>
                                        {at_row.accounts_category.map((cat_row, index) => (
                                        <>
                                            {/* <tr key={cat_row.chart_of_accounts_id}>
                                                <th className="tx-start" colSpan={2}>{cat_row.chart_of_accounts_code} - {cat_row.chart_of_accounts_name}</th>
                                                <th className="tx-center" width="1%"></th>
                                                <th className="tx-right bd-all"><AccountsNumberFormat amount={cat_row.balance.current_month_balance} /></th>
                                                <th className="tx-center" width="1%"></th>
                                                <th className="tx-right bd-all"><AccountsNumberFormat amount={cat_row.balance.last_month_balance} /></th>
                                                <th className="tx-center" width="1%"></th>
                                                <th className="tx-right bd-all"><AccountsNumberFormat amount={cat_row.balance.current_year_balance} /></th>
                                                <th className="tx-center" width="1%"></th>
                                                <th className="tx-right bd-all"><AccountsNumberFormat amount={cat_row.balance.last_year_balance} /></th>
                                            </tr> */}
                                            {cat_row.control_group.map((cg_row) => (
                                            <>
                                                {/* <tr key={cg_row.chart_of_accounts_id}>
                                                    <td className="tx-start" colSpan={2}>{cg_row.chart_of_accounts_code} - {cg_row.chart_of_accounts_name}</td>
                                                    <td className="tx-center" width="1%">{(++income_expenditure_note_cg).toString().padStart(2, '0')}</td>
                                                    <td className="tx-right"><AccountsNumberFormat amount={cg_row.balance.current_month_balance} /></td>
                                                    <td className="tx-center" width="1%"></td>
                                                    <td className="tx-right"><AccountsNumberFormat amount={cg_row.balance.last_month_balance} /></td>
                                                    <td className="tx-center" width="1%"></td>
                                                    <td className="tx-right"><AccountsNumberFormat amount={cg_row.balance.current_year_balance} /></td>
                                                    <td className="tx-center" width="1%"></td>
                                                    <td className="tx-right"><AccountsNumberFormat amount={cg_row.balance.last_year_balance} /></td>
                                                </tr> */}
                                                {cg_row.general_ledger.map((gl_row) => (
                                                <>
                                                    <tr key={gl_row.chart_of_accounts_id}>
                                                        <td className="tx-start">{gl_row.chart_of_accounts_code} - {gl_row.chart_of_accounts_name}</td>
                                                        <td className="tx-center"><a href="#" onClick={() => viewNote({note: ++income_expenditure_note_gl_2, company: company, branch: branch, closing_month: closing_month, coa: gl_row.chart_of_accounts_id})}>{(++income_expenditure_note_gl).toString().padStart(2, '0')}</a></td>


                                                        <td className="tx-center" width="1%"></td>
                                                        <td className="tx-right"><AccountsNumberFormat amount={gl_row.balance.current_month_balance} /></td>
                                                        <td className="tx-center" width="1%"></td>
                                                        <td className="tx-right"><AccountsNumberFormat amount={gl_row.balance.last_month_balance} /></td>
                                                        <td className="tx-center" width="1%"></td>
                                                        <td className="tx-right"><AccountsNumberFormat amount={gl_row.balance.current_year_balance} /></td>
                                                        <td className="tx-center" width="1%"></td>
                                                        <td className="tx-right"><AccountsNumberFormat amount={gl_row.balance.last_year_balance} /></td>
                                                    </tr>
                                                </>
                                                ))}
                                            </>
                                            ))}
                                        </>
                                        ))}
                                        <tr>
                                            <th className="tx-right text-uppercase" colSpan={2}>{lang.total} {at_row.chart_of_accounts_name}</th>
                                            <th className="tx-center" width="1%"></th>
                                            <th className="tx-right bd-bottom-double"><AccountsNumberFormat amount={at_row.balance.current_month_balance} /></th>
                                            <th className="tx-center" width="1%"></th>
                                            <th className="tx-right bd-bottom-double"><AccountsNumberFormat amount={at_row.balance.last_month_balance} /></th>
                                            <th className="tx-center" width="1%"></th>
                                            <th className="tx-right bd-bottom-double"><AccountsNumberFormat amount={at_row.balance.current_year_balance} /></th>
                                            <th className="tx-center" width="1%"></th>
                                            <th className="tx-right bd-bottom-double"><AccountsNumberFormat amount={at_row.balance.last_year_balance} /></th>
                                        </tr>
                                    </>
                                    ))}

                                    <tr>
                                        <th className="tx-right text-uppercase" colSpan={10}>&nbsp;</th>
                                    </tr>
                                    <tr>
                                        <th className="tx-right text-uppercase" colSpan={2}>{lang.surplus_deficit}</th>
                                        <th className="tx-center" width="1%"></th>
                                        <th className="tx-right bd-bottom-double"><AccountsNumberFormat amount={surplus_deficit.current_month_balance} /></th>
                                        <th className="tx-center" width="1%"></th>
                                        <th className="tx-right bd-bottom-double"><AccountsNumberFormat amount={surplus_deficit.last_month_balance} /></th>
                                        <th className="tx-center" width="1%"></th>
                                        <th className="tx-right bd-bottom-double"><AccountsNumberFormat amount={surplus_deficit.current_year_balance} /></th>
                                        <th className="tx-center" width="1%"></th>
                                        <th className="tx-right bd-bottom-double"><AccountsNumberFormat amount={surplus_deficit.last_year_balance} /></th>
                                    </tr>
                                </tbody>
                            </table>
                            <br/><br/><br/><br/>
                            <table className="" width="100%" align="center">
                                <tbody>
                                    <tr className="text-uppercase">
                                        <th width="20%" className="tx-center bd-top">{lang.prepared_by}</th>
                                        <th width="20%"></th>
                                        <th width="20%" className="tx-center bd-top">{lang.checked_by}</th>
                                        <th width="20%"></th>
                                        <th width="20%" className="tx-center bd-top">{lang.authorized}</th>
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

            {/* Note Modal Start*/}
            <div className={`modal fade zoomIn ${noteModal ? 'show d-block' : ''}`} >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header bg-primary m-0 p-2">
                            <h6 className="modal-title text-white"> {/* {(note_number).toString().padStart(2, '0')}. */} {note_data.chart_of_accounts_name}</h6>
                            <button type="button" className="btn-close" onClick={() => noteModalClose()}></button>
                        </div>

                        <div className="modal-body m-0 pl-3 pr-3 pt-0">
                            <div className="table-responsive mt-3">
                                <table className="table-striped table-hover table-centered align-middle table-nowrap" width="100%">
                                    <thead>
                                        <tr className="tx-uppercase bd-all">
                                            <th className="tx-center bd-all" rowSpan={2} width="28%">{lang.particulars}</th>
                                            <th className="tx-center" colSpan={8}>{lang.amount} </th>
                                        </tr>
                                        <tr className="text-uppercase bd-all">
                                            <th className="tx-center bd-all" colSpan="2" width="11%">{lang.for_this_month}<br/>{new Date(closing_month_year.current_month_closing_date).toLocaleString("en-US", {month: 'short', year:'2-digit'})}</th>
                                            <th className="tx-center bd-all" colSpan="2" width="11%">{lang.up_to} {lang.last_month}<br/>{new Date(closing_month_year.last_month_closing_date).toLocaleString("en-US", {month: 'short', year:'2-digit'})}</th>
                                            <th className="tx-center bd-all" colSpan="2" width="11%">{lang.for_the_period}<br/>FY {financial_year.financial_year_starting_month == "01"? new Date(closing_month_year.current_year_closing_date).getFullYear() : new Date(closing_month_year.current_year_closing_date).getFullYear()-1+'-'+new Date(closing_month_year.current_year_closing_date).toLocaleString("en-US", {year:'2-digit'})}</th>
                                            <th className="tx-center bd-all" colSpan="2" width="11%">{lang.for_the_period}<br/>FY {financial_year.financial_year_starting_month == "01"? new Date(closing_month_year.last_year_closing_date).getFullYear() : new Date(closing_month_year.last_year_closing_date).getFullYear()-1+'-'+new Date(closing_month_year.last_year_closing_date).toLocaleString("en-US", {year:'2-digit'})}</th>
                                        </tr>
                                    </thead>
                                    {note_data_ledger.length > 0 ?
                                    <tbody>
                                        {note_data_ledger.map((sl_row, index) => {
                                        return (
                                        <tr className='' key={sl_row.chart_of_accounts_id}>
                                            <td className="tx-left">{sl_row.chart_of_accounts_code} - {sl_row.chart_of_accounts_name}</td>
                                            <td className="tx-right"><AccountsNumberFormat amount={sl_row.balance.current_month_balance} /></td>
                                            <td className="tx-center" width="1%"></td>
                                            <td className="tx-right"><AccountsNumberFormat amount={sl_row.balance.last_month_balance} /></td>
                                            <td className="tx-center" width="1%"></td>
                                            <td className="tx-right"><AccountsNumberFormat amount={sl_row.balance.current_year_balance} /></td>
                                            <td className="tx-center" width="1%"></td>
                                            <td className="tx-right"><AccountsNumberFormat amount={sl_row.balance.last_year_balance} /></td>
                                        </tr>
                                        )})}
                                        <tr>
                                            <th className="tx-right text-uppercase">{lang.total}</th>
                                            <th className="tx-right bd-top bd-bottom-double"><AccountsNumberFormat amount={note_data.balance.current_month_balance} /></th>
                                            <th className="tx-center" width="1%"></th>
                                            <th className="tx-right bd-top bd-bottom-double"><AccountsNumberFormat amount={note_data.balance.last_month_balance} /></th>
                                            <th className="tx-center" width="1%"></th>
                                            <th className="tx-right bd-top bd-bottom-double"><AccountsNumberFormat amount={note_data.balance.current_year_balance} /></th>
                                            <th className="tx-center" width="1%"></th>
                                            <th className="tx-right bd-top bd-bottom-double"><AccountsNumberFormat amount={note_data.balance.last_year_balance} /></th>
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
                            </div>
                        </div>
                        <div className="modal-footer border-top p-2">
                            <button type="button" className="btn btn-sm btn-danger rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => noteModalClose()}><i className="fal fa-times-circle"></i> {lang.close}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Note Modal End*/}
            <ToastContainer />
        </Layout>
    )
}

export default  IncomeExpenditure;
