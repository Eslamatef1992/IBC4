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

const ProductList = ()=> {
    let user_id, user_group, user_company;
    if (typeof window !== 'undefined') {
        user_id         = localStorage.getItem('user_id');
        user_group      = localStorage.getItem('user_group');
        user_company    = localStorage.getItem('user_company');

        // user_group =1 Super Admin, user_group =2 Admin, user_group =3 Manager, user_group =4 Accounts User, user_group =5 Sales & Purchase, user_group =6 Sales, user_group =7 Purchase
        if(user_group == 1 || user_group == 2 || user_group == 3 || user_group == 4 || user_group == 5 || user_group == 6 || user_group == 7) { } else {
            router.replace('/logout');
            return true;
        }
    }

    const lang = getTranslation();

    const [onProcess, setOnProcess]             = useState(false);

    const excelExportRef                        = useRef(null);
    const { onDownload } = useDownloadExcel({
        currentTableRef : excelExportRef.current,
        filename        : 'product-list',
        sheet           : 'Product List'
    });

    const [product_id, setProduct_id]         = useState('');
    const [user_user_group, setUser_user_group]         = useState('');
    const [showFormModal, setShowFormModal]             = useState(false);
    const [showBarcodeModal, setShowBarcodeModal]       = useState(false);
    const [showFormModalDelete, setShowFormModalDelete] = useState(false);
    const [company_list, setCompany_list]               = useState([]);
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

    const [product_list, setProduct_list]                 = useState([]);

    const [company, setCompany]                         = useState(user_company || '');
    const [status, setStatus]                           = useState('all');
    const [search, setSearch]                           = useState('');
    const [barcode_quantity, setBarcode_quantity]       = useState('');
    const [product_barcode, setProduct_barcode]       = useState('');

    const formModalDelete = (primary_id) => {
        setProduct_id(primary_id);
        setShowFormModalDelete(true);
    }

    const FormModalDeleteClose = () => {
        setProduct_id(0);

        setShowFormModalDelete(false);
    }

    const formSubmitDelete = (delete_id) => {
        const axios = apiUrl.delete("/product/product-delete/"+delete_id,)
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                const deleteArray = product_list.filter((data) => data.product_id !== delete_id);
                setProduct_list(deleteArray);
                setTimeout(() => {
                    toast.success(result_data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000
                    });
                }, 300);
                setProduct_id(0);
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

    const productData = () => {
        setOnProcess(true);
        const axios = apiUrl.get("/product/product-list/?company="+company+"&status="+status+"&search="+search);
        axios.then((response) => {
            const result_data = response.data;
            if(result_data.status == 1){
                setProduct_list(result_data.data);
                setOnProcess(false);
            } else {
                setProduct_list([]);
                setOnProcess(false);
            }
        }).catch((e) => console.log(e));
    }
    
    const barcodeModal = (p_id, b_quantity, p_barcode) => {
        setProduct_id(p_id);
        setBarcode_quantity(b_quantity>0?b_quantity:0);
        setProduct_barcode(p_barcode);
        setShowBarcodeModal(true);
    }

    const barcodeModalClose = () => {
        setProduct_id(0);
        setBarcode_quantity(0);
        setShowBarcodeModal(false);
    }

    const generateBarcode = (p_id, b_quantity, p_barcode) => {
        setProduct_id(p_id);
        setBarcode_quantity(b_quantity>0?b_quantity:0);
        setProduct_barcode(p_barcode);
        window.open("/products/barcode-generate/?product="+product_id+"&quantity="+barcode_quantity+"&barcode="+product_barcode, "Popup", "width=700, height=700");
    }

    useEffect(() => {
        setUser_user_group(user_group);
        companyData();
        productData();
    }, [company, status, search]);

    return (
        <Layout>
            <HeaderTitle title={lang.product_list} keywords='' description=''/>
            <div id="main-wrapper" className="full-page">
                {/* Breadcrumb Start */}
                <div className="pageheader pd-t-15 pd-b-10">
                    <div className="d-flex justify-content-between">
                        <div className="clearfix">
                            <div className="pd-t-5 pd-b-5">
                                <h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">{lang.product_list}</h2>
                            </div>
                            <div className="breadcrumb pd-0 mg-0 d-print-none">
                                <Link className="breadcrumb-item" href="/"><i className="fal fa-home"></i> {lang.home}</Link>
                                <Link className="breadcrumb-item" href="/products">{lang.products}</Link>
                                <span className="breadcrumb-item hidden-xs active">{lang.product_list}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center d-print-none">
                            {user_user_group == 1 || user_user_group == 2 || user_user_group == 3 || user_user_group == 4 || user_user_group == 5 || user_user_group == 6 || user_user_group == 7?
                            <Link className="btn btn-success rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.new_product} href="/products/create"><i className="fal fa-plus"></i></Link>
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
                            <div className="col-md-4 mt-3">
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
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped table-bordered" ref={excelExportRef}>
                                <thead className="tx-12 tx-uppercase">
                                    <tr>
                                        <th className="tx-center">{lang.sn}</th>
                                        <th className="tx-center">{lang.picture}</th>
                                        <th className="tx-center">{lang.product_code}</th>
                                        <th className="tx-center">{lang.product_name}</th>
                                        <th className="tx-center">{lang.product_model}</th>
                                        <th className="tx-center">{lang.category}</th>
                                        <th className="tx-center">{lang.brand}</th>
                                        <th className="tx-center">{lang.type}</th>
                                        <th className="tx-center">{lang.purchase}</th>
                                        <th className="tx-center">{lang.purchase}<br/>{lang.return}</th>
                                        <th className="tx-center">{lang.sales}</th>
                                        <th className="tx-center">{lang.sales}<br/>{lang.return}</th>
                                        <th className="tx-center">{lang.in_stock}</th>
                                        <th className="tx-center">{lang.status}</th>
                                        {user_user_group == 1 || user_user_group == 2 || user_user_group == 3 || user_user_group == 4 || user_user_group == 5 || user_user_group == 6 || user_user_group == 7?
                                        <th className="tx-center d-print-none">{lang.option}</th>
                                        :''}
                                    </tr>
                                </thead>
                                {onProcess?
                                <tbody>
                                    <tr className=''>
                                        <th className="tx-center d-print-none" colSpan={15}>
                                            <Image src="/assets/images/loading/loader.gif" alt="Loading" width={40} height={40} />
                                        </th>
                                    </tr>
                                </tbody>
                                :
                                <tbody>
                                    {product_list.map((row, index) => {
                                    return (
                                    <tr className='' key={row.product_id}>
                                        <td className="tx-center">{(index+1).toString().padStart(2, '0')}</td>
                                        <td className="tx-center">
                                            <Image className="img wd-25 wd-sm-25 ht-25 ht-sm-25 rounded-circle" src={`https://${row.product_picture}`} alt="Product Picture" width={50} height={50} />
                                        </td>
                                        <td className="tx-center">{row.product_code}</td>
                                        <td className="tx-left">{row.product_name}</td>
                                        <td className="tx-center">{row.product_model}</td>
                                        <td className="tx-left">{row.product_category_name}</td>
                                        <td className="tx-left">{row.product_brand_name}</td>
                                        <td className="tx-left">{row.product_type_name}</td>
                                        <td className="tx-center">{(row.product_purchase_quantity).toString().padStart(2, '0')} {row.product_unit_code}</td>
                                        <td className="tx-center">{(row.product_return_quantity).toString().padStart(2, '0')} {row.product_unit_code}</td>
                                        <td className="tx-center">{(row.product_sales_quantity).toString().padStart(2, '0')} {row.product_unit_code}</td>
                                        <td className="tx-center">{(row.product_sales_return_quantity).toString().padStart(2, '0')} {row.product_unit_code}</td>
                                        <td className="tx-center">{(row.product_stock_quantity).toString().padStart(2, '0')} {row.product_unit_code}</td>
                                        <td className="tx-center">{row.product_status==1?lang.active:lang.inactive}</td>
                                        <td className="tx-center d-print-none">
                                            <Link className="text-dark mg-r-3" href="#" onClick={()=> {barcodeModal(row.product_id, row.product_stock_quantity, row.product_barcode)}} title={lang.barcode}><i className="fas fa-barcode wd-16 mr-2"></i></Link>
                                            {user_user_group == 1 || user_user_group == 2 || user_user_group == 3 || user_user_group == 4 || user_user_group == 5?
                                            <Link className="text-primary mg-r-3" href={`/products/product-edit/${row.product_id}`} title={lang.edit}><i className="fas fa-pencil wd-16 mr-2"></i></Link>
                                            :''}
                                            {user_user_group == 1 ?
                                            <Link className="text-danger" href="#" title={lang.remove} onClick={() => formModalDelete(row.product_id)}><i className="fas fa-times wd-16 mr-2"></i></Link>
                                            :''}
                                        </td>
                                    </tr>
                                    )})}
                                </tbody>
                                }
                            </table>
                        </div>
                    </div>
                </div>
                {/* Content End */}
            </div>
            
            {/* Barcode Modal Start*/}
            <div className={`modal fade zoomIn ${showBarcodeModal ? 'show d-block' : ''}`} >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-primary m-0 p-2">
                            <h6 className="modal-title text-white">{lang.barcode}</h6>
                            <button type="button" className="btn-close" onClick={() => barcodeModalClose()}></button>
                        </div>

                        <div className="modal-body m-0 pl-3 pr-3 pt-0">
                            <div className="row">
                                <div className="col-md-12 mt-3">
                                    <div className="form-group">
                                        <label className="form-label tx-center" htmlFor="barcode_quantity">{lang.quantity}</label>
                                        <input type="text" className="form-control bd-danger tx-center" id="barcode_quantity" name="barcode_quantity" value={barcode_quantity} onChange={(e) => setBarcode_quantity(e.target.value)} required />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-top p-2">
                            <button type="button" className="btn btn-sm btn-danger rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => barcodeModalClose()}><i className="fal fa-times-circle"></i> {lang.close}</button>
                            <button type="button" className="btn btn-sm btn-success rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => generateBarcode(product_id, barcode_quantity, product_barcode)}><i className="fal fa-check-circle"></i> {lang.generate}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Form Modal End*/}

            {/* Form Modal Delete Start*/}
            <div className={`modal fade ${showFormModalDelete ? 'show d-block' : ''}`} >
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-primary m-0 p-2">
                            <h6 className="modal-title text-white">{lang.delete} {lang.product}</h6>
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
                            <button type="submit" className="btn btn-sm btn-success rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => formSubmitDelete(product_id)}><i className="fal fa-check-circle"></i> {lang.yes}</button>
                            <button type="button" className="btn btn-sm btn-danger rounded-pill text-uppercase pd-t-6-force pd-b-5-force" onClick={() => FormModalDeleteClose()}><i className="fal fa-times-circle"></i> {lang.no}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Form Modal Delete End*/}

            <ToastContainer />
        </Layout>
    )
}

export default  ProductList;
