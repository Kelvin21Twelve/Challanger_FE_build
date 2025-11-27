export const createUserEndpoint = "/users";
export const makeEndpoint = "/make";
export const getLogoEndpoint = "/get_logo";
export const syncDbEndpoint = "/syncDB";
export const loginEndpoint = "/login";
export const commonDeleteEndpoint = "/common_delete/";
export const jobCountEndpoint = "get_jobs_count";
export const newSparePartsCountEndpoint = "get_newspare_count";
export const usedSparePartsCountEndpoint = "get_usedspare_count";

export const createMakeEndpoint = "/make";

export const getCompleteJobsEndpoint = "/get_complete_jobs";
export const getCompleteJobDetailsEndpoint = "/get_complete_job_details";
export const printCompleteJobDetailsEndpoint = "/print_complete_jobcard";

export const getCarDetailsEndpoint = "/get_car_details";
export const getUserPartsEndpoint = "/get_user_parts_details";
export const getSupplierPaymentsEndpoint = "/get_purchase_history";

export const getCabHistoryEndpoint = "/get_cab_history?cab_no=:cab_no";

export const searchGeneralLedgerEndpoint = "/general_ledger_search";

export const jobCardSparePartsInvoiceEndpoint = "/get_new_spare_parts_useds";
export const jobCardLabourListEndpoint = "/get_cust_labour_list";

export const jobCardUsedSparePartsListEndpoint = "/get_used_spare_parts";
export const jobCardLabourDropdownListEndpoint = "/get_labour";
export const jobCardAddLabourEndpoint = "/add_customers_labours";
export const jobCardUpdateLabourEndpoint = "/custs_labours_update/:id";

export const jobCardUpdateEndpoint = "/job_card_update/:id";
export const jobCardDiscountApplyEndpoint = "/job_card_discount/:id";
export const jobCardCreatedDetailsEndpoint = "/get_name_of_job_created";
export const jobCardLabourDiscountUpdateEndpoint =
  "/insert_labour_discount_entry";

export const jobCardPaymentInsertEndpoint = "/payment_insert";
export const jobPrintCustomerPaymentsEndpoint = "/print_customer_payment";
export const jobUsedPartsInsertEndpoint = "/cust_used_spare_parts_insert";
export const jobUsedPartsUpdateEndpoint = "/cust_used_spare_parts_update/:id";
export const jobCardPaymentsTableEndpoint = "/get_payment_details";
export const jobCardLockUnlockEndpoint = "/lock_unlock_jobcard";

export const getCabsListEndpoint = "/getCabs";
export const getCabDetailsEndpoint = "/get_cab_details";
export const getItemCodeEndpoint = "/get_item_code";

export const createCustomerSparePartsItemEndpoint =
  "/cuts_new_spare_parts_insert";
export const jobListEndpoint = "/get_job_cards?status=:status&cust_id=:cust_id";

export const searchCabEndpoint = "/search_customer";
export const transferCabEndpoint = "/transfer_cab";
export const jobCardInsertEndpoint = "/job_card_insert";

export const createSystemUserEndpoint = "/register";

export const createRoleEndpoint = "/add_roles";
export const deleteRoleEndpoint = "/delete_role";
export const updateRoleEndpoint = "/roles_update/";
export const updatePermissionEndpoint = "/permission_insert";
export const uploadNewSparePartsExcelEndpoint = "/newspareexcel_add";

export const createSupplierPaymentEndpoint = "/add_supplier_payment_acc";
export const getAccountDetailsPrintEndpoint = "/account_details_print";
export const getPrintAccountDetailsEndpoint = "/print_account_details";
export const getGeneralLedgerByIdEndpoint = "/general_ledger_get";
export const editGeneralLedgerEndpoint = "/general_ledger_edit";
export const insertGeneralLedgerEndpoint = "/general_ledger_insert";
export const deleteGeneralLedgerEndpoint = "/general_ledger_delete";
export const searchPastInvoiceEndpoint = "/search_pst_invoice";
export const searchSparePartsPurchasedEndpoint = "/spare_part_purchased";
export const purchaseReturnEndpoint = "/purchase_return";
export const sparePartsReturnedEndpoint = "/spare_part_returned";
export const sparePartsSoldEndpoint = "/spare_part_soled";
export const sparePartsToReturnTableEndpoint = "/spare_part_to_return_table";
export const searchMasterEndpoint = "/search_master";
export const notifications1Endpoint = "/get_minlimit_spare";
export const notifications2Endpoint = "/check_visa_expiry";
export const changePasswordEndpoint = "/change_password";
export const getSparePartsHistoryEndpoint = "/spare_part_history";
export const addSparePartsPurchaseEndpoint = "/add_spare_purcahse";
export const getOrderHistoryEndpoint = "/order_history";
export const printInvoiceDetailsEndpoint = "/print_invoice_details";
export const createEditEmployeeEndpoint = "/employee_insert";
export const createEditAdditionsEndpoint = "/eadditions_store";
export const createEditHrmsEndpoint = "/:modal_name_store";
export const getSalaryDetailsEndpoint = "/get_salaryrel";
export const getSalaryPrintEndpoint = "/print_sal_rel_details";
export const searchPayrollEndpoint = "/search_payroll";
export const getPayrollEndpoint = "/get_payroll";
export const printPayrollEndpoint = "/print_payroll_details";
export const getMeDetailsEndpoint = "/details";
export const soldSparePartsToReturnEndpoint = "/spare_part_to_return";
export const jobCardRefundEndpoint = "/job_card_payment_refund";
export const getRefundReceipt = "/get_refund_receipt";
