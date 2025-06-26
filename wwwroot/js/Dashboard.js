$(document).ready(function () {
    // 1. Initialize datepickers
    $("#startDate, #endDate").datepicker({
        dateFormat: "mm-dd-yy"
    });

    // 2. Bind clear button
    $('#clearBtn').click(function () {
        $('#startDate, #endDate').val('');
        $('#startDateError, #endDateError').text('');
        $('#orders-grid-container').addClass('d-none').empty();
    });

    // 3. Submit handler
    $('#filterForm').submit(function (e) {
        e.preventDefault();

        // Clear errors
        $('#startDateError, #endDateError').text('');

        const start = $('#startDate').val();
        const end = $('#endDate').val();

        let isValid = true;

        if (!start) {
            $('#startDateError').text('Start Date is required.');
            isValid = false;
        }

        if (!end) {
            $('#endDateError').text('End Date is required.');
            isValid = false;
        }

        const startDate = moment(start, 'MM-DD-YYYY', true);
        const endDate = moment(end, 'MM-DD-YYYY', true);

        if (start && end && (!startDate.isValid() || !endDate.isValid())) {
            $('#endDateError').text('Invalid date format.');
            isValid = false;
        } else if (startDate.isAfter(endDate)) {
            $('#endDateError').text('End Date cannot be before Start Date.');
            isValid = false;
        }

        if (!isValid) return;

        // 4. Make AJAX call
        $.ajax({
            url: '/Home/GetOrders',
            method: 'GET',
            data: {
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            },
            success: function (response) {
                $('#orders-grid-container')
                    .removeClass('d-none')
                    .dataGrid({
                        data: response,
                        columns: [
                            { key: 'serviceTag', title: 'Service Tag', type: 'text', sortable: true },
                            { key: 'customerSalesOrderNo', title: 'Sales Order No', type: 'text', sortable: true },
                            { key: 'tenantId', title: 'Tenant ID', type: 'text', sortable: false, width: '350px' },
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
                        idProperty: 'name',
                        enableAllColumnSearch: true,
                        enableColumnFilters: true,
                        enableColumnVisibility: true,
                        enableSorting: true,
                        dateFormat: 'MM-DD-YYYY',
                        includeTime: true,
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
    });
});

//Custom cell templates Sample

//{
//    key: 'action',
//    title: '',
//    type: 'action',
//    sortable: false,
//    cellTemplate: function (row) {
//        return `<a href="#" class="data-link text-primary" data-id="${row.serviceTag}">Review</a>`;
//    }
//},
//{
//    key: 'creationDate', title: 'Creation Date', type: 'date', sortable: true,
//    cellTemplate: function (row) {
//        const rawDate = row.creationDate;
//        const formatted = moment(rawDate, moment.ISO_8601).isValid()
//            ? moment(rawDate).format('DD-MM-YYYY HH:mm:ss')
//            : '';

//        return `<span data-id="${rawDate}">${formatted}</span>`;
//    }
//}