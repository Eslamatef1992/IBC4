import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout";

import { useDownloadExcel } from "react-export-table-to-excel";

import HeaderTitle from "@/components/header-title";
import getTranslation from "@/languages";
import apiUrl from "@/components/api-url";
import { toast, ToastContainer } from "react-toastify";
import router from "next/router";

const CompanyOwner = () => {
	let user_id, user_group;
	if (typeof window !== "undefined") {
		user_id = localStorage.getItem("user_id");
		user_group = localStorage.getItem("user_group");

		// user_group =1 Super Admin, user_group =2 Admin
		if (user_group == 1 || user_group == 2) {
		} else {
			router.replace("/logout");
			return true;
		}
	}

	const lang = getTranslation();

	const [isDataNotFound, setIsDataNotFound] = useState(false);

	const excelExportRef = useRef(null);
	// const { onDownload } = useDownloadExcel({
	//     currentTableRef : excelExportRef.current,
	//     filename        : 'company-owner',
	//     sheet           : 'Company_package Type'
	// });

	const [user_user_group, setUser_user_group] = useState("");
	const [showFormModal, setShowFormModal] = useState(false);
	const [showFormModalDelete, setShowFormModalDelete] = useState(false);

	const status_list = [
		{
			status_id: 1,
			status_code: "A",
			status_name: "Active",
		},
		{
			status_id: 0,
			status_code: "I",
			status_name: "Inactive",
		},
	];

	const [company_package_list, setCompany_package_list] = useState([]);
	const [branch_owner_id, setbranch_owner_id] = useState(0);
	const [company_package_name, setCompany_package_name] = useState("");
	const [company_package_status, setCompany_package_status] = useState(1);

	const [status, setStatus] = useState("1");
	const [search, setSearch] = useState("");

	const formModal = (primary_id, name, status) => {
		setbranch_owner_id(primary_id);
		setCompany_package_name(name);
		setCompany_package_status(status);
		setShowFormModal(true);
	};

	const formModalDelete = (primary_id) => {
		setbranch_owner_id(primary_id);
		setShowFormModalDelete(true);
	};

	const FormModalClose = () => {
		setbranch_owner_id(0);
		setCompany_package_name("");
		setCompany_package_status("");

		setShowFormModal(false);
	};

	const FormModalDeleteClose = () => {
		setbranch_owner_id(0);

		setShowFormModalDelete(false);
	};

	const formSubmit = (e) => {
		e.preventDefault();

		const formData = {
			name: company_package_name,
			status: company_package_status,
		};

		let axios;
		if (branch_owner_id > 0) {
			axios = apiUrl.put("/branch-owner/update/" + branch_owner_id, formData);
		} else {
			axios = apiUrl.post("/branch-owner/create", formData);
		}
		axios
			.then((response) => {
				const result_data = response.data;
				if (result_data.status == 1) {
					// if (branch_owner_id > 0) {
					// 	const updatedArray = company_package_list.map((data) =>
					// 		data.branch_owner_id === branch_owner_id ? result_data.data : data
					// 	);
					// 	setCompany_package_list(updatedArray);
					// } else {
					// 	setCompany_package_list((current) => [
					// 		...current,
					// 		result_data.data,
					// 	]);
					// }
					company_packageData();
					setTimeout(() => {
						toast.success(result_data.message, {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
					}, 300);

					setbranch_owner_id(0);
					setCompany_package_name("");
					setCompany_package_status("");

					setShowFormModal(false);
				} else {
					setTimeout(() => {
						toast.error(result_data.message, {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
					}, 300);
				}
			})
			.catch((e) => console.log(e));
	};

	const formSubmitDelete = (delete_id) => {
		const axios = apiUrl.delete("/branch-owner/delete/" + delete_id);
		axios
			.then((response) => {
				const result_data = response.data;
				if (result_data.status == 1) {
					const deleteArray = company_package_list.filter(
						(data) => data.branch_owner_id !== delete_id
					);
					setCompany_package_list(deleteArray);
					setTimeout(() => {
						toast.success(result_data.message, {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
					}, 300);
					setbranch_owner_id(0);
					setShowFormModalDelete(false);
				} else {
					setTimeout(() => {
						toast.error(result_data.message, {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
					}, 300);
				}
			})
			.catch((e) => console.log(e));
	};
	const company_packageData = () => {
		let url = !!search
			? "/branch-owner/list?status=" + status + "&search=" + search
			: "/branch-owner/list?status=" + status;
		const axios = apiUrl.get(url);
		axios
			.then((response) => {
				const result_data = response.data;
				if (result_data.status == 1) {
					setCompany_package_list(result_data.data);
					setIsDataNotFound(false);
				} else {
					setCompany_package_list([]);
					setIsDataNotFound(true);
				}
			})
			.catch((e) => {
				setCompany_package_list([]);
				setIsDataNotFound(true);
			});
	};

	useEffect(() => {
		setUser_user_group(user_group);
		company_packageData();
	}, [status, search]);

	return (
		<Layout>
			<HeaderTitle title={lang.owner} keywords="" description="" />
			<div id="main-wrapper" className="full-page">
				{/* Breadcrumb Start */}
				<div className="pageheader pd-t-15 pd-b-10">
					<div className="d-flex justify-content-between">
						<div className="clearfix">
							<div className="pd-t-5 pd-b-5">
								<h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">
									{lang.owner}
								</h2>
							</div>
							<div className="breadcrumb pd-0 mg-0 d-print-none">
								<Link className="breadcrumb-item" href="/">
									<i className="fal fa-home"></i> {lang.home}
								</Link>
								<span className="breadcrumb-item hidden-xs active">
									{lang.owner}
								</span>
							</div>
						</div>
						<div className="d-flex align-items-center d-print-none">
							{user_user_group == 1 || user_user_group == 2 ? (
								<button
									type="button"
									className="btn btn-success rounded-pill pd-t-6-force pd-b-5-force mg-r-3"
									title={lang.owner}
									onClick={() => formModal(0)}>
									<i className="fal fa-plus"></i>
								</button>
							) : (
								""
							)}
							{/* <button type="button" className="btn btn-primary rounded-pill pd-t-6-force pd-b-5-force mg-r-3" title={lang.print} onClick={() => window.print()}><i className="fal fa-print"></i></button> */}
							{/* <button type="button" className="btn btn-info rounded-pill pd-t-6-force pd-b-5-force" title={lang.excel_export} onClick={onDownload}><i className="fal fa-file-excel"></i></button> */}
						</div>
					</div>
				</div>
				{/* Breadcrumb End */}

				{/* Content Start */}
				<div className="row">
					<div className="col-md-12 mg-b-15">
						<div className="row clearfix mb-3 d-print-none">
							<div className="col-md-8 mt-3">
								<div className="form-group">
									<label
										className="form-label tx-uppercase tx-semibold"
										htmlFor="search">
										{lang.search}
									</label>
									<input
										type="text"
										className="form-control bd-info"
										id="search"
										name="search"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
									/>
								</div>
							</div>
							<div className="col-md-4 mt-3">
								<div className="form-group">
									<label
										className="form-label tx-uppercase tx-semibold"
										htmlFor="status">
										{lang.status}
									</label>
									<select
										type="text"
										className="form-control bd-info"
										id="status"
										name="status"
										value={status}
										onChange={(e) => setStatus(e.target.value)}>
										<option value="all">All</option>
										{status_list.map((status_row) => (
											<option
												key={status_row.status_id}
												value={status_row.status_id}>
												{status_row.status_name}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>

						<div className="table-responsive">
							<table
								className="table table-striped table-bordered"
								ref={excelExportRef}>
								<thead className="tx-12 tx-uppercase">
									<tr>
										<th className="tx-center">{lang.sn}</th>
										<th className="tx-center">{lang.owner_name}</th>
										<th className="tx-center">{lang.status}</th>
										<th className="tx-center d-print-none">{lang.option}</th>
									</tr>
								</thead>
								{company_package_list.length > 0 ? (
									<tbody>
										{company_package_list.map((row, index) => {
											return (
												<tr className="" key={row.branch_owner_id}>
													<td className="tx-center">
														{(index + 1).toString().padStart(2, "0")}
													</td>
													<td className="tx-left">{row.name}</td>
													<td className="tx-center">
														{row.status == 1 ? lang.active : lang.inactive}
													</td>
													<td className="tx-center d-print-none">
														<Link
															className="text-primary mg-r-3"
															href="#"
															title={lang.edit}
															onClick={() =>
																formModal(
																	row.branch_owner_id,
																	row?.name,
																	row?.status
																)
															}>
															<i className="fas fa-pencil wd-16 mr-2"></i>
														</Link>
														{user_user_group == 1 ? (
															<Link
																className="text-danger"
																href="#"
																title={lang.remove}
																onClick={() =>
																	formModalDelete(row.branch_owner_id)
																}>
																<i className="fas fa-times wd-16 mr-2"></i>
															</Link>
														) : (
															""
														)}
													</td>
												</tr>
											);
										})}
									</tbody>
								) : !isDataNotFound ? (
									<tbody>
										<tr className="">
											<th className="tx-center d-print-none" colSpan="11">
												<Image
													src="/assets/images/loading/loader.gif"
													alt="Loading"
													width={40}
													height={40}
												/>
											</th>
										</tr>
									</tbody>
								) : (
									<tbody>
										<tr>
											<th className="tx-center text-danger" colSpan="11">
												{lang.data_not_found}
											</th>
										</tr>
									</tbody>
								)}
							</table>
						</div>
					</div>
				</div>
				{/* Content End */}
			</div>

			{/* Form Modal Start*/}
			<div
				className={`modal fade zoomIn ${showFormModal ? "show d-block" : ""}`}>
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header bg-primary m-0 p-2">
							<h6 className="modal-title text-white">
								{branch_owner_id == 0 ? lang.new : lang.update} {lang.owner}
							</h6>
							<button
								type="button"
								className="btn-close"
								onClick={() => FormModalClose()}></button>
						</div>
						<form onSubmit={(e) => formSubmit(e)}>
							<div className="modal-body m-0 pl-3 pr-3 pt-0">
								<div className="row">
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label
												className="form-label"
												htmlFor="company_package_name">
												{lang.name}
											</label>
											<input
												type="text"
												className="form-control bd-danger"
												id="company_package_name"
												name="company_package_name"
												value={company_package_name}
												onChange={(e) =>
													setCompany_package_name(e.target.value)
												}
												required
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label
												className="form-label"
												htmlFor="company_package_status">
												{lang.status}
											</label>
											<select
												type="text"
												className="form-control border border-danger"
												id="company_package_status"
												name="company_package_status"
												value={company_package_status}
												onChange={(e) =>
													setCompany_package_status(e.target.value)
												}>
												{status_list.map((status_row) => (
													<option
														key={status_row.status_id}
														value={status_row.status_id}>
														{status_row.status_name}
													</option>
												))}
											</select>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer border-top p-2">
								<button
									type="button"
									className="btn btn-sm btn-danger rounded-pill text-uppercase pd-t-6-force pd-b-5-force"
									onClick={() => FormModalClose()}>
									<i className="fal fa-times-circle"></i> {lang.close}
								</button>
								<button
									type="submit"
									className="btn btn-sm btn-success rounded-pill text-uppercase pd-t-6-force pd-b-5-force">
									<i className="fal fa-check-circle"></i> {lang.save}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			{/* Form Modal End*/}

			{/* Form Modal Delete Start*/}
			<div
				className={`modal fade ${showFormModalDelete ? "show d-block" : ""}`}>
				<div className="modal-dialog modal-md">
					<div className="modal-content">
						<div className="modal-header bg-primary m-0 p-2">
							<h6 className="modal-title text-white">
								{lang.delete} {lang.owner}
							</h6>
							<button
								type="button"
								className="btn-close"
								onClick={() => FormModalDeleteClose()}></button>
						</div>

						<div className="modal-body m-0 pl-3 pr-3 pt-0">
							<div className="row">
								<div className="col-md-12">
									<div className="tx-center tx-50 tx-warning">
										<i className="fal fa-exclamation-circle"></i>
									</div>
									<h4 className="tx-danger tx-uppercase tx-13 tx-center">
										{lang.delete_warning}
									</h4>
								</div>
							</div>
						</div>
						<div className="modal-footer border-top p-2">
							<button
								type="submit"
								className="btn btn-sm btn-success rounded-pill text-uppercase pd-t-6-force pd-b-5-force"
								onClick={() => formSubmitDelete(branch_owner_id)}>
								<i className="fal fa-check-circle"></i> {lang.yes}
							</button>
							<button
								type="button"
								className="btn btn-sm btn-danger rounded-pill text-uppercase pd-t-6-force pd-b-5-force"
								onClick={() => FormModalDeleteClose()}>
								<i className="fal fa-times-circle"></i> {lang.no}
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Form Modal Delete End*/}
			<ToastContainer />
		</Layout>
	);
};

export default CompanyOwner;
