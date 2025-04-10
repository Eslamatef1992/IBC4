import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import getTranslation from "@/languages";

const Sidebar = ({
	user_group_name,
	user_group,
	isMobileSidebar,
	setMobileSidebar,
}) => {
	const lang = getTranslation();

	return (
		<>
			{/* Page Sidebar Inner Start */}
			<div className="page-sidebar-fixed h-100">
				{/* Logo Start */}
				<div className="logo">
					<Link className="logo-img" href="/">
						<Image
							className="desktop-logo"
							src="/assets/images/CLS.svg"
							priority={true}
							alt=""
							width={178}
							height={40}
						/>
						<Image
							className="small-logo"
							src="/assets/images/CLS.svg"
							priority={true}
							alt=""
							width={80}
							height={80}
						/>
					</Link>
					{isMobileSidebar ? (
						<Link
							id="sidebar-toggle-button-close"
							className="text-white tx-right"
							href="#"
							onClick={() => setMobileSidebar(false)}>
							<i className="fal fa-times wd-20"></i>{" "}
						</Link>
					) : (
						<Link
							id="sidebar-toggle-button-close"
							className="text-white tx-right"
							href="#"
							onClick={() => setMobileSidebar(false)}>
							<i className="fal fa-times wd-20"></i>{" "}
						</Link>
					)}
				</div>
				{/* Logo End */}
				{/* Page Sidebar Menu Start */}
				<div className="page-sidebar-menu position-absolute w-100 overflow-scroll">
					<ul className="accordion-menu">
						<li className="mg-l-20-force menu-navigation">
							{" "}
							{user_group_name} {lang.module}
						</li>

						{/* Dashboard Start*/}
						<li className="animation">
							<Link href="/">
								<i className="fal fa-home mg-r-3"></i>{" "}
								<span>{lang.dashboard}</span>
							</Link>
						</li>
						{/* Dashboard End*/}

						{(() => {
							// For Super Admin
							if (user_group == 1) {
								return (
									<>
										{/* Company & Project*/}
										<li>
											<Link href="#company_project" data-bs-toggle="collapse">
												<i className="fal fa-sitemap mg-r-3"></i>{" "}
												<span>{lang.company_project}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="company_project">
												<li className="animation">
													<Link href="/company">{lang.company}</Link>
												</li>
												<li className="animation">
													<Link href="/company-package">
														{lang.company_package}
													</Link>
												</li>
												<li className="animation">
													<Link href="/company-owner">{lang.owner}</Link>
												</li>
												<li className="animation">
													<Link href="/branch">{lang.project}</Link>
												</li>
												{/* <li className="animation">
													<Link href="/project_owner">
														{lang.project_owner}
													</Link>
												</li> */}
											</ul>
										</li>
										{/* Chart of Accounts End*/}

										{/* Products Start*/}
										<li>
											<Link href="#products" data-bs-toggle="collapse">
												<i className="fal fa-wallet"></i>{" "}
												<span>{lang.products}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="products">
												<li className="animation">
													<Link href="/products/create">
														{lang.new_product}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-list">
														{lang.product_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-category">
														{lang.product_category}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-brand">
														{lang.product_brand}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-type">
														{lang.product_type}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-unit">
														{lang.product_unit}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Products End*/}

										{/* Warehouse Start*/}
										<li>
											<Link href="#warehouse" data-bs-toggle="collapse">
												<i className="fal fa-warehouse"></i>{" "}
												<span>{lang.warehouse}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="warehouse">
												<li className="animation">
													<Link href="/warehouse/warehouse-list">
														{lang.warehouse_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Warehouse End*/}

										{/* Purchase Start*/}
										<li>
											<Link href="#purchase" data-bs-toggle="collapse">
												<i className="fal fa-shopping-bag"></i>{" "}
												<span>{lang.purchase}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="purchase">
												<li className="animation">
													<Link href="/purchase/create">
														{lang.new_purchase}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-list">
														{lang.purchase_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return">
														{lang.purchase_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-list">
														{lang.purchase_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/due-payment">
														{lang.due_payment}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/return-due-collection">
														{lang.return + " " + lang.due_collection}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-report">
														{lang.purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-due-report">
														{lang.purchase_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-payment-report">
														{lang.purchase_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-report">
														{lang.purchase_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-collection-report">
														{lang.return_collection_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Purchase End*/}

										{/* Suppliers Start*/}
										<li>
											<Link href="#suppliers" data-bs-toggle="collapse">
												<i className="fal fa-truck"></i>{" "}
												<span>{lang.suppliers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="suppliers">
												<li className="animation">
													<Link href="/suppliers/create">
														{lang.new_supplier}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-list">
														{lang.supplier_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-report">
														{lang.supplier_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-purchase-report">
														{lang.supplier_purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-payment-report">
														{lang.supplier_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-due-report">
														{lang.supplier_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Suppliers End*/}

										{/* Sales Start*/}
										<li>
											<Link href="#sales" data-bs-toggle="collapse">
												<i className="fal fa-taco"></i>{" "}
												<span>{lang.sales}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="sales">
												<li className="animation">
													<Link href="/sales/create">{lang.new_sales}</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-list">
														{lang.sales_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return">
														{lang.sales_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-list">
														{lang.sales_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/due-collection">
														{lang.due_collection}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/return-due-payment">
														{lang.return + " " + lang.due_payment}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-report">
														{lang.sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-due-report">
														{lang.sales_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-collection-report">
														{lang.sales_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-report">
														{lang.sales_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-payment-report">
														{lang.return_payment_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Sales End*/}

										{/* Customers Start*/}
										<li>
											<Link href="#customers" data-bs-toggle="collapse">
												<i className="fal fa-user"></i>{" "}
												<span>{lang.customers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="customers">
												<li className="animation">
													<Link href="/customers/create">
														{lang.new_customer}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-list">
														{lang.customer_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-report">
														{lang.customer_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-sales-report">
														{lang.customer_sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-collection-report">
														{lang.customer_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-due-report">
														{lang.customer_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Customers End*/}

										{/* Chart of Accounts Start*/}
										<li>
											<Link href="#accounts" data-bs-toggle="collapse">
												<i className="fal fa-bars mg-r-3"></i>{" "}
												<span>{lang.accounts}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="accounts">
												<li className="animation">
													<Link href="/accounts/day-close">
														{lang.day_close}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts/chart-of-accounts">
														{lang.chart_of_accounts}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts/financial-year">
														{lang.financial_year}
													</Link>
												</li>
											</ul>
										</li>
										{/* Chart of Accounts End*/}

										{/* Voucher Start*/}
										<li>
											<Link href="#voucher" data-bs-toggle="collapse">
												<i className="fal fa-file-invoice mg-r-3"></i>{" "}
												<span>{lang.voucher}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="voucher">
												<li className="animation">
													<Link href="/voucher/new-voucher">
														{lang.new} {lang.voucher}
													</Link>
												</li>
												<li className="animation">
													<Link href="/voucher/voucher-list">
														{lang.voucher_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/voucher/voucher-search">
														{lang.voucher_search}
													</Link>
												</li>
											</ul>
										</li>
										{/* Voucher End*/}

										{/* Reports Start*/}
										<li>
											<Link href="#reports" data-bs-toggle="collapse">
												<i className="fal fa-warehouse-alt"></i>{" "}
												<span>{lang.inventory + " " + lang.reports}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="reports">
												<li className="animation">
													<Link href="/reports/summary-report">
														{lang.summary_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-report">
														{lang.purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-due-report">
														{lang.purchase_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-payment-report">
														{lang.purchase_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-report">
														{lang.purchase_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-collection-report">
														{lang.return_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-report">
														{lang.sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-due-report">
														{lang.sales_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-collection-report">
														{lang.sales_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-report">
														{lang.sales_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-payment-report">
														{lang.return_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-report">
														{lang.supplier_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-purchase-report">
														{lang.supplier_purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-payment-report">
														{lang.supplier_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-due-report">
														{lang.supplier_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-report">
														{lang.customer_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-sales-report">
														{lang.customer_sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-collection-report">
														{lang.customer_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-due-report">
														{lang.customer_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Reports End*/}

										{/* Accounts Report Start*/}
										<li>
											<Link href="#accounts_report" data-bs-toggle="collapse">
												<i className="fal fa-file-chart-line mg-r-3"></i>{" "}
												<span>{lang.accounts_report}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="accounts_report">
												<li className="animation">
													<Link href="/accounts-report/ledger-report">
														{lang.ledger_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/balance-sheet">
														{lang.balance_sheet}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/income-expenditure">
														{lang.income_expenditure}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/trial-balance">
														{lang.trial_balance}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/receipts-payments">
														{lang.receipts_payments}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/balance-sheet-note">
														{lang.balance_sheet_note}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/income-expenditure-note">
														{lang.income_expenditure_note}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/cash-book">
														{lang.cash_book}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/bank-book">
														{lang.bank_book}
													</Link>
												</li>
												{/* <li className="animation"><Link href="/accounts-report/cash-flow-statement">{lang.cash_flow_statement}</Link></li> */}
												<li className="animation">
													<Link href="/accounts-report/changes-in-equity">
														{lang.changes_in_equity}
													</Link>
												</li>
											</ul>
										</li>
										{/* Accounts Report End*/}

										{/* User Start*/}
										<li>
											<Link href="#users" data-bs-toggle="collapse">
												<i className="fal fa-user mg-r-3"></i>{" "}
												<span>{lang.users}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="users">
												<li className="animation">
													<Link href="/users/user-list">{lang.user_list}</Link>
												</li>
												<li className="animation">
													<Link href="/users/user-group">
														{lang.user_group}
													</Link>
												</li>
												<li className="animation">
													<Link href="/users/profile">{lang.my_profile}</Link>
												</li>
												<li className="animation">
													<Link href="/users/profile-picture">
														{lang.profile_picture}
													</Link>
												</li>
												<li className="animation">
													<Link href="/users/change-password">
														{lang.change_password}
													</Link>
												</li>
											</ul>
										</li>
										{/* User End*/}

										{/* Settings Start*/}
										<li>
											<Link href="#settings" data-bs-toggle="collapse">
												<i className="fal fa-cog mg-r-3"></i>{" "}
												<span>{lang.settings}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="settings">
												<li className="animation">
													<Link href="/settings/system-setup">
														{lang.system_setup}
													</Link>
												</li>
												<li className="animation">
													<Link href="/settings/system-logo">
														{lang.system_logo}
													</Link>
												</li>
												<li className="animation">
													<Link href="/settings/language">{lang.language}</Link>
												</li>
											</ul>
										</li>
										{/* Settings End*/}
									</>
								);
							}
							// For Admin
							else if (user_group == 2) {
								return (
									<>
										{/* Company & Project*/}
										<li>
											<Link href="#company_project" data-bs-toggle="collapse">
												<i className="fal fa-sitemap mg-r-3"></i>{" "}
												<span>{lang.company_project}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="company_project">
												<li className="animation">
													<Link href="/company">{lang.company}</Link>
												</li>
												<li className="animation">
													<Link href="/company-owner">{lang.owner}</Link>
												</li>
												<li className="animation">
													<Link href="/branch">{lang.project}</Link>
												</li>
												{/* <li className="animation">
													<Link href="/project_owner">
														{lang.project_owner}
													</Link>
												</li> */}
											</ul>
										</li>
										{/* Chart of Accounts End*/}

										{/* Products Start*/}
										<li>
											<Link href="#products" data-bs-toggle="collapse">
												<i className="fal fa-wallet"></i>{" "}
												<span>{lang.products}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="products">
												<li className="animation">
													<Link href="/products/create">
														{lang.new_product}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-list">
														{lang.product_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-category">
														{lang.product_category}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-brand">
														{lang.product_brand}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-type">
														{lang.product_type}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-unit">
														{lang.product_unit}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Products End*/}

										{/* Warehouse Start*/}
										<li>
											<Link href="#warehouse" data-bs-toggle="collapse">
												<i className="fal fa-warehouse"></i>{" "}
												<span>{lang.warehouse}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="warehouse">
												<li className="animation">
													<Link href="/warehouse/warehouse-list">
														{lang.warehouse_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Warehouse End*/}

										{/* Purchase Start*/}
										<li>
											<Link href="#purchase" data-bs-toggle="collapse">
												<i className="fal fa-shopping-bag"></i>{" "}
												<span>{lang.purchase}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="purchase">
												<li className="animation">
													<Link href="/purchase/create">
														{lang.new_purchase}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-list">
														{lang.purchase_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return">
														{lang.purchase_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-list">
														{lang.purchase_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/due-payment">
														{lang.due_payment}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/return-due-collection">
														{lang.return + " " + lang.due_collection}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-report">
														{lang.purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-due-report">
														{lang.purchase_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-payment-report">
														{lang.purchase_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-report">
														{lang.purchase_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-collection-report">
														{lang.return_collection_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Purchase End*/}

										{/* Suppliers Start*/}
										<li>
											<Link href="#suppliers" data-bs-toggle="collapse">
												<i className="fal fa-truck"></i>{" "}
												<span>{lang.suppliers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="suppliers">
												<li className="animation">
													<Link href="/suppliers/create">
														{lang.new_supplier}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-list">
														{lang.supplier_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-report">
														{lang.supplier_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-purchase-report">
														{lang.supplier_purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-payment-report">
														{lang.supplier_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-due-report">
														{lang.supplier_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Suppliers End*/}

										{/* Sales Start*/}
										<li>
											<Link href="#sales" data-bs-toggle="collapse">
												<i className="fal fa-taco"></i>{" "}
												<span>{lang.sales}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="sales">
												<li className="animation">
													<Link href="/sales/create">{lang.new_sales}</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-list">
														{lang.sales_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return">
														{lang.sales_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-list">
														{lang.sales_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/due-collection">
														{lang.due_collection}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/return-due-payment">
														{lang.return + " " + lang.due_payment}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-report">
														{lang.sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-due-report">
														{lang.sales_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-collection-report">
														{lang.sales_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-report">
														{lang.sales_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-payment-report">
														{lang.return_payment_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Sales End*/}

										{/* Customers Start*/}
										<li>
											<Link href="#customers" data-bs-toggle="collapse">
												<i className="fal fa-user"></i>{" "}
												<span>{lang.customers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="customers">
												<li className="animation">
													<Link href="/customers/create">
														{lang.new_customer}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-list">
														{lang.customer_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-report">
														{lang.customer_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-sales-report">
														{lang.customer_sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-collection-report">
														{lang.customer_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-due-report">
														{lang.customer_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Customers End*/}

										{/* Chart of Accounts Start*/}
										<li>
											<Link href="#accounts" data-bs-toggle="collapse">
												<i className="fal fa-bars mg-r-3"></i>{" "}
												<span>{lang.accounts}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="accounts">
												<li className="animation">
													<Link href="/accounts/day-close">
														{lang.day_close}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts/chart-of-accounts">
														{lang.chart_of_accounts}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts/financial-year">
														{lang.financial_year}
													</Link>
												</li>
											</ul>
										</li>
										{/* Chart of Accounts End*/}

										{/* Voucher Start*/}
										<li>
											<Link href="#voucher" data-bs-toggle="collapse">
												<i className="fal fa-file-invoice mg-r-3"></i>{" "}
												<span>{lang.voucher}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="voucher">
												<li className="animation">
													<Link href="/voucher/new-voucher">
														{lang.new} {lang.voucher}
													</Link>
												</li>
												<li className="animation">
													<Link href="/voucher/voucher-list">
														{lang.voucher_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/voucher/voucher-search">
														{lang.voucher_search}
													</Link>
												</li>
											</ul>
										</li>
										{/* Voucher End*/}

										{/* Reports Start*/}
										<li>
											<Link href="#reports" data-bs-toggle="collapse">
												<i className="fal fa-warehouse-alt"></i>{" "}
												<span>{lang.inventory + " " + lang.reports}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="reports">
												<li className="animation">
													<Link href="/reports/summary-report">
														{lang.summary_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-report">
														{lang.purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-due-report">
														{lang.purchase_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-payment-report">
														{lang.purchase_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-report">
														{lang.purchase_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-collection-report">
														{lang.return_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-report">
														{lang.sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-due-report">
														{lang.sales_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-collection-report">
														{lang.sales_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-report">
														{lang.sales_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-payment-report">
														{lang.return_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-report">
														{lang.supplier_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-purchase-report">
														{lang.supplier_purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-payment-report">
														{lang.supplier_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-due-report">
														{lang.supplier_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-report">
														{lang.customer_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-sales-report">
														{lang.customer_sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-collection-report">
														{lang.customer_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-due-report">
														{lang.customer_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Reports End*/}

										{/* Accounts Report Start*/}
										<li>
											<Link href="#accounts_report" data-bs-toggle="collapse">
												<i className="fal fa-file-chart-line mg-r-3"></i>{" "}
												<span>{lang.accounts_report}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="accounts_report">
												<li className="animation">
													<Link href="/accounts-report/ledger-report">
														{lang.ledger_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/balance-sheet">
														{lang.balance_sheet}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/income-expenditure">
														{lang.income_expenditure}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/trial-balance">
														{lang.trial_balance}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/receipts-payments">
														{lang.receipts_payments}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/balance-sheet-note">
														{lang.balance_sheet_note}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/income-expenditure-note">
														{lang.income_expenditure_note}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/cash-book">
														{lang.cash_book}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/bank-book">
														{lang.bank_book}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/changes-in-equity">
														{lang.changes_in_equity}
													</Link>
												</li>
											</ul>
										</li>
										{/* Accounts Report End*/}

										{/* User Start*/}
										<li>
											<Link href="#users" data-bs-toggle="collapse">
												<i className="fal fa-user mg-r-3"></i>{" "}
												<span>{lang.users}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="users">
												<li className="animation">
													<Link href="/users/user-list">{lang.user_list}</Link>
												</li>
												<li className="animation">
													<Link href="/users/profile">{lang.my_profile}</Link>
												</li>
												<li className="animation">
													<Link href="/users/profile-picture">
														{lang.profile_picture}
													</Link>
												</li>
												<li className="animation">
													<Link href="/users/change-password">
														{lang.change_password}
													</Link>
												</li>
											</ul>
										</li>
										{/* User End*/}

										{/* Settings Start*/}
										<li>
											<Link href="#settings" data-bs-toggle="collapse">
												<i className="fal fa-cog mg-r-3"></i>{" "}
												<span>{lang.settings}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="settings">
												<li className="animation">
													<Link href="/settings/system-logo">
														{lang.system_logo}
													</Link>
												</li>
												<li className="animation">
													<Link href="/settings/language">{lang.language}</Link>
												</li>
											</ul>
										</li>
										{/* Settings End*/}
									</>
								);
							}

							// For Company
							else if (user_group == 3) {
								return (
									<>
										{/* Company & Project*/}
										<li>
											<Link href="#company_project" data-bs-toggle="collapse">
												<i className="fal fa-sitemap mg-r-3"></i>{" "}
												<span>{lang.company_project}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="company_project">
												<li className="animation">
													<Link href="/company">{lang.company}</Link>
												</li>
												<li className="animation">
													<Link href="/company-owner">{lang.owner}</Link>
												</li>
												<li className="animation">
													<Link href="/branch">{lang.project}</Link>
												</li>
												{/* <li className="animation">
													<Link href="/project_owner">
														{lang.project_owner}
													</Link>
												</li> */}
											</ul>
										</li>
										{/* Chart of Accounts End*/}

										{/* Products Start*/}
										<li>
											<Link href="#products" data-bs-toggle="collapse">
												<i className="fal fa-wallet"></i>{" "}
												<span>{lang.products}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="products">
												<li className="animation">
													<Link href="/products/create">
														{lang.new_product}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-list">
														{lang.product_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-category">
														{lang.product_category}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-brand">
														{lang.product_brand}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-type">
														{lang.product_type}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-unit">
														{lang.product_unit}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Products End*/}

										{/* Warehouse Start*/}
										<li>
											<Link href="#warehouse" data-bs-toggle="collapse">
												<i className="fal fa-warehouse"></i>{" "}
												<span>{lang.warehouse}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="warehouse">
												<li className="animation">
													<Link href="/warehouse/warehouse-list">
														{lang.warehouse_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Warehouse End*/}

										{/* Purchase Start*/}
										<li>
											<Link href="#purchase" data-bs-toggle="collapse">
												<i className="fal fa-shopping-bag"></i>{" "}
												<span>{lang.purchase}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="purchase">
												<li className="animation">
													<Link href="/purchase/create">
														{lang.new_purchase}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-list">
														{lang.purchase_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return">
														{lang.purchase_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-list">
														{lang.purchase_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/due-payment">
														{lang.due_payment}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/return-due-collection">
														{lang.return + " " + lang.due_collection}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-report">
														{lang.purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-due-report">
														{lang.purchase_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-payment-report">
														{lang.purchase_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-report">
														{lang.purchase_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-collection-report">
														{lang.return_collection_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Purchase End*/}

										{/* Suppliers Start*/}
										<li>
											<Link href="#suppliers" data-bs-toggle="collapse">
												<i className="fal fa-truck"></i>{" "}
												<span>{lang.suppliers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="suppliers">
												<li className="animation">
													<Link href="/suppliers/create">
														{lang.new_supplier}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-list">
														{lang.supplier_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-report">
														{lang.supplier_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-purchase-report">
														{lang.supplier_purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-payment-report">
														{lang.supplier_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-due-report">
														{lang.supplier_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Suppliers End*/}

										{/* Sales Start*/}
										<li>
											<Link href="#sales" data-bs-toggle="collapse">
												<i className="fal fa-taco"></i>{" "}
												<span>{lang.sales}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="sales">
												<li className="animation">
													<Link href="/sales/create">{lang.new_sales}</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-list">
														{lang.sales_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return">
														{lang.sales_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-list">
														{lang.sales_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/due-collection">
														{lang.due_collection}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/return-due-payment">
														{lang.return + " " + lang.due_payment}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-report">
														{lang.sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-due-report">
														{lang.sales_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-collection-report">
														{lang.sales_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-report">
														{lang.sales_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-payment-report">
														{lang.return_payment_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Sales End*/}

										{/* Customers Start*/}
										<li>
											<Link href="#customers" data-bs-toggle="collapse">
												<i className="fal fa-user"></i>{" "}
												<span>{lang.customers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="customers">
												<li className="animation">
													<Link href="/customers/create">
														{lang.new_customer}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-list">
														{lang.customer_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-report">
														{lang.customer_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-sales-report">
														{lang.customer_sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-collection-report">
														{lang.customer_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-due-report">
														{lang.customer_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Customers End*/}

										{/* Chart of Accounts Start*/}
										<li>
											<Link href="#accounts" data-bs-toggle="collapse">
												<i className="fal fa-bars mg-r-3"></i>{" "}
												<span>{lang.accounts}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="accounts">
												<li className="animation">
													<Link href="/accounts/day-close">
														{lang.day_close}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts/chart-of-accounts">
														{lang.chart_of_accounts}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts/financial-year">
														{lang.financial_year}
													</Link>
												</li>
											</ul>
										</li>
										{/* Chart of Accounts End*/}

										{/* Voucher Start*/}
										<li>
											<Link href="#voucher" data-bs-toggle="collapse">
												<i className="fal fa-file-invoice mg-r-3"></i>{" "}
												<span>{lang.voucher}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="voucher">
												<li className="animation">
													<Link href="/voucher/new-voucher">
														{lang.new} {lang.voucher}
													</Link>
												</li>
												<li className="animation">
													<Link href="/voucher/voucher-list">
														{lang.voucher_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/voucher/voucher-search">
														{lang.voucher_search}
													</Link>
												</li>
											</ul>
										</li>
										{/* Voucher End*/}

										{/* Reports Start*/}
										<li>
											<Link href="#reports" data-bs-toggle="collapse">
												<i className="fal fa-warehouse-alt"></i>{" "}
												<span>{lang.inventory + " " + lang.reports}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="reports">
												<li className="animation">
													<Link href="/reports/summary-report">
														{lang.summary_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-report">
														{lang.purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-due-report">
														{lang.purchase_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-payment-report">
														{lang.purchase_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-report">
														{lang.purchase_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-collection-report">
														{lang.return_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-report">
														{lang.sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-due-report">
														{lang.sales_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-collection-report">
														{lang.sales_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-report">
														{lang.sales_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-payment-report">
														{lang.return_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-report">
														{lang.supplier_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-purchase-report">
														{lang.supplier_purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-payment-report">
														{lang.supplier_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-due-report">
														{lang.supplier_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-report">
														{lang.customer_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-sales-report">
														{lang.customer_sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-collection-report">
														{lang.customer_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-due-report">
														{lang.customer_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Reports End*/}

										{/* Accounts Report Start*/}
										<li>
											<Link href="#accounts_report" data-bs-toggle="collapse">
												<i className="fal fa-file-chart-line mg-r-3"></i>{" "}
												<span>{lang.accounts_report}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="accounts_report">
												<li className="animation">
													<Link href="/accounts-report/ledger-report">
														{lang.ledger_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/balance-sheet">
														{lang.balance_sheet}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/income-expenditure">
														{lang.income_expenditure}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/trial-balance">
														{lang.trial_balance}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/receipts-payments">
														{lang.receipts_payments}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/balance-sheet-note">
														{lang.balance_sheet_note}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/income-expenditure-note">
														{lang.income_expenditure_note}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/cash-book">
														{lang.cash_book}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/bank-book">
														{lang.bank_book}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/changes-in-equity">
														{lang.changes_in_equity}
													</Link>
												</li>
											</ul>
										</li>
										{/* Accounts Report End*/}

										{/* User Start*/}
										<li>
											<Link href="#users" data-bs-toggle="collapse">
												<i className="fal fa-user mg-r-3"></i>{" "}
												<span>{lang.users}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="users">
												<li className="animation">
													<Link href="/users/user-list">{lang.user_list}</Link>
												</li>
												<li className="animation">
													<Link href="/users/profile">{lang.my_profile}</Link>
												</li>
												<li className="animation">
													<Link href="/users/profile-picture">
														{lang.profile_picture}
													</Link>
												</li>
												<li className="animation">
													<Link href="/users/change-password">
														{lang.change_password}
													</Link>
												</li>
											</ul>
										</li>
										{/* User End*/}

										{/* Settings Start*/}
										<li>
											<Link href="#settings" data-bs-toggle="collapse">
												<i className="fal fa-cog mg-r-3"></i>{" "}
												<span>{lang.settings}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="settings">
												<li className="animation">
													<Link href="/settings/language">{lang.language}</Link>
												</li>
											</ul>
										</li>
										{/* Settings End*/}
									</>
								);
							}

							// For Project Manager
							else if (user_group == 4) {
								return (
									<>
										{/* Company & Project*/}
										<li>
											<Link href="#company_project" data-bs-toggle="collapse">
												<i className="fal fa-sitemap mg-r-3"></i>{" "}
												<span>{lang.project}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="company_project">
												<li className="animation">
													<Link href="/company-owner">{lang.owner}</Link>
												</li>
												<li className="animation">
													<Link href="/branch">{lang.project}</Link>
												</li>
												{/* <li className="animation">
													<Link href="/project_owner">
														{lang.project_owner}
													</Link>
												</li> */}
											</ul>
										</li>
										{/* Chart of Accounts End*/}

										{/* Products Start*/}
										<li>
											<Link href="#products" data-bs-toggle="collapse">
												<i className="fal fa-wallet"></i>{" "}
												<span>{lang.products}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="products">
												<li className="animation">
													<Link href="/products/create">
														{lang.new_product}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-list">
														{lang.product_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-category">
														{lang.product_category}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-brand">
														{lang.product_brand}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-type">
														{lang.product_type}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-unit">
														{lang.product_unit}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Products End*/}

										{/* Warehouse Start*/}
										<li>
											<Link href="#warehouse" data-bs-toggle="collapse">
												<i className="fal fa-warehouse"></i>{" "}
												<span>{lang.warehouse}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="warehouse">
												<li className="animation">
													<Link href="/warehouse/warehouse-list">
														{lang.warehouse_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Warehouse End*/}

										{/* Purchase Start*/}
										<li>
											<Link href="#purchase" data-bs-toggle="collapse">
												<i className="fal fa-shopping-bag"></i>{" "}
												<span>{lang.purchase}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="purchase">
												<li className="animation">
													<Link href="/purchase/create">
														{lang.new_purchase}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-list">
														{lang.purchase_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return">
														{lang.purchase_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-list">
														{lang.purchase_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/due-payment">
														{lang.due_payment}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/return-due-collection">
														{lang.return + " " + lang.due_collection}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-report">
														{lang.purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-due-report">
														{lang.purchase_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-payment-report">
														{lang.purchase_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-report">
														{lang.purchase_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-collection-report">
														{lang.return_collection_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Purchase End*/}

										{/* Suppliers Start*/}
										<li>
											<Link href="#suppliers" data-bs-toggle="collapse">
												<i className="fal fa-truck"></i>{" "}
												<span>{lang.suppliers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="suppliers">
												<li className="animation">
													<Link href="/suppliers/create">
														{lang.new_supplier}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-list">
														{lang.supplier_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-report">
														{lang.supplier_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-purchase-report">
														{lang.supplier_purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-payment-report">
														{lang.supplier_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-due-report">
														{lang.supplier_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Suppliers End*/}

										{/* Sales Start*/}
										<li>
											<Link href="#sales" data-bs-toggle="collapse">
												<i className="fal fa-taco"></i>{" "}
												<span>{lang.sales}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="sales">
												<li className="animation">
													<Link href="/sales/create">{lang.new_sales}</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-list">
														{lang.sales_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return">
														{lang.sales_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-list">
														{lang.sales_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/due-collection">
														{lang.due_collection}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/return-due-payment">
														{lang.return + " " + lang.due_payment}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-report">
														{lang.sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-due-report">
														{lang.sales_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-collection-report">
														{lang.sales_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-report">
														{lang.sales_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-payment-report">
														{lang.return_payment_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Sales End*/}

										{/* Customers Start*/}
										<li>
											<Link href="#customers" data-bs-toggle="collapse">
												<i className="fal fa-user"></i>{" "}
												<span>{lang.customers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="customers">
												<li className="animation">
													<Link href="/customers/create">
														{lang.new_customer}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-list">
														{lang.customer_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-report">
														{lang.customer_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-sales-report">
														{lang.customer_sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-collection-report">
														{lang.customer_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-due-report">
														{lang.customer_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Customers End*/}

										{/* Chart of Accounts Start*/}
										<li>
											<Link href="#accounts" data-bs-toggle="collapse">
												<i className="fal fa-bars mg-r-3"></i>{" "}
												<span>{lang.accounts}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="accounts">
												<li className="animation">
													<Link href="/accounts/day-close">
														{lang.day_close}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts/chart-of-accounts">
														{lang.chart_of_accounts}
													</Link>
												</li>
											</ul>
										</li>
										{/* Chart of Accounts End*/}

										{/* Voucher Start*/}
										<li>
											<Link href="#voucher" data-bs-toggle="collapse">
												<i className="fal fa-file-invoice mg-r-3"></i>{" "}
												<span>{lang.voucher}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="voucher">
												<li className="animation">
													<Link href="/voucher/new-voucher">
														{lang.new} {lang.voucher}
													</Link>
												</li>
												<li className="animation">
													<Link href="/voucher/voucher-list">
														{lang.voucher_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/voucher/voucher-search">
														{lang.voucher_search}
													</Link>
												</li>
											</ul>
										</li>
										{/* Voucher End*/}

										{/* Reports Start*/}
										<li>
											<Link href="#reports" data-bs-toggle="collapse">
												<i className="fal fa-warehouse-alt"></i>{" "}
												<span>{lang.inventory + " " + lang.reports}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="reports">
												<li className="animation">
													<Link href="/reports/summary-report">
														{lang.summary_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-report">
														{lang.purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-due-report">
														{lang.purchase_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-payment-report">
														{lang.purchase_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-report">
														{lang.purchase_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-collection-report">
														{lang.return_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-report">
														{lang.sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-due-report">
														{lang.sales_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-collection-report">
														{lang.sales_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-report">
														{lang.sales_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-payment-report">
														{lang.return_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-report">
														{lang.supplier_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-purchase-report">
														{lang.supplier_purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-payment-report">
														{lang.supplier_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-due-report">
														{lang.supplier_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-report">
														{lang.customer_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-sales-report">
														{lang.customer_sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-collection-report">
														{lang.customer_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-due-report">
														{lang.customer_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Reports End*/}

										{/* Accounts Report Start*/}
										<li>
											<Link href="#accounts_report" data-bs-toggle="collapse">
												<i className="fal fa-file-chart-line mg-r-3"></i>{" "}
												<span>{lang.accounts_report}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="accounts_report">
												<li className="animation">
													<Link href="/accounts-report/ledger-report">
														{lang.ledger_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/balance-sheet">
														{lang.balance_sheet}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/income-expenditure">
														{lang.income_expenditure}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/trial-balance">
														{lang.trial_balance}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/receipts-payments">
														{lang.receipts_payments}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/balance-sheet-note">
														{lang.balance_sheet_note}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/income-expenditure-note">
														{lang.income_expenditure_note}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/cash-book">
														{lang.cash_book}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/bank-book">
														{lang.bank_book}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/changes-in-equity">
														{lang.changes_in_equity}
													</Link>
												</li>
											</ul>
										</li>
										{/* Accounts Report End*/}

										{/* User Start*/}
										<li>
											<Link href="#users" data-bs-toggle="collapse">
												<i className="fal fa-user mg-r-3"></i>{" "}
												<span>{lang.users}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="users">
												<li className="animation">
													<Link href="/users/user-list">{lang.user_list}</Link>
												</li>
												<li className="animation">
													<Link href="/users/profile">{lang.my_profile}</Link>
												</li>
												<li className="animation">
													<Link href="/users/profile-picture">
														{lang.profile_picture}
													</Link>
												</li>
												<li className="animation">
													<Link href="/users/change-password">
														{lang.change_password}
													</Link>
												</li>
											</ul>
										</li>
										{/* User End*/}

										{/* Settings Start*/}
										<li>
											<Link href="#settings" data-bs-toggle="collapse">
												<i className="fal fa-cog mg-r-3"></i>{" "}
												<span>{lang.settings}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="settings">
												<li className="animation">
													<Link href="/settings/language">{lang.language}</Link>
												</li>
											</ul>
										</li>
										{/* Settings End*/}
									</>
								);
							}
							// For Sales & Purchase
							else if (user_group == 5) {
								return (
									<>
										{/* Products Start*/}
										<li>
											<Link href="#products" data-bs-toggle="collapse">
												<i className="fal fa-wallet"></i>{" "}
												<span>{lang.products}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="products">
												<li className="animation">
													<Link href="/products/create">
														{lang.new_product}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-list">
														{lang.product_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-category">
														{lang.product_category}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-brand">
														{lang.product_brand}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-type">
														{lang.product_type}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-unit">
														{lang.product_unit}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Products End*/}

										{/* Warehouse Start*/}
										<li>
											<Link href="#warehouse" data-bs-toggle="collapse">
												<i className="fal fa-warehouse"></i>{" "}
												<span>{lang.warehouse}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="warehouse">
												<li className="animation">
													<Link href="/warehouse/warehouse-list">
														{lang.warehouse_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Warehouse End*/}

										{/* Purchase Start*/}
										<li>
											<Link href="#purchase" data-bs-toggle="collapse">
												<i className="fal fa-shopping-bag"></i>{" "}
												<span>{lang.purchase}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="purchase">
												<li className="animation">
													<Link href="/purchase/create">
														{lang.new_purchase}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-list">
														{lang.purchase_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return">
														{lang.purchase_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-list">
														{lang.purchase_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/due-payment">
														{lang.due_payment}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/return-due-collection">
														{lang.return + " " + lang.due_collection}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-report">
														{lang.purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-due-report">
														{lang.purchase_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-payment-report">
														{lang.purchase_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-report">
														{lang.purchase_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-collection-report">
														{lang.return_collection_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Purchase End*/}

										{/* Suppliers Start*/}
										<li>
											<Link href="#suppliers" data-bs-toggle="collapse">
												<i className="fal fa-truck"></i>{" "}
												<span>{lang.suppliers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="suppliers">
												<li className="animation">
													<Link href="/suppliers/create">
														{lang.new_supplier}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-list">
														{lang.supplier_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-report">
														{lang.supplier_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-purchase-report">
														{lang.supplier_purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-payment-report">
														{lang.supplier_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-due-report">
														{lang.supplier_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Suppliers End*/}

										{/* Sales Start*/}
										<li>
											<Link href="#sales" data-bs-toggle="collapse">
												<i className="fal fa-taco"></i>{" "}
												<span>{lang.sales}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="sales">
												<li className="animation">
													<Link href="/sales/create">{lang.new_sales}</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-list">
														{lang.sales_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return">
														{lang.sales_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-list">
														{lang.sales_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/due-collection">
														{lang.due_collection}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/return-due-payment">
														{lang.return + " " + lang.due_payment}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-report">
														{lang.sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-due-report">
														{lang.sales_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-collection-report">
														{lang.sales_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-report">
														{lang.sales_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-payment-report">
														{lang.return_payment_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Sales End*/}

										{/* Customers Start*/}
										<li>
											<Link href="#customers" data-bs-toggle="collapse">
												<i className="fal fa-user"></i>{" "}
												<span>{lang.customers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="customers">
												<li className="animation">
													<Link href="/customers/create">
														{lang.new_customer}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-list">
														{lang.customer_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-report">
														{lang.customer_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-sales-report">
														{lang.customer_sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-collection-report">
														{lang.customer_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-due-report">
														{lang.customer_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Customers End*/}

										{/* Chart of Accounts Start*/}
										<li>
											<Link href="#accounts" data-bs-toggle="collapse">
												<i className="fal fa-bars mg-r-3"></i>{" "}
												<span>{lang.accounts}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="accounts">
												<li className="animation">
													<Link href="/accounts/day-close">
														{lang.day_close}
													</Link>
												</li>
											</ul>
										</li>
										{/* Chart of Accounts End*/}

										{/* Voucher Start*/}
										<li>
											<Link href="#voucher" data-bs-toggle="collapse">
												<i className="fal fa-file-invoice mg-r-3"></i>{" "}
												<span>{lang.voucher}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="voucher">
												<li className="animation">
													<Link href="/voucher/new-voucher">
														{lang.new} {lang.voucher}
													</Link>
												</li>
												<li className="animation">
													<Link href="/voucher/voucher-list">
														{lang.voucher_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/voucher/voucher-search">
														{lang.voucher_search}
													</Link>
												</li>
											</ul>
										</li>
										{/* Voucher End*/}

										{/* Reports Start*/}
										<li>
											<Link href="#reports" data-bs-toggle="collapse">
												<i className="fal fa-user"></i>{" "}
												<span>{lang.reports}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="reports">
												<li className="animation">
													<Link href="/reports/summary-report">
														{lang.summary_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-report">
														{lang.purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-due-report">
														{lang.purchase_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-payment-report">
														{lang.purchase_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-report">
														{lang.purchase_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-collection-report">
														{lang.return_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-report">
														{lang.sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-due-report">
														{lang.sales_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-collection-report">
														{lang.sales_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-report">
														{lang.sales_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-payment-report">
														{lang.return_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-report">
														{lang.supplier_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-purchase-report">
														{lang.supplier_purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-payment-report">
														{lang.supplier_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-due-report">
														{lang.supplier_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-report">
														{lang.customer_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-sales-report">
														{lang.customer_sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-collection-report">
														{lang.customer_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-due-report">
														{lang.customer_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Reports End*/}

										{/* User Start*/}
										<li>
											<Link href="#users" data-bs-toggle="collapse">
												<i className="fal fa-user mg-r-3"></i>{" "}
												<span>{lang.users}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="users">
												<li className="animation">
													<Link href="/users/profile">{lang.my_profile}</Link>
												</li>
												<li className="animation">
													<Link href="/users/profile-picture">
														{lang.profile_picture}
													</Link>
												</li>
												<li className="animation">
													<Link href="/users/change-password">
														{lang.change_password}
													</Link>
												</li>
											</ul>
										</li>
										{/* User End*/}

										{/* Settings Start*/}
										<li>
											<Link href="#settings" data-bs-toggle="collapse">
												<i className="fal fa-cog mg-r-3"></i>{" "}
												<span>{lang.settings}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="settings">
												<li className="animation">
													<Link href="/settings/language">{lang.language}</Link>
												</li>
											</ul>
										</li>
										{/* Settings End*/}
									</>
								);
							}

							// For Purchase
							else if (user_group == 7) {
								return (
									<>
										{/* Products Start*/}
										<li>
											<Link href="#products" data-bs-toggle="collapse">
												<i className="fal fa-wallet"></i>{" "}
												<span>{lang.products}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="products">
												<li className="animation">
													<Link href="/products/create">
														{lang.new_product}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-list">
														{lang.product_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-category">
														{lang.product_category}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-brand">
														{lang.product_brand}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-type">
														{lang.product_type}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-unit">
														{lang.product_unit}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Products End*/}

										{/* Warehouse Start*/}
										<li>
											<Link href="#warehouse" data-bs-toggle="collapse">
												<i className="fal fa-warehouse"></i>{" "}
												<span>{lang.warehouse}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="warehouse">
												<li className="animation">
													<Link href="/warehouse/warehouse-list">
														{lang.warehouse_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Warehouse End*/}

										{/* Purchase Start*/}
										<li>
											<Link href="#purchase" data-bs-toggle="collapse">
												<i className="fal fa-shopping-bag"></i>{" "}
												<span>{lang.purchase}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="purchase">
												<li className="animation">
													<Link href="/purchase/create">
														{lang.new_purchase}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-list">
														{lang.purchase_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return">
														{lang.purchase_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-list">
														{lang.purchase_return_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Purchase End*/}

										{/* Suppliers Start*/}
										<li>
											<Link href="#suppliers" data-bs-toggle="collapse">
												<i className="fal fa-truck"></i>{" "}
												<span>{lang.suppliers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="suppliers">
												<li className="animation">
													<Link href="/suppliers/create">
														{lang.new_supplier}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-list">
														{lang.supplier_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Suppliers End*/}

										{/* Reports Start*/}
										<li>
											<Link href="#reports" data-bs-toggle="collapse">
												<i className="fal fa-user"></i>{" "}
												<span>{lang.reports}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="reports">
												<li className="animation">
													<Link href="/reports/summary-report">
														{lang.summary_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-report">
														{lang.purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-due-report">
														{lang.purchase_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-payment-report">
														{lang.purchase_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-report">
														{lang.purchase_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-collection-report">
														{lang.return_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-report">
														{lang.supplier_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-purchase-report">
														{lang.supplier_purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-payment-report">
														{lang.supplier_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-due-report">
														{lang.supplier_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Reports End*/}

										{/* User Start*/}
										<li>
											<Link href="#users" data-bs-toggle="collapse">
												<i className="fal fa-user mg-r-3"></i>{" "}
												<span>{lang.users}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="users">
												<li className="animation">
													<Link href="/users/profile">{lang.my_profile}</Link>
												</li>
												<li className="animation">
													<Link href="/users/profile-picture">
														{lang.profile_picture}
													</Link>
												</li>
												<li className="animation">
													<Link href="/users/change-password">
														{lang.change_password}
													</Link>
												</li>
											</ul>
										</li>
										{/* User End*/}

										{/* Settings Start*/}
										<li>
											<Link href="#settings" data-bs-toggle="collapse">
												<i className="fal fa-cog mg-r-3"></i>{" "}
												<span>{lang.settings}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="settings">
												<li className="animation">
													<Link href="/settings/language">{lang.language}</Link>
												</li>
											</ul>
										</li>
										{/* Settings End*/}
									</>
								);
							}

							// For Accounts
							else if (user_group == 8) {
								return (
									<>
										{/* Products Start*/}
										<li>
											<Link href="#products" data-bs-toggle="collapse">
												<i className="fal fa-wallet"></i>{" "}
												<span>{lang.products}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="products">
												<li className="animation">
													<Link href="/products/create">
														{lang.new_product}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-list">
														{lang.product_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Products End*/}

										{/* Warehouse Start*/}
										<li>
											<Link href="#warehouse" data-bs-toggle="collapse">
												<i className="fal fa-warehouse"></i>{" "}
												<span>{lang.warehouse}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="warehouse">
												<li className="animation">
													<Link href="/warehouse/warehouse-list">
														{lang.warehouse_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Warehouse End*/}

										{/* Purchase Start*/}
										<li>
											<Link href="#purchase" data-bs-toggle="collapse">
												<i className="fal fa-shopping-bag"></i>{" "}
												<span>{lang.purchase}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="purchase">
												<li className="animation">
													<Link href="/purchase/create">
														{lang.new_purchase}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-list">
														{lang.purchase_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return">
														{lang.purchase_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-list">
														{lang.purchase_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/due-payment">
														{lang.due_payment}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/return-due-collection">
														{lang.return + " " + lang.due_collection}
													</Link>
												</li>
											</ul>
										</li>
										{/* Purchase End*/}

										{/* Suppliers Start*/}
										<li>
											<Link href="#suppliers" data-bs-toggle="collapse">
												<i className="fal fa-truck"></i>{" "}
												<span>{lang.suppliers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="suppliers">
												<li className="animation">
													<Link href="/suppliers/create">
														{lang.new_supplier}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-list">
														{lang.supplier_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Suppliers End*/}

										{/* Sales Start*/}
										<li>
											<Link href="#sales" data-bs-toggle="collapse">
												<i className="fal fa-taco"></i>{" "}
												<span>{lang.sales}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="sales">
												<li className="animation">
													<Link href="/sales/create">{lang.new_sales}</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-list">
														{lang.sales_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return">
														{lang.sales_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-list">
														{lang.sales_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/due-collection">
														{lang.due_collection}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/return-due-payment">
														{lang.return + " " + lang.due_payment}
													</Link>
												</li>
											</ul>
										</li>
										{/* Sales End*/}

										{/* Customers Start*/}
										<li>
											<Link href="#customers" data-bs-toggle="collapse">
												<i className="fal fa-user"></i>{" "}
												<span>{lang.customers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="customers">
												<li className="animation">
													<Link href="/customers/create">
														{lang.new_customer}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-list">
														{lang.customer_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Customers End*/}

										{/* Chart of Accounts Start*/}
										<li>
											<Link href="#accounts" data-bs-toggle="collapse">
												<i className="fal fa-bars mg-r-3"></i>{" "}
												<span>{lang.accounts}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="accounts">
												<li className="animation">
													<Link href="/accounts/day-close">
														{lang.day_close}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts/chart-of-accounts">
														{lang.chart_of_accounts}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts/financial-year">
														{lang.financial_year}
													</Link>
												</li>
											</ul>
										</li>
										{/* Chart of Accounts End*/}

										{/* Voucher Start*/}
										<li>
											<Link href="#voucher" data-bs-toggle="collapse">
												<i className="fal fa-file-invoice mg-r-3"></i>{" "}
												<span>{lang.voucher}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="voucher">
												<li className="animation">
													<Link href="/voucher/new-voucher">
														{lang.new} {lang.voucher}
													</Link>
												</li>
												<li className="animation">
													<Link href="/voucher/voucher-list">
														{lang.voucher_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/voucher/voucher-search">
														{lang.voucher_search}
													</Link>
												</li>
											</ul>
										</li>
										{/* Voucher End*/}

										{/* Reports Start*/}
										<li>
											<Link href="#reports" data-bs-toggle="collapse">
												<i className="fal fa-warehouse-alt"></i>{" "}
												<span>{lang.inventory + " " + lang.reports}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="reports">
												<li className="animation">
													<Link href="/reports/summary-report">
														{lang.summary_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-report">
														{lang.purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-due-report">
														{lang.purchase_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-payment-report">
														{lang.purchase_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-report">
														{lang.purchase_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/purchase/purchase-return-collection-report">
														{lang.return_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-report">
														{lang.sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-due-report">
														{lang.sales_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-collection-report">
														{lang.sales_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-report">
														{lang.sales_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-payment-report">
														{lang.return_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-report">
														{lang.supplier_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-purchase-report">
														{lang.supplier_purchase_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-payment-report">
														{lang.supplier_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/suppliers/supplier-due-report">
														{lang.supplier_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-report">
														{lang.customer_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-sales-report">
														{lang.customer_sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-collection-report">
														{lang.customer_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-due-report">
														{lang.customer_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Reports End*/}

										{/* Accounts Report Start*/}
										<li>
											<Link href="#accounts_report" data-bs-toggle="collapse">
												<i className="fal fa-file-chart-line mg-r-3"></i>{" "}
												<span>{lang.accounts_report}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="accounts_report">
												<li className="animation">
													<Link href="/accounts-report/ledger-report">
														{lang.ledger_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/balance-sheet">
														{lang.balance_sheet}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/income-expenditure">
														{lang.income_expenditure}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/trial-balance">
														{lang.trial_balance}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/receipts-payments">
														{lang.receipts_payments}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/balance-sheet-note">
														{lang.balance_sheet_note}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/income-expenditure-note">
														{lang.income_expenditure_note}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/cash-book">
														{lang.cash_book}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/bank-book">
														{lang.bank_book}
													</Link>
												</li>
												<li className="animation">
													<Link href="/accounts-report/changes-in-equity">
														{lang.changes_in_equity}
													</Link>
												</li>
											</ul>
										</li>
										{/* Accounts Report End*/}

										{/* User Start*/}
										<li>
											<Link href="#users" data-bs-toggle="collapse">
												<i className="fal fa-user mg-r-3"></i>{" "}
												<span>{lang.users}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="users">
												<li className="animation">
													<Link href="/users/profile">{lang.my_profile}</Link>
												</li>
												<li className="animation">
													<Link href="/users/profile-picture">
														{lang.profile_picture}
													</Link>
												</li>
												<li className="animation">
													<Link href="/users/change-password">
														{lang.change_password}
													</Link>
												</li>
											</ul>
										</li>
										{/* User End*/}

										{/* Settings Start*/}
										<li>
											<Link href="#settings" data-bs-toggle="collapse">
												<i className="fal fa-cog mg-r-3"></i>{" "}
												<span>{lang.settings}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="settings">
												<li className="animation">
													<Link href="/settings/language">{lang.language}</Link>
												</li>
											</ul>
										</li>
										{/* Settings End*/}
									</>
								);
							}

							// For Sales
							else {
								return (
									<>
										{/* Products Start*/}
										<li>
											<Link href="#products" data-bs-toggle="collapse">
												<i className="fal fa-wallet"></i>{" "}
												<span>{lang.products}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="products">
												<li className="animation">
													<Link href="/products/create">
														{lang.new_product}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-list">
														{lang.product_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-category">
														{lang.product_category}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-brand">
														{lang.product_brand}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-type">
														{lang.product_type}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-unit">
														{lang.product_unit}
													</Link>
												</li>
											</ul>
										</li>
										{/* Products End*/}

										{/* Warehouse Start*/}
										<li>
											<Link href="#warehouse" data-bs-toggle="collapse">
												<i className="fal fa-warehouse"></i>{" "}
												<span>{lang.warehouse}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="warehouse">
												<li className="animation">
													<Link href="/warehouse/warehouse-list">
														{lang.warehouse_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Warehouse End*/}

										{/* Sales Start*/}
										<li>
											<Link href="#sales" data-bs-toggle="collapse">
												<i className="fal fa-taco"></i>{" "}
												<span>{lang.sales}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="sales">
												<li className="animation">
													<Link href="/sales/create">{lang.new_sales}</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-list">
														{lang.sales_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return">
														{lang.sales_return}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-list">
														{lang.sales_return_list}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/due-collection">
														{lang.due_collection}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/return-due-payment">
														{lang.return + " " + lang.due_payment}
													</Link>
												</li>
											</ul>
										</li>
										{/* Sales End*/}

										{/* Customers Start*/}
										<li>
											<Link href="#customers" data-bs-toggle="collapse">
												<i className="fal fa-user"></i>{" "}
												<span>{lang.customers}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="customers">
												<li className="animation">
													<Link href="/customers/create">
														{lang.new_customer}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-list">
														{lang.customer_list}
													</Link>
												</li>
											</ul>
										</li>
										{/* Customers End*/}

										{/* Reports Start*/}
										<li>
											<Link href="#reports" data-bs-toggle="collapse">
												<i className="fal fa-warehouse-alt"></i>{" "}
												<span>{lang.inventory + " " + lang.reports}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="reports">
												<li className="animation">
													<Link href="/reports/summary-report">
														{lang.summary_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/products/product-report">
														{lang.product_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-report">
														{lang.sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-due-report">
														{lang.sales_due_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-collection-report">
														{lang.sales_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-report">
														{lang.sales_return_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/sales/sales-return-payment-report">
														{lang.return_payment_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-report">
														{lang.customer_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-sales-report">
														{lang.customer_sales_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-collection-report">
														{lang.customer_collection_report}
													</Link>
												</li>
												<li className="animation">
													<Link href="/customers/customer-due-report">
														{lang.customer_due_report}
													</Link>
												</li>
											</ul>
										</li>
										{/* Reports End*/}

										{/* User Start*/}
										<li>
											<Link href="#users" data-bs-toggle="collapse">
												<i className="fal fa-user mg-r-3"></i>{" "}
												<span>{lang.users}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="users">
												<li className="animation">
													<Link href="/users/profile">{lang.my_profile}</Link>
												</li>
												<li className="animation">
													<Link href="/users/profile-picture">
														{lang.profile_picture}
													</Link>
												</li>
												<li className="animation">
													<Link href="/users/change-password">
														{lang.change_password}
													</Link>
												</li>
											</ul>
										</li>
										{/* User End*/}

										{/* Settings Start*/}
										<li>
											<Link href="#settings" data-bs-toggle="collapse">
												<i className="fal fa-cog mg-r-3"></i>{" "}
												<span>{lang.settings}</span>{" "}
												<i className="accordion-icon fa fa-angle-down"></i>
											</Link>
											<ul className="collapse sub-menu" id="settings">
												<li className="animation">
													<Link href="/settings/language">{lang.language}</Link>
												</li>
											</ul>
										</li>
										{/* Settings End*/}
									</>
								);
							}
						})()}

						{/* Logout Start*/}
						<li className="animation">
							<Link href="/logout">
								<i className="fal fa-sign-out mg-r-3"></i>{" "}
								<span>{lang.logout}</span>
							</Link>
						</li>
						{/* Logout End*/}
					</ul>
				</div>
				{/* Page Sidebar Menu End */}

				{/* Sidebar Footer Start */}
				<div className="sidebar-footer">
					<Link
						className="pull-left"
						href="/users/profile"
						title={lang.my_profile}>
						<i className="fal fa-user wd-16"></i>
					</Link>
					<Link
						className="pull-left"
						href="/users/profile-picture"
						title={lang.profile_picture}>
						<i className="fal fa-image"></i>
					</Link>
					<Link
						className="pull-left"
						href="/users/change-password"
						title={lang.change_password}>
						<i className="fal fa-lock"></i>
					</Link>
					<Link className="pull-left" href="/logout" title={lang.logout}>
						<i className="fal fa-sign-out wd-16"></i>
					</Link>
				</div>
				{/* Sidebar Footer End */}
			</div>
			{/* Page Sidebar Inner End */}
		</>
	);
};

export default Sidebar;
