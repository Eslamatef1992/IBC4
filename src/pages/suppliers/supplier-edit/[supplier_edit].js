import {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import Layout from '@/components/layout';

import HeaderTitle from '@/components/header-title';
import getTranslation from '@/languages';
import apiUrl from '@/components/api-url';
import apiUrlFormData from '@/components/api-url-form-data';
import { toast, ToastContainer } from 'react-toastify';
import router from 'next/router';

const SupplierUpdate = ({data})=> {
    let user_id, user_group, user_company, user_branch;
    if (typeof window !== 'undefined') {
        user_id      = localStorage.getItem('user_id');
        user_group      = localStorage.getItem('user_group');
        user_company    = localStorage.getItem('user_company');
        user_branch     = localStorage.getItem('user_branch');

        // user_group =1 Super Admin, user_group =2 Admin, user_group =3 Manager, user_group =4 Accounts User, user_group =5 Sales & Purchase, user_group =6 Sales, user_group =7 Purchase
        if(user_group == 1 || user_group == 2 || user_group == 3 || user_group == 3 || user_group == 4 || user_group == 5) { } else {
            router.replace('/logout');
            return true;
        }
    }
    const lang = getTranslation();

    const [submitButton, setSubmitButton]           = useState(false);
    const [warningModal, setWarningModal]           = useState(false);
    const [successModal, setSuccessModal]           = useState(false);
    const [message, setMassage]                     = useState('');

    const [company_list, setCompany_list]           = useState([]);
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


    const [company, setCompany]                                       = useState(user_company || '');
    const [supplier_id, setSupplier_id]                               = useState('');
    const [supplier_name, setSupplier_name]                           = useState('');
    const [supplier_contact_person, setSupplier_contact_person]       = useState('');
    const [supplier_phone_number, setSupplier_phone_number]           = useState('');
    const [supplier_email, setSupplier_email]                         = useState('');
    const [supplier_address, setSupplier_address]                     = useState('');
    const [supplier_picture_old, setSupplier_picture_old]             = useState('');
    const [supplier_picture, setSupplier_picture]                     = useState(null);
    const [supplier_status, setSupplier_status]                       = useState(1);

    const formSubmit = (e) => {
        e.preventDefault();
        setSubmitButton(true);

        const formData = new FormData();
        formData.append('supplier_company', company);
        formData.append('supplier_name', supplier_name);
        formData.append('supplier_contact_person', supplier_contact_person);
        formData.append('supplier_phone_number', supplier_phone_number);
        formData.append('supplier_email', supplier_email);
        formData.append('supplier_address', supplier_address);
        formData.append('supplier_picture_old', supplier_picture_old);
        formData.append('supplier_picture', supplier_picture);
        formData.append('supplier_status', supplier_status);

        const axios = apiUrlFormData.put("/suppliers/supplier-update/"+data,formData)
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setMassage(result_data.message);
                setSuccessModal(true);
                setSubmitButton(false);
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

    const supplier_Data = () => {
        const axios = apiUrl.get("/suppliers/get-supplier/"+data);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setSupplier_id(result_data.data.supplier_id);
                setCompany(result_data.data.supplier_company);
                setSupplier_name(result_data.data.supplier_name);
                setSupplier_contact_person(result_data.data.supplier_contact_person);
                setSupplier_phone_number(result_data.data.supplier_phone_number);
                setSupplier_email(result_data.data.supplier_email);
                setSupplier_address(result_data.data.supplier_address);
                setSupplier_picture_old(result_data.data.supplier_picture);
                setSupplier_status(result_data.data.supplier_status);
            } else {
                setSupplier_id('');
                setCompany('');
                setSupplier_name('');
                setSupplier_contact_person('');
                setSupplier_phone_number('');
                setSupplier_email('');
                setSupplier_address('');
                setSupplier_picture_old('');
                setSupplier_status('');
            }
        }).catch((e) => console.log(e));
    }

    useEffect(() => {
        supplier_Data();
        companyData();
    }, []);

    return (
        <Layout>
            <HeaderTitle title={lang.supplier_edit} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.supplier_edit}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/suppliers">{lang.suppliers}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.supplier_edit}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center d-print-none">
                            <Link className="btn btn-success rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.supplier_list} href="/suppliers/supplier-list"><i className="fal fa-bars"></i></Link>
                        </div>
                    </div>
                </div>
                {/* Breadcrumb End */}

                {/* Content Start */}
                <div className="row">
                    <form onSubmit={(e) => formSubmit(e)} >
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
                                            <label className="form-label tx-semibold" htmlFor="supplier_name">{lang.supplier_name}</label>
                                            <input type="text" className="form-control bd-danger" id="supplier_name" name="supplier_name" value={supplier_name} onChange={(e) => setSupplier_name(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="supplier_contact_person">{lang.contact_person}</label>
                                            <input type="text" className="form-control bd-danger" id="supplier_contact_person" name="supplier_contact_person" value={supplier_contact_person} onChange={(e) => setSupplier_contact_person(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="supplier_phone_number">{lang.phone_number}</label>
                                            <input type="tel" className="form-control bd-danger" id="supplier_phone_number" name="supplier_phone_number" value={supplier_phone_number} onChange={(e) => setSupplier_phone_number(e.target.value)} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="supplier_email">{lang.email}</label>
                                            <input type="email" className="form-control bd-danger" id="supplier_email" name="supplier_email" value={supplier_email} onChange={(e) => setSupplier_email(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="supplier_address">{lang.address}</label>
                                            <input type="text" className="form-control bd-info" id="supplier_address" name="supplier_address" value={supplier_address} onChange={(e) => setSupplier_address(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="supplier_picture">{lang.picture}</label>
                                            <input type="file" className="form-control bd-info" id="supplier_picture" name="supplier_picture" onChange={(e) => setSupplier_picture(e.target.files[0])} />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="supplier_status">{lang.status}</label>
                                            <select type="text" className="form-control bd-danger" id="supplier_status" name="supplier_status" value={supplier_status} onChange={(e) => setSupplier_status(e.target.value)} required>
                                                {status_list.map(status_row => (
                                                <option key={status_row.status_id} value={status_row.status_id}>{status_row.status_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                                        <div className="form-group">
                                            <div className="d-grid gap-2">
                                                <button type="submit" className={`btn btn-success pd-t-6-force pd-b-5-force mg-r-3 tx-uppercase ${submitButton?'disabled': ''}`} >{submitButton?lang.process: lang.save}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
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
            <ToastContainer />
        </Layout>
    );
}

export const getServerSideProps = async (context) => {
    const data = context.params.supplier_edit;
    return {
        props:{
            data
        }
    }
}
export default SupplierUpdate;