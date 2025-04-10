import {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import Layout from '@/components/layout';

import HeaderTitle from '@/components/header-title';
import getTranslation from '@/languages';
import apiUrl from '@/components/api-url';
import apiUrlFormData from '@/components/api-url-form-data';
import { toast, ToastContainer } from 'react-toastify';
import router from 'next/router';

const ProductCreate = ()=> {
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
    const [message, setMassage]                     = useState('');
    const [user_user_group, setUser_user_group]     = useState('');

    const [company_list, setCompany_list]                           = useState([]);
    const [product_category_list, setProduct_category_list]         = useState([]);
    const [product_brand_list, setProduct_brand_list]               = useState([]);
    const [product_type_list, setProduct_type_list]                 = useState([]);
    const [product_unit_list, setProduct_unit_list]                 = useState([]);
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


    const [company, setCompany]                                     = useState(user_company || '');
    const [product_code, setProduct_code]                           = useState('');
    const [product_model, setProduct_model]                         = useState('');
    const [product_name, setProduct_name]                           = useState('');
    const [product_description, setProduct_description]             = useState('');
    const [product_category, setProduct_category]                   = useState('');
    const [product_brand, setProduct_brand]                         = useState('');
    const [product_type, setProduct_type]                           = useState('');
    const [product_unit, setProduct_unit]                           = useState('');
    const [product_unit_price, setProduct_unit_price]               = useState('');
    const [product_purchase_price, setProduct_purchase_price]       = useState('');
    const [product_sales_price, setProduct_sales_price]             = useState('');
    const [product_purchase_discount, setProduct_purchase_discount] = useState('');
    const [product_sales_discount, setProduct_sales_discount]       = useState('');
    const [product_purchase_tax, setProduct_purchase_tax]           = useState('');
    const [product_sales_tax, setProduct_sales_tax]                 = useState('');
    const [product_purchase_vat, setProduct_purchase_vat]           = useState('');
    const [product_sales_vat, setProduct_sales_vat]                 = useState('');
    const [product_picture, setProduct_picture]                     = useState(null);
    const [product_status, setProduct_status]                       = useState(1);

    const formSubmit = (e) => {
        e.preventDefault();
        setSubmitButton(true);

        const formData = new FormData();
        formData.append('product_company', company);
        formData.append('product_code', product_code);
        formData.append('product_name', product_name);
        formData.append('product_model', product_model);
        formData.append('product_description', product_description);
        formData.append('product_category', product_category);
        formData.append('product_brand', product_brand);
        formData.append('product_type', product_type);
        formData.append('product_unit', product_unit);
        formData.append('product_unit_price', product_unit_price);
        formData.append('product_purchase_price', product_purchase_price);
        formData.append('product_sales_price', product_sales_price);
        formData.append('product_purchase_discount', product_purchase_discount);
        formData.append('product_sales_discount', product_sales_discount);
        formData.append('product_purchase_tax', product_purchase_tax);
        formData.append('product_sales_tax', product_sales_tax);
        formData.append('product_purchase_vat', product_purchase_vat);
        formData.append('product_sales_vat', product_sales_vat);
        formData.append('product_picture', product_picture);
        formData.append('product_status', product_status);

        const axios = apiUrlFormData.post("/product/product-create/",formData)
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setMassage(result_data.message);
                setSuccessModal(true);
                setSubmitButton(false);
                setProduct_code('');
                setProduct_name('');
                setProduct_model('');
                setProduct_description('');
                setProduct_category('');
                setProduct_brand('');
                setProduct_type('');
                setProduct_unit('');
                setProduct_unit_price('');
                setProduct_purchase_price('');
                setProduct_sales_price('');
                setProduct_purchase_discount('');
                setProduct_sales_discount('');
                setProduct_purchase_tax('');
                setProduct_sales_tax('');
                setProduct_purchase_vat('');
                setProduct_sales_vat('');
                setProduct_status(1);
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

    const product_categoryData = () => {
        if(company > 0) {
            const axios = apiUrl.get("/product-category/product-category-list-active/"+company);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setProduct_category_list(result_data.data);
                } else {
                    setProduct_category_list([]);
                }
            }).catch((e) => console.log(e));
        } else {
            setProduct_category_list([]);
        }
    }

    const product_brandData = () => {
        if(company > 0) {
        const axios = apiUrl.get("/product-brand/product-brand-list-active/"+company);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setProduct_brand_list(result_data.data);
                } else {
                    setProduct_brand_list([]);
                }
            }).catch((e) => console.log(e));
        } else {
            setProduct_brand_list([]);
        }
    }

    const product_typeData = () => {
        if(company > 0) {
            const axios = apiUrl.get("/product-type/product-type-list-active/"+company);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setProduct_type_list(result_data.data);
                } else {
                    setProduct_type_list([]);
                }
            }).catch((e) => console.log(e));
        } else {
            setProduct_type_list([]);
        }
    }

    const product_unitData = () => {
        if(company > 0) {
            const axios = apiUrl.get("/product-unit/product-unit-list-active/"+company);
            axios.then((response) => {
                const result_data = response.data;
                if(result_data.status == 1){
                    setProduct_unit_list(result_data.data);
                } else {
                    setProduct_unit_list([]);
                }
            }).catch((e) => console.log(e));
        } else {
            setProduct_unit_list([]);
        }
    }

    useEffect(() => {
        setUser_user_group(user_group);
        companyData();
        product_categoryData();
        product_brandData();
        product_typeData();
        product_unitData();
    }, [company]);

    return (
        <Layout>
            <HeaderTitle title={lang.new_product} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.new_product}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/products">{lang.products}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.new_product}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center d-print-none">
                            <Link className="btn btn-success rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.product_list} href="/products/product-list"><i className="fal fa-bars"></i></Link>
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
                                            <label className="form-label tx-semibold" htmlFor="product_code">{lang.product_code}</label>
                                            <input type="text" className="form-control bd-danger" id="product_code" name="product_code" value={product_code} onChange={(e) => setProduct_code(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_name">{lang.product_name}</label>
                                            <input type="text" className="form-control bd-danger" id="product_name" name="product_name" value={product_name} onChange={(e) => setProduct_name(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_model">{lang.product_model}</label>
                                            <input type="text" className="form-control bd-info" id="product_model" name="product_model" value={product_model} onChange={(e) => setProduct_model(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_description">{lang.description}</label>
                                            <textarea type="text" className="form-control bd-info" id="product_description" name="product_description" value={product_description} rows={3} onChange={(e) => setProduct_description(e.target.value)}></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_category">{lang.product_category}</label>
                                            <select type="text" className="form-control bd-info" id="product_category" name="product_category" value={product_category} onChange={(e) => setProduct_category(e.target.value)}>
                                                <option value="">{lang.select}</option>
                                                {product_category_list.map(category_row => (
                                                <option key={category_row.product_category_id} value={category_row.product_category_id}>{category_row.product_category_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_brand">{lang.product_brand}</label>
                                            <select type="text" className="form-control bd-info" id="product_brand" name="product_brand" value={product_brand} onChange={(e) => setProduct_brand(e.target.value)}>
                                                <option value="">{lang.select}</option>
                                                {product_brand_list.map(brand_row => (
                                                <option key={brand_row.product_brand_id} value={brand_row.product_brand_id}>{brand_row.product_brand_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_type">{lang.product_type}</label>
                                            <select type="text" className="form-control bd-info" id="product_type" name="product_type" value={product_type} onChange={(e) => setProduct_type(e.target.value)}>
                                                <option value="">{lang.select}</option>
                                                {product_type_list.map(type_row => (
                                                <option key={type_row.product_type_id} value={type_row.product_type_id}>{type_row.product_type_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_unit">{lang.product_unit}</label>
                                            <select type="text" className="form-control bd-info" id="product_unit" name="product_unit" value={product_unit} onChange={(e) => setProduct_unit(e.target.value)}>
                                                <option value="">{lang.select}</option>
                                                {product_unit_list.map(unit_row => (
                                                <option key={unit_row.product_unit_id} value={unit_row.product_unit_id}>{unit_row.product_unit_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_unit_price">{lang.unit_price}</label>
                                            <input type="text" className="form-control bd-info" id="product_unit_price" name="product_unit_price" value={product_unit_price} onChange={(e) => setProduct_unit_price(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_purchase_price">{lang.purchase_price}</label>
                                            <input type="text" className="form-control bd-info" id="product_purchase_price" name="product_purchase_price" value={product_purchase_price} onChange={(e) => setProduct_purchase_price(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_sales_price">{lang.sales_price}</label>
                                            <input type="text" className="form-control bd-info" id="product_sales_price" name="product_sales_price" value={product_sales_price} onChange={(e) => setProduct_sales_price(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_purchase_discount">{lang.purchase_discount} (%)</label>
                                            <input type="text" className="form-control bd-info" id="product_purchase_discount" name="product_purchase_discount" value={product_purchase_discount} onChange={(e) => setProduct_purchase_discount(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_sales_discount">{lang.sales_discount} (%)</label>
                                            <input type="text" className="form-control bd-info" id="product_sales_discount" name="product_sales_discount" value={product_sales_discount} onChange={(e) => setProduct_sales_discount(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_purchase_tax">{lang.purchase_tax} (%)</label>
                                            <input type="text" className="form-control bd-info" id="product_purchase_tax" name="product_purchase_tax" value={product_purchase_tax} onChange={(e) => setProduct_purchase_tax(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_sales_tax">{lang.sales_tax} (%)</label>
                                            <input type="text" className="form-control bd-info" id="product_sales_tax" name="product_sales_tax" value={product_sales_tax} onChange={(e) => setProduct_sales_tax(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_purchase_vat">{lang.purchase_vat} (%)</label>
                                            <input type="text" className="form-control bd-info" id="product_purchase_vat" name="product_purchase_vat" value={product_purchase_vat} onChange={(e) => setProduct_purchase_vat(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_sales_vat">{lang.sales_vat} (%)</label>
                                            <input type="text" className="form-control bd-info" id="product_sales_vat" name="product_sales_vat" value={product_sales_vat} onChange={(e) => setProduct_sales_vat(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_picture">{lang.product_picture}</label>
                                            <input type="file" className="form-control bd-info" id="product_picture" name="product_picture" onChange={(e) => setProduct_picture(e.target.files[0])} />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_status">{lang.status}</label>
                                            <select type="text" className="form-control bd-danger" id="product_status" name="product_status" value={product_status} onChange={(e) => setProduct_status(e.target.value)} required>
                                                {status_list.map(status_row => (
                                                <option key={status_row.status_id} value={status_row.status_id}>{status_row.status_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label tx-semibold" htmlFor="product_status">&nbsp;</label>
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

export default ProductCreate;