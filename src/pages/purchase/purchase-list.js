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

const PurchaseList = ()=> {
    let user_id, user_group, user_company, user_branch;
    if (typeof window !== 'undefined') {
        user_id         = localStorage.getItem('user_id');
        user_group      = localStorage.getItem('user_group');
        user_company    = localStorage.getItem('user_company');
        user_branch    = localStorage.getItem('user_branch');

        // user_group =1 Super Admin, user_group =2 Admin, user_group =3 Manager, user_group =4 Accounts User, user_group =5 Sales & Purchase, user_group =6 Sales, user_group =7 Purchase
        if(user_group == 1 || user_group == 2 || user_group == 3 || user_group == 3 || user_group == 4 || user_group == 5 || user_group == 6) { } else {
            router.replace('/logout');
            return true;
        }
    }

    const lang = getTranslation();

    const [submitButton, setSubmitButton]             = useState(false);
    const [warningModal, setWarningModal]           = useState(false);
    const [message, setMassage]                     = useState('');

    const excelExportRef                        = useRef(null);
    const { onDownload } = useDownloadExcel({
        currentTableRef : excelExportRef.current,
        filename        : 'purchase-list',
        sheet           : 'Purchase List'
    });

    const [purchase_id, setPurchase_id]         = useState('');
    const [user_user_group, setUser_user_group]         = useState('');
    const [showFormModal, setShowFormModal]             = useState(false);
    const [showFormModalDelete, setShowFormModalDelete] = useState(false);
    const [company_list, setCompany_list]               = useState([]);
    const [branch_list, setBranch_list]                 = useState([]);
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

    const [purchase_list, setPurchase_list]             = useState([]);

    const total_payable_amount  = purchase_list.reduce((debit, data) => debit + parseFloat((data.purchase_payable_amount)), 0);
    const total_paid_amount = purchase_list.reduce((credit, data) => credit + parseFloat((data.purchase_paid_amount)), 0);
    const total_due_amount      = purchase_list.reduce((credit, data) => credit + parseFloat((data.purchase_due_amount)), 0);

    const [company, setCompany]                         = useState(user_company || '');
    const [branch, setBranch]                           = useState(user_branch || '');
    const [from_date, setFrom_date]                     = useState(new Date().toISOString().split('T')[0]);
    const [to_date, setTo_date]                         = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus]                           = useState('all');
    const [search, setSearch]                           = useState('');

    const formModalDelete = (primary_id) => {
        setPurchase_id(primary_id);
        setShowFormModalDelete(true);
    }

    const FormModalDeleteClose = () => {
        setPurchase_id(0);

        setShowFormModalDelete(false);
    }

    const formSubmitDelete = (delete_id) => {
        const axios = apiUrl.delete("/purchase/purchase-delete/"+delete_id,)
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                const deleteArray = purchase_list.filter((data) => data.purchase_id !== delete_id);
                setPurchase_list(deleteArray);
                setTimeout(() => {
                    toast.success(result_data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000
                    });
                }, 300);
                setPurchase_id(0);
                setShowFormModalDelete(false);
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

    const searchPurchase = () => {
        if(company <= 0) {
            setMassage('Select Company');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(branch <= 0 && branch !== 'all') {
            setMassage('Select Branch');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(from_date.length <= 0) {
            setMassage('Choose From Date');
            setWarningModal(true);
            setSubmitButton(false);
        } else if(to_date.length <= 0) {
            setMassage('Choose To Date');
            setWarningModal(true);
            setSubmitButton(false);
        } else {
            setSubmitButton(true);
            const axios = apiUrl.get("/purchase/purchase-list/?company="+company+"&branch="+branch+"&from_date="+from_date+"&to_date="+to_date+"&status="+status+"&search="+search);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setPurchase_list(result_data.data);
                    setSubmitButton(false);
                } else {
                    setPurchase_list([]);
                    setSubmitButton(false);
                }
            }).catch((e) => console.log(e));
        }
    }

    const viewInvoice = (data) => {
        window.open("/purchase/purchase-invoice/"+data, "Popup", "width=700, height=700");
    }

    const viewReceipt = (data) => {
        window.open("/purchase/purchase-receipt/"+data, "Popup", "width=700, height=700");
    }

    useEffect(() => {
        setUser_user_group(user_group);
        companyData();
        branchData();
    }, [company]);

    return (
        <Layout>
            <HeaderTitle title={lang.purchase_list} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.purchase_list}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/purchase">{lang.purchase}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.purchase_list}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center d-print-none">
                            {user_user_group == 1 || user_user_group == 2 || user_user_group == 3 || user_user_group == 4 || user_user_group == 5 || user_user_group == 6?
                            <Link className="btn btn-success rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.new_purchase} href="/purchase/create"><i className="fal fa-plus"></i></Link>
                            : ''}
                            <button type="button" className="btn btn-primary rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.print} onClick={() => window.print()}><i className="fal fa-print"></i></button>
                            <button type="button" className="btn btn-info rounded-pill pd-t-6-force pd-b-5-force" title={lang.excel_export} onClick={onDownload}><i className="fal fa-file-excel"></i></button>
                        </div>
                    </div>
                </div>
                {/* Breadcrumb End */}

                {/* Content Start */}
                <div className="row">
                    <div className="col-md-12 mg-b-15">
                        <div className="row clearfix mb-3 d-print-none">
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-uppercase tx-semibold" htmlFor="search">{lang.search}</label>
                                    <input type="text" className="form-control bd-info" id="search" name="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
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
                            <div className="col-md-4 col-sm-12 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="branch">{lang.project}</label>
                                    <select type="text" className="form-control bd-info" id="branch" name="branch" value={branch} onChange={(e) => setBranch(e.target.value)} required>
                                        <option value="">{lang.select}</option>
                                        {user_user_group == 1 || user_user_group == 2 || user_user_group == 3 || user_user_group == 4 || user_user_group == 5?
                                        <option value="all">All</option>
                                        :''}
                                        {branch_list.map(branch_row => (
                                        <option key={branch_row.branch_id} value={branch_row.branch_id}>{branch_row.branch_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row clearfix mb-3 d-print-none">
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-uppercase tx-semibold" htmlFor="from_date">{lang.from_date}</label>
                                    <input type="date" className="form-control bd-info" id="from_date" name="from_date" value={from_date} onChange={(e) => setFrom_date(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-uppercase tx-semibold" htmlFor="to_date">{lang.to_date}</label>
                                    <input type="date" className="form-control bd-info" id="search" name="to_date" value={to_date} onChange={(e) => setTo_date(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-md-2 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-uppercase tx-semibold" htmlFor="status">{lang.status}</label>
                                    <select type="text" className="form-control bd-info" id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="all">All</option>
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
                                        <button type="submit" className={`btn btn-success pd-t-6-force pd-b-5-force mg-r-3 tx-uppercase ${submitButton?'disabled': ''}`} onClick={() => searchPurchase()}>{submitButton?lang.process: lang.search}</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped table-bordered" ref={excelExportRef}>
                                <thead className="tx-12 tx-uppercase">
                                    <tr>
                                        <th className="tx-center">{lang.sn}</th>
                                        <th className="tx-center">{lang.date}</th>
                                        <th className="tx-center">{lang.invoice}</th>
                                        <th className="tx-center">{lang.warehouse}</th>
                                        <th className="tx-center">{lang.supplier}</th>
                                        <th className="tx-center">{lang.purchase}</th>
                                        <th className="tx-center">{lang.paid}</th>
                                        <th className="tx-center">{lang.due}</th>
                                        <th className="tx-center">{lang.status}</th>
                                        {user_user_group == 1 || user_user_group == 2 || user_user_group == 3 || user_user_group == 4 || user_user_group == 5 || user_user_group == 6?
                                        <th className="tx-center d-print-none">{lang.option}</th>
                                        :''}
                                    </tr>
                                </thead>
                                {submitButton?
                                <tbody>
                                    <tr className=''>
                                        <th className="tx-center d-print-none" colSpan={15}>
                                            <Image src="/assets/images/loading/loader.gif" alt="Loading" width={40} height={40} />
                                        </th>
                                    </tr>
                                </tbody>
                                :
                                <tbody>
                                    {purchase_list.map((row, index) => {
                                    return (
                                    <tr className='' key={row.purchase_id}>
                                        <td className="tx-center">{(index+1).toString().padStart(2, '0')}</td>
                                        <td className="tx-center">{new Date(row.purchase_date).toLocaleString('en-in', {day: '2-digit', month:'2-digit', year: 'numeric'})}</td>
                                        <td className="tx-center">{row.purchase_invoice}</td>
                                        <td className="tx-left">{row.purchase_warehouse_name}</td>
                                        <td className="tx-left">{row.purchase_supplier_name}</td>
                                        <td className="tx-right"><AccountsNumberFormat amount={row.purchase_payable_amount}/></td>
                                        <td className="tx-right"><AccountsNumberFormat amount={row.purchase_paid_amount}/></td>
                                        <td className="tx-right"><AccountsNumberFormat amount={row.purchase_due_amount}/></td>
                                        <td className="tx-center">{row.purchase_status==1?lang.active:lang.inactive}</td>
                                        <td className="tx-center d-print-none">
                                            <Link className="text-info mg-r-3" href="#" onClick={()=> viewReceipt(row.purchase_id)} title={lang.receipt}><i className="fas fa-file-invoice-dollar wd-16 mr-2"></i></Link>
                                            <Link className="text-warning mg-r-3" href="#" onClick={()=> viewInvoice(row.purchase_id)} title={lang.invoice}><i className="fas fa-file-invoice wd-16 mr-2"></i></Link>
                                            {user_user_group == 1 || user_user_group == 2 || user_user_group == 3 || user_user_group == 4 || user_user_group == 5?
                                            <Link className="text-primary mg-r-3" href={`/purchase/purchase-edit/${row.purchase_id}`} title={lang.edit}><i className="fas fa-pencil wd-16 mr-2"></i></Link>
                                            :''}
                                            {/* {user_user_group == 1 ?
                                            <Link className="text-danger" href="#" title={lang.remove} onClick={() => formModalDelete(row.purchase_id)}><i className="fas fa-times wd-16 mr-2"></i></Link>
                                            :''} */}
                                        </td>
                                    </tr>
                                    )})}
                                    <tr>
                                        <th className="tx-right tx-uppercase" colSpan={5}>{lang.total}</th>
                                        <th className="tx-right"><AccountsNumberFormat amount={total_payable_amount} /></th>
                                        <th className="tx-right"><AccountsNumberFormat amount={total_paid_amount} /></th>
                                        <th className="tx-right"><AccountsNumberFormat amount={total_due_amount} /></th>
                                        <th className="tx-right"></th>
                                        <th className="tx-right d-print-none"></th>
                                    </tr>
                                </tbody>
                                }
                            </table>
                        </div>
                    </div>
                </div>
                {/* Content End */}
            </div>

            {/* Form Modal Delete Start*/}
            <div className={`modal fade ${showFormModalDelete ? 'show d-block' : ''}`} >
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-primary m-0 p-2">
                            <h6 className="modal-title text-white">{lang.delete} {lang.purchase}</h6>
                            <button type="button" className="btn-close" onClick={() => FormModalDeleteClose()}></button>
                        </div>

                        <div className="modal-body m-0 pl-3 pr-3 pt-0">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="tx-center tx-50 tx-warning">
                                        <i className="fal fa-exclamation-circle"></i>
                                    </div>
                                    <h4 className="tx-danger tx-uppercase tx-13 tx-center">Do You Want to Delete?</h4>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-top p-2">
                            <button type="submit" className="btn btn-sm btn-success rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => formSubmitDelete(purchase_id)}><i className="fal fa-check-circle"></i> {lang.yes}</button>
                            <button type="button" className="btn btn-sm btn-danger rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => FormModalDeleteClose()}><i className="fal fa-times-circle"></i> {lang.no}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Form Modal Delete End*/}

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
    )
}

export default  PurchaseList;
