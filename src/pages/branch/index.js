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

const Branch = () => {
	let user_id, user_group, user_company;
	if (typeof window !== "undefined") {
		user_id = localStorage.getItem("user_id");
		user_group = localStorage.getItem("user_group");
		user_company = !!localStorage.getItem("user_company")
			? localStorage.getItem("user_company")
			: "";

		// user_group =1 Super Admin, user_group =2 Admin, user_group =3 Manager, user_group =4 User
		if (
			user_group == 1 ||
			user_group == 2 ||
			user_group == 3 ||
			user_group == 3 ||
			user_group == 4
		) {
		} else {
			router.replace("/logout");
			return true;
		}
	}

	const lang = getTranslation();

	const [isDataNotFound, setIsDataNotFound] = useState(false);

	const excelExportRef = useRef(null);
	const { onDownload } = useDownloadExcel({
		currentTableRef: excelExportRef.current,
		filename: "branch-list",
		sheet: "Branch List",
	});

	const [user_user_group, setUser_user_group] = useState("");
	const [showFormModal, setShowFormModal] = useState(false);
	const [showFormModalDelete, setShowFormModalDelete] = useState(false);
	const [company_list, setCompany_list] = useState([]);
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

	const [owner_list, setOwner_list] = useState([]);
	const [owner, setOwner] = useState("");
	const [branch_list, setBranch_list] = useState([]);
	const [branch_id, setBranch_id] = useState(0);
	const [branch_company, setBranch_company] = useState("");
	const [branch_code, setBranch_code] = useState("");
	const [branch_name, setBranch_name] = useState("");
	const [upload_attachment, setUpload_attachment] = useState("");
	const [attach_quotation_invoice, setAttach_quotation_invoice] = useState("");
	const [project_owner, setProject_owner] = useState("");
	const [type_of_work, setType_of_work] = useState("");
	const [contract_value, setContract_value] = useState("");
	const [mile_store, setMile_store] = useState("");
	const [commencement_date, setCommencement_date] = useState("");
	const [handing_over_date, setHanding_over_date] = useState("");
	const [percentage_of_claiming_invoice, setPercentage_of_claiming_invoice] =
		useState("");
	const [branch_phone, setBranch_phone] = useState("");
	const [branch_email, setBranch_email] = useState("");
	const [branch_address, setBranch_address] = useState("");
	const [branch_opening_date, setBranch_opening_date] = useState("");
	const [branch_status, setBranch_status] = useState(1);

	const [company, setCompany] = useState("");
	const [status, setStatus] = useState(status_list[0].status_id);
	const [search, setSearch] = useState("");

	const formModal = (primary_id) => {
		setBranch_id(primary_id);
		if (primary_id > 0) {
			const axios = apiUrl.get("/branch/get-branch/" + primary_id);
			axios
				.then((response) => {
					const result_data = response.data;
					if (result_data.status == 1) {
						setBranch_id(result_data.data.branch_id);
						setBranch_company(result_data.data.branch_company);
						setBranch_code(result_data.data.branch_code);
						setBranch_name(result_data.data.branch_name);
						setProject_owner(result_data.data.project_owner?.id);
						setType_of_work(result_data.data.type_of_work);
						setContract_value(result_data.data.contract_value);
						setMile_store(result_data.data.milestore);
						setCommencement_date(
							result_data.data.commencement_date?.split("T")[0]
						);
						setAttach_quotation_invoice(
							result_data.data.attach_quotation_invoice || ""
						);
						setUpload_attachment(result_data.data.attachment || "");
						setHanding_over_date(
							result_data.data.handing_over_date?.split("T")[0]
						);
						setPercentage_of_claiming_invoice(
							result_data.data.percentage_of_claiming_invoice
						);
						setBranch_phone(result_data.data.branch_phone);
						setBranch_email(result_data.data.branch_email);
						setBranch_address(result_data.data.branch_address);
						setBranch_opening_date(result_data.data.branch_opening_date);
						setBranch_status(result_data.data.branch_status);
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
		}
		setShowFormModal(true);
	};

	const formModalDelete = (primary_id) => {
		setBranch_id(primary_id);
		setShowFormModalDelete(true);
	};

	const FormModalClose = () => {
		setBranch_id(0);
		setBranch_company("");
		setBranch_code("");
		setBranch_name("");
		setProject_owner("");
		setType_of_work("");
		setContract_value("");
		setMile_store("");
		setCommencement_date("");
		setHanding_over_date("");
		setPercentage_of_claiming_invoice("");
		setAttach_quotation_invoice("");
		setUpload_attachment("");
		setBranch_phone("");
		setBranch_email("");
		setBranch_address("");
		setBranch_opening_date("");
		setBranch_status("");

		setShowFormModal(false);
	};

	const FormModalDeleteClose = () => {
		setBranch_id(0);

		setShowFormModalDelete(false);
	};

	const formSubmit = (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("project_owner", Number(project_owner));
		if (!!type_of_work) formData.append("type_of_work", type_of_work);
		if (!!contract_value) formData.append("contract_value", contract_value);
		if (!!mile_store) formData.append("milestore", mile_store);
		if (!!commencement_date)
			formData.append("commencement_date", commencement_date);
		if (!!handing_over_date)
			formData.append("handing_over_date", handing_over_date);
		if (!!percentage_of_claiming_invoice)
			formData.append(
				"percentage_of_claiming_invoice",
				percentage_of_claiming_invoice
			);
		formData.append("branch_company", branch_company);
		formData.append("branch_code", branch_code);
		formData.append("branch_name", branch_name);
		formData.append("branch_phone", branch_phone);
		formData.append("branch_email", branch_email);
		formData.append("branch_address", branch_address);
		formData.append("branch_opening_date", branch_opening_date);
		formData.append("branch_status", branch_status);
		if (!!upload_attachment) formData.append("attachment", upload_attachment);
		if (!!attach_quotation_invoice)
			formData.append("attach_quotation_invoice", attach_quotation_invoice);

		// const formData = {
		//     project_owner: project_owner,
		//     type_of_work: type_of_work,
		//     contract_value: contract_value,
		//     milestore: mile_store,
		//     commencement_date: commencement_date,
		//     handing_over_date: handing_over_date,
		//     percentage_of_claiming_invoice: percentage_of_claiming_invoice,
		//     branch_company: branch_company,
		//     branch_code: branch_code,
		//     branch_name: branch_name,
		//     branch_phone: branch_phone,
		//     branch_email: branch_email,
		//     branch_address: branch_address,
		//     branch_opening_date: branch_opening_date,
		//     branch_status: branch_status
		// }
		// formData = new FormData().append('attachment', upload_attachment),
		// formData = new FormData().append('attach_quotation_invoice', attach_quotation_invoice) ,

		let axios;
		if (branch_id > 0) {
			axios = apiUrl.put("/branch/branch-update/" + branch_id, formData);
		} else {
			axios = apiUrl.post("/branch/branch-create", formData);
		}
		axios
			.then((response) => {
				const result_data = response.data;
				if (result_data.status == 1) {
					const axios = apiUrl.get(
						"/branch/branch-list/?company=" +
							company +
							"&status=" +
							status +
							"&search=" +
							search
					);
					axios
						.then((response) => {
							const branch_result_data = response.data;
							if (branch_result_data.status == 1) {
								setBranch_list(branch_result_data.data);
							} else {
								setBranch_list([]);
							}
						})
						.catch((e) => console.log(e));
					setTimeout(() => {
						toast.success(result_data.message, {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
					}, 300);

					setBranch_id(0);
					setBranch_company("");
					setBranch_code("");
					setBranch_name("");
					setProject_owner("");
					setType_of_work("");
					setContract_value("");
					setMile_store("");
					setCommencement_date("");
					setHanding_over_date("");
					setPercentage_of_claiming_invoice("");
					setBranch_phone("");
					setBranch_email("");
					setBranch_address("");
					setBranch_opening_date("");
					setBranch_status("");

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
		const axios = apiUrl.delete("/branch/branch-delete/" + delete_id);
		axios
			.then((response) => {
				const result_data = response.data;
				if (result_data.status == 1) {
					const deleteArray = branch_list.filter(
						(data) => data.branch_id !== delete_id
					);
					setBranch_list(deleteArray);
					setTimeout(() => {
						toast.success(result_data.message, {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
					}, 300);
					setBranch_id(0);
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

	const companyData = () => {
		const axios = apiUrl.get("/company/company-list-active");
		axios
			.then((response) => {
				const result_data = response.data;
				if (result_data.status == 1) {
					setCompany_list(result_data.data);
				} else {
					setCompany_list([]);
				}
				if (!!result_data?.data?.length) {
					setCompany(result_data?.data[0].company_id);
					// if(!status) setStatus(status_list[0].status_id)
				}
			})
			.catch((e) => console.log(e));
	};

	const branchData = () => {
		let info = {};
		if (company !== "") info["company"] = company;
		if (status !== "all") info["status"] = status;
		if (!!owner) info["branch_owner"] = Number(owner);
		// if(!!search) info['search']= search
		const queryParams = new URLSearchParams({ ...info }).toString();
		const axios = apiUrl.get(
			`/branch/branch-list?${queryParams}&search=${search}`
		); //&search=${search}
		// const axios = apiUrl.get("/branch/branch-list?company="+company+"&status="+status+"&search="+search);
		axios
			.then((response) => {
				const result_data = response.data;
				if (result_data.status == 1) {
					setBranch_list(result_data.data);
					setIsDataNotFound(false);
				} else {
					setBranch_list([]);
					setIsDataNotFound(true);
				}
			})
			.catch((e) => console.log(e));
	};

	const getOwnersOptions = () => {
		const axios = apiUrl.get("/branch-owner/list?status=1");
		axios.then((response) => {
			const result_data = response.data;
			if (result_data.status == 1) {
				setOwner_list(result_data.data);
			}
		});
	};

	useEffect(() => {
		setTimeout(() => {
			branchData();
		}, 500);
	}, [company, status, search, owner]);

	useEffect(() => {
		getOwnersOptions();
		setUser_user_group(user_group);
		companyData();
	}, []);

	return (
		<Layout>
			<HeaderTitle title={lang.project} keywords="" description="" />
			<div id="main-wrapper" className="full-page">
				{/* Breadcrumb Start */}
				<div className="pageheader pd-t-15 pd-b-10">
					<div className="d-flex justify-content-between">
						<div className="clearfix">
							<div className="pd-t-5 pd-b-5">
								<h2 className="pd-0 mg-0 tx-14 tx-dark tx-bold tx-uppercase">
									{lang.project}
								</h2>
							</div>
							<div className="breadcrumb pd-0 mg-0 d-print-none">
								<Link className="breadcrumb-item" href="/">
									<i className="fal fa-home"></i> {lang.home}
								</Link>
								<span className="breadcrumb-item hidden-xs active">
									{lang.project}
								</span>
							</div>
						</div>
						<div className="d-flex align-items-center d-print-none">
							{user_user_group == 1 ||
							user_user_group == 2 ||
							user_user_group == 3 ? (
								<button
									type="button"
									className="btn btn-success rounded-pill pd-t-6-force pd-b-5-force mg-r-3"
									title={lang.new_project}
									onClick={() => formModal(0)}>
									<i className="fal fa-plus"></i>
								</button>
							) : (
								""
							)}
							<button
								type="button"
								className="btn btn-primary rounded-pill pd-t-6-force pd-b-5-force mg-r-3"
								title={lang.print}
								onClick={() => window.print()}>
								<i className="fal fa-print"></i>
							</button>
							<button
								type="button"
								className="btn btn-info rounded-pill pd-t-6-force pd-b-5-force"
								title={lang.excel_export}
								onClick={onDownload}>
								<i className="fal fa-file-excel"></i>
							</button>
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
							<div className="col-md-3 mt-3">
								<div className="form-group">
									<label
										className="form-label tx-uppercase tx-semibold"
										htmlFor="company">
										{lang.company}
									</label>
									<select
										type="text"
										className="form-control bd-info"
										id="company"
										name="company"
										value={company}
										onChange={(e) => setCompany(e.target.value)}>
										{/* <option value="">{lang.select}</option> */}
										{company_list.map((company_row) => (
											<option
												key={company_row.company_id}
												value={company_row.company_id}>
												{company_row.company_name}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="col-md-3 mt-3">
								<div className="form-group">
									<label
										className="form-label tx-uppercase tx-semibold"
										htmlFor="owner">
										{lang.owner}
									</label>
									<select
										className="form-control bd-info"
										id="owner"
										name="owner"
										value={owner}
										onChange={(e) => setOwner(e.target.value)}>
										<option value="">{lang.select}</option>
										{owner_list.map((owner_row) => (
											<option
												key={owner_row?.branch_owner_id}
												value={owner_row.branch_owner_id}>
												{owner_row.name}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="col-md-3 mt-3">
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
										{/* <option value="all">All</option> */}
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
										<th className="tx-center">{lang.project_code}</th>
										<th className="tx-center">{lang.project_name}</th>
										<th className="tx-center">{lang.project_owner}</th>
										<th className="tx-center">{lang.phone_number}</th>
										<th className="tx-center">{lang.email}</th>
										<th className="tx-center">{lang.address}</th>
										<th className="tx-center">{lang.opening_date}</th>
										<th className="tx-center">{lang.company}</th>
										<th className="tx-center">{lang.status}</th>
										{user_user_group == 1 ||
										user_user_group == 2 ||
										user_user_group == 3 ? (
											<th className="tx-center d-print-none">{lang.option}</th>
										) : (
											""
										)}
									</tr>
								</thead>
								{branch_list.length > 0 ? (
									<tbody>
										{branch_list.map((row, index) => {
											return (
												<tr className="" key={row.branch_id}>
													<td className="tx-center">
														{(index + 1).toString().padStart(2, "0")}
													</td>
													<td className="tx-center">{row.branch_code}</td>
													<td className="tx-left">{row.branch_name}</td>
													<td className="tx-left">
														{row.project_owner?.value}
													</td>
													<td className="tx-center">{row.branch_phone}</td>
													<td className="tx-left">{row.branch_email}</td>
													<td className="tx-left">{row.branch_address}</td>
													<td className="tx-center">
														{row.branch_opening_date}
													</td>
													<td className="tx-left">{row.branch_company_name}</td>
													<td className="tx-center">
														{row.branch_status == 1
															? lang.active
															: lang.inactive}
													</td>
													{user_user_group == 1 ||
													user_user_group == 2 ||
													user_user_group == 3 ? (
														<td className="tx-center d-print-none">
															<Link
																className="text-primary mg-r-3"
																href="#"
																title={lang.edit}
																onClick={() => formModal(row.branch_id)}>
																<i className="fas fa-pencil wd-16 mr-2"></i>
															</Link>
															{user_user_group == 1 ? (
																<Link
																	className="text-danger"
																	href="#"
																	title={lang.remove}
																	onClick={() =>
																		formModalDelete(row.branch_id)
																	}>
																	<i className="fas fa-times wd-16 mr-2"></i>
																</Link>
															) : (
																""
															)}
														</td>
													) : (
														""
													)}
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
								{branch_id == 0 ? lang.new : lang.update} {lang.project}
							</h6>
							<button
								type="button"
								className="btn-close"
								onClick={() => FormModalClose()}></button>
						</div>
						<form onSubmit={(e) => formSubmit(e)}>
							<div className="modal-body m-0 pl-3 pr-3 pt-0">
								<div className="row">
									<div className="col-md-12 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="branch_company">
												{lang.company}
											</label>
											<select
												type="text"
												className="form-control border border-danger"
												id="branch_company"
												name="branch_company"
												value={branch_company}
												onChange={(e) => setBranch_company(e.target.value)}
												required>
												<option value="">{lang.select}</option>
												{company_list.map((company_row) => (
													<option
														key={company_row.company_id}
														value={company_row.company_id}>
														{company_row.company_name}
													</option>
												))}
											</select>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="project_code">
												{lang.project_code}
											</label>
											<input
												type="text"
												className="form-control bd-danger"
												id="project_code"
												name="branch_code"
												value={branch_code}
												onChange={(e) => setBranch_code(e.target.value)}
												required
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="project_name">
												{lang.project_name}
											</label>
											<input
												type="text"
												className="form-control bd-danger"
												id="project_name"
												name="branch_name"
												value={branch_name}
												onChange={(e) => setBranch_name(e.target.value)}
												required
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="project_owner">
												{lang.project_owner}
											</label>
											{/* <input
												type="text"
												className="form-control bd-danger"
												id="project_owner"
												name="project_owner"
												value={project_owner}
												onChange={(e) => setProject_owner(e.target.value)}
												required
											/> */}
											<select
												className="form-control border border-danger"
												id="project_owner"
												name="project_owner"
												value={project_owner}
												onChange={(e) => setProject_owner(e.target.value)}
												required>
												<option value="">{lang.select}</option>
												{owner_list.map((owner_row) => (
													<option
														key={owner_row.branch_owner_id}
														value={owner_row.branch_owner_id}>
														{owner_row.name}
													</option>
												))}
											</select>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="type_of_work">
												{lang.type_of_work}
											</label>
											<input
												type="text"
												className="form-control bd-danger"
												id="type_of_work"
												name="type_of_work"
												value={type_of_work}
												onChange={(e) => setType_of_work(e.target.value)}
												// required
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="contract_value">
												{lang.contract_value}
											</label>
											<input
												type="text"
												className="form-control bd-danger"
												id="contract_value"
												name="contract_value"
												value={contract_value}
												onChange={(e) => setContract_value(e.target.value)}
												// required
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="mile_store">
												{lang.mile_stone}
											</label>
											<input
												type="text"
												className="form-control bd-danger"
												id="mile_store"
												name="mile_store"
												value={mile_store}
												onChange={(e) => setMile_store(e.target.value)}
												// required
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="commencement_date">
												{lang.commencement_date}
											</label>
											<input
												type="date"
												className="form-control bd-danger"
												id="commencement_date"
												name="commencement_date"
												value={commencement_date}
												onChange={(e) => setCommencement_date(e.target.value)}
												// required
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="handing_over_date">
												{lang.handing_over_date}
											</label>
											<input
												type="date"
												className="form-control bd-danger"
												id="handing_over_date"
												name="handing_over_date"
												value={handing_over_date}
												onChange={(e) => setHanding_over_date(e.target.value)}
												// required
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label
												className="form-label"
												htmlFor="percentage_of_claiming_invoice">
												{lang.percentage_of_claiming_invoice}
											</label>
											<input
												type="text"
												className="form-control bd-danger"
												id="percentage_of_claiming_invoice"
												name="percentage_of_claiming_invoice"
												value={percentage_of_claiming_invoice}
												onChange={(e) =>
													setPercentage_of_claiming_invoice(e.target.value)
												}
												// required
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="branch_phone">
												{lang.phone_number}
											</label>
											<input
												type="tel"
												className="form-control bd-info"
												id="branch_phone"
												name="branch_phone"
												value={branch_phone}
												onChange={(e) => setBranch_phone(e.target.value)}
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="branch_email">
												{lang.email}
											</label>
											<input
												type="email"
												className="form-control bd-info"
												id="branch_email"
												name="branch_email"
												value={branch_email}
												onChange={(e) => setBranch_email(e.target.value)}
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="branch_address">
												{lang.address}
											</label>
											<input
												type="text"
												className="form-control bd-info"
												id="branch_address"
												name="branch_address"
												value={branch_address}
												onChange={(e) => setBranch_address(e.target.value)}
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label
												className="form-label"
												htmlFor="branch_opening_date">
												{lang.opening_date}
											</label>
											<input
												type="date"
												className="form-control bd-info"
												id="branch_opening_date"
												name="branch_opening_date"
												value={branch_opening_date}
												onChange={(e) => setBranch_opening_date(e.target.value)}
											/>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="branch_status">
												{lang.status}
											</label>
											<select
												type="text"
												className="form-control border border-danger"
												id="branch_status"
												name="branch_status"
												value={branch_status}
												onChange={(e) => setBranch_status(e.target.value)}>
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

									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="branch_status">
												{lang.upload_attachment}
											</label>
											<div className="form-group">
												<input
													type="file"
													accept="image/*"
													className="form-control bd-info"
													id="upload_attachment"
													name="upload_attachment"
													onChange={(e) =>
														setUpload_attachment(e.target.files[0])
													}
												/>
											</div>
										</div>
									</div>
									<div className="col-md-6 mt-3">
										<div className="form-group">
											<label className="form-label" htmlFor="branch_status">
												{lang.attach_quotation_invoice}
											</label>
											<div className="form-group">
												<input
													type="file"
													accept="image/*"
													className="form-control bd-info"
													id="attach_quotation_invoice"
													name="attach_quotation_invoice"
													onChange={(e) =>
														setAttach_quotation_invoice(e.target.files[0])
													}
												/>
											</div>
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
								{lang.delete} {lang.project}
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
										Do You Want to Delete?
									</h4>
								</div>
							</div>
						</div>
						<div className="modal-footer border-top p-2">
							<button
								type="submit"
								className="btn btn-sm btn-success rounded-pill text-uppercase pd-t-6-force pd-b-5-force"
								onClick={() => formSubmitDelete(branch_id)}>
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

export default Branch;
