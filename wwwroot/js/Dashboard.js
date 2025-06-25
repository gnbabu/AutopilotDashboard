$(document).ready(function () {

    $.ajax({
        url: '/Home/GetOrders',
        method: 'GET',
        success: function (response) {
            debugger;
            // Example 1: Employee Data Grid
            $('#orders-grid-container').dataGrid({
                // apiUrl: 'http://localhost:53393/api/employees/all',
                data: response,
                columns :[
                    //{
                    //    key: 'action',
                    //    title: '',
                    //    type: 'action',
                    //    sortable: false,
                    //    cellTemplate: function (row) {
                    //        return `<a href="#" class="data-link text-primary" data-id="${row.serviceTag}">Review</a>`;
                    //    }
                    //},
                    { key: 'serviceTag', title: 'Service Tag', type: 'text', sortable: true },
                    { key: 'customerSalesOrderNo', title: 'Sales Order No', type: 'text', sortable: true },
                    { key: 'tenantId', title: 'Tenant ID', type: 'text', sortable: false },
                    { key: 'tenantDomain', title: 'Tenant Domain', type: 'text', sortable: false },
                    { key: 'groupTag', title: 'Group Tag', type: 'text', sortable: false },
                    { key: 'skuNumber', title: 'SKU Number', type: 'text', sortable: false },
                    { key: 'statusComment', title: 'Status Comment', type: 'text', sortable: false },
                    { key: 'creationDate', title: 'Creation Date', type: 'date', sortable: true },
                    { key: 'lastUpdateDate', title: 'Last Update Date', type: 'date', sortable: true },
                    { key: 'buid', title: 'BUID', type: 'text', sortable: false }
                ],
                gridTitle: '',
                noDataMessage: 'No orders found.',
                idProperty: 'name', // If your employee objects have an 'employeeId' property
                enableAllColumnSearch: true,
                enableColumnFilters: true,
                enableColumnVisibility: true,
                enableSorting: true,
                exportOptions: {
                    enable: true,
                    copy: true,
                    excel: true,
                    pdf: true
                }

            });
        },
        error: function (err) {
            alert("Error loading data.");
            console.error(err);
        }
    });


    // Bind events externally
    $(document).on('click', '#review-link', function () {
        debugger;
        alert(`Clicked on item`);
    });


});