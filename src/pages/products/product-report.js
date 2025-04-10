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

const ProductReport = ()=> {
    let user_id, user_group, user_company, user_branch;
    if (typeof window !== 'undefined') {
        user_id         = localStorage.getItem('user_id');
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

    const [searchButton, setSearchButton]               = useState(false);
    
    const [company_list, setCompany_list]               = useState([]);
    const [branch_list, setBranch_list]                 = useState([]);
    const [category_list, setCategory_list]             = useState([]);
    const [brand_list, setBrand_list]                   = useState([]);
    const [type_list, setType_list]                     = useState([]);
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
    const [product_report, setProduct_report]           = useState([]);
    const [company_info, setCompany_info]               = useState('');
    const [branch_info, setBranch_info]                 = useState('');
    const [category_info, setCategory_info]             = useState('');
    const [brand_info, setBrand_info]                   = useState('');
    const [type_info, setType_info]                     = useState('');
    const [company, setCompany]                         = useState(user_company || '');
    const [branch, setBranch]                           = useState(user_branch || '');

    const [category, setCategory]                       = useState('all');
    const [brand, setBrand]                             = useState('all');
    const [type, setType]                               = useState('all');
    const [status, setStatus]                           = useState(1);

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

    const categoryData = () => {
        const axios = apiUrl.get("/product-category/product-category-list-active/"+company);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setCategory_list(result_data.data);
            } else {
                setCategory_list([]);
            }
        }).catch((e) => console.log(e));
    }

    const brandData = () => {
        const axios = apiUrl.get("/product-brand/product-brand-list-active/"+company);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setBrand_list(result_data.data);
            } else {
                setBrand_list([]);
            }
        }).catch((e) => console.log(e));
    }

    const typeData = () => {
        const axios = apiUrl.get("/product-type/product-type-list-active/"+company);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setType_list(result_data.data);
            } else {
                setType_list([]);
            }
        }).catch((e) => console.log(e));
    }

    const searchProductReport = () => {
        setSearchButton(true);
        const axios = apiUrl.get("/product/product-report/?company="+company+"&branch="+branch+"&category="+category+"&brand="+brand+"&type="+type+"&status="+status);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setProduct_report(result_data.data);
                setCompany_info(result_data.company);
                setBranch_info(result_data.branch);
                setCategory_info(result_data.category_data);
                setBrand_info(result_data.brand_data);
                setType_info(result_data.type_data);
                setSearchButton(false);
            } else {
                setProduct_report([]);
                setCompany_info('');
                setBranch_info('');
                setCategory_info('');
                setBrand_info('');
                setType_info('');
                setSearchButton(false);
            }
        }).catch((e) => console.log(e));
    }

    useEffect(() => {
        companyData();
        branchData();
        categoryData();
        brandData();
        typeData();
    }, [company]);

    return (
        
        <Layout>
            <style>
            
        </style>
            <HeaderTitle title={lang.product_report} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5 d-print-none">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.product_report}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/products">{lang.products}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.product_report}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center d-print-none">
                            <button type="button" className="btn btn-primary rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.print} onClick={() => window.print()}><i className="fal fa-print"></i></button>
                        </div>
                    </div>
                </div>
                {/* Breadcrumb End */}

                {/* Content Start */}
                <div className="row">
                    <div className="col-md-12 mg-b-15">
                        <div className="row clearfix d-print-none">
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="company">{lang.company}</label>
                                    <select type="text" className="form-control bd-info" id="company" name="company" value={company} onChange={(e) => setCompany(e.target.value)}>
                                        <option value="">{lang.select}</option>
                                        {company_list.map(company_row => (
                                        <option key={company_row.company_id} value={company_row.company_id}>{company_row.company_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="category">{lang.category}</label>
                                    <select type="text" className="form-control bd-info" id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option value="all">All</option>
                                        {category_list.map(category_row => (
                                        <option key={category_row.product_category_id} value={category_row.product_category_id}>{category_row.product_category_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="brand">{lang.brand}</label>
                                    <select type="text" className="form-control bd-info" id="brand" name="brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
                                        <option value="all">All</option>
                                        {brand_list.map(brand_row => (
                                        <option key={brand_row.product_brand_id} value={brand_row.product_brand_id}>{brand_row.product_brand_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row clearfix mb-3 d-print-none">
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="type">{lang.type}</label>
                                    <select type="text" className="form-control bd-info" id="type" name="type" value={type} onChange={(e) => setType(e.target.value)}>
                                        <option value="all">All</option>
                                        {type_list.map(type_row => (
                                        <option key={type_row.product_type_id} value={type_row.product_type_id}>{type_row.product_type_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-semibold" htmlFor="status">{lang.status}</label>
                                    <select type="text" className="form-control bd-info" id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        {status_list.map(status_row => (
                                        <option key={status_row.status_id} value={status_row.status_id}>{status_row.status_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="form-label tx-uppercase tx-semibold" htmlFor="search">&nbsp;</label>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className={`btn btn-success pd-t-6-force pd-b-5-force mg-r-3 tx-uppercase ${searchButton?'disabled': ''}`} onClick={() => searchProductReport()}>{searchButton?lang.process: lang.search}</button>
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
                                                <span className='tx-uppercase tx-16 text-decoration-underline'>{lang.product_report}</span>
                                            </th>
                                            <th className="tx-right" width="30%" valign="top">
                                                {lang.print}: {new Date().toLocaleString("en-in", { day : '2-digit', month: '2-digit', year:'numeric', hour: "2-digit", minute: "2-digit"})}
                                            </th>
                                        </tr>
                                        <tr className="">
                                            <th className="tx-left" colSpan="3" valign="top">
                                                {lang.category}: {category_info.product_category_name}<br/>
                                                {lang.brand}: {brand_info.product_brand_name}<br/>
                                                {lang.type}: {type_info.product_type_name}<br/>
                                                {lang.status}: {status==1?lang.active:lang.inactive}
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
                            :<>
                            {product_report.length > 0 ?
                            <>
                            <table className="table table-striped table-bordered" width="100%">
                                <thead className="tx-12 tx-uppercase">
                                    <tr>
                                        <th className="tx-center">{lang.sn}</th>
                                        <th className="tx-center">{lang.picture}</th>
                                        <th className="tx-center">{lang.product_code}</th>
                                        <th className="tx-center">{lang.product_name}</th>
                                        <th className="tx-center">{lang.product_model}</th>
                                        <th className="tx-center">{lang.unit}<br/>{lang.price}</th>
                                        <th className="tx-center">{lang.purchase}<br/>{lang.price}</th>
                                        <th className="tx-center">{lang.sales}<br/>{lang.price}</th>
                                        <th className="tx-center">{lang.purchase}<br/>{lang.qty}</th>
                                        <th className="tx-center">{lang.purchase}<br/>{lang.return} {lang.qty}</th>
                                        <th className="tx-center">{lang.sales}<br/>{lang.qty}</th>
                                        <th className="tx-center">{lang.sales}<br/>{lang.return} {lang.qty}</th>
                                        <th className="tx-center">{lang.in_stock}</th>
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
                                    {product_report.map((row, index) => {
                                    return (
                                    <tr className='' key={row.product_id}>
                                        <td className="tx-center">{(index+1).toString().padStart(2, '0')}</td>
                                        <td className="tx-center">
                                            <Image className="img wd-25 wd-sm-25 ht-25 ht-sm-25 rounded-circle" src={`https://${row.product_picture}`} alt="Product Picture" width={50} height={50} />
                                        </td>
                                        <td className="tx-center">{row.product_code}</td>
                                        <td className="tx-left">{row.product_name}</td>
                                        <td className="tx-center">{row.product_model}</td>
                                        <td className="tx-center">{row.product_unit_price}</td>
                                        <td className="tx-center">{row.product_purchase_price}</td>
                                        <td className="tx-center">{row.product_sales_price}</td>
                                        <td className="tx-center">{(row.product_purchase_quantity).toString().padStart(2, '0')} {row.product_unit_code}</td>
                                        <td className="tx-center">{(row.product_return_quantity).toString().padStart(2, '0')} {row.product_unit_code}</td>
                                        <td className="tx-center">{(row.product_sales_quantity).toString().padStart(2, '0')} {row.product_unit_code}</td>
                                        <td className="tx-center">{(row.product_sales_return_quantity).toString().padStart(2, '0')} {row.product_unit_code}</td>
                                        <td className="tx-center">{(row.product_stock_quantity).toString().padStart(2, '0')} {row.product_unit_code}</td>
                                    </tr>
                                    )})}
                                </tbody>
                                }
                            </table>
                            <br/><br/><br/><br/>
                            <table className="" width="100%" align="center">
                                <tbody>
                                    <tr className="text-uppercase">
                                        <th width="20%" className="tx-center"></th>
                                        <th width="20%"></th>
                                        <th width="20%" className="tx-center"></th>
                                        <th width="20%"></th>
                                        <th width="20%" className="tx-center bd-top">{lang.prepared_by}</th>
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
        </Layout>
    );
}

export default ProductReport;