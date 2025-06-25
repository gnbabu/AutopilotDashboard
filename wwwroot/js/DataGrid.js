(function ($) {
    $.fn.dataGrid = function (options) {
        // Default settings
        let settings = $.extend({
            apiUrl: null,
            data: [],
            columns: [],
            pageSizeOptions: [5, 10, 20, 50, 100],
            initialPageSize: 10,
            gridTitle: 'Data Grid',
            noDataMessage: 'No data available.',
            idProperty: 'id',
            enableAllColumnSearch: false,
            enableColumnFilters: false,
            enableColumnVisibility: false,
            enableSorting: false, // overall sorting, defaults to false
            exportOptions: {
                enable: false,    // Overall enable flag for export
                copy: false,      // Enable/disable the Copy button
                excel: false,     // Enable/disable the Excel button
                pdf: false        // Enable/disable the PDF button
            }
        }, options);

        let $element = $(this);
        let data = settings.data;
        let page = 1;
        let pageSize = settings.initialPageSize;
        let sortKey = null;
        let sortAsc = true;
        let filters = {};
        let visibleColumns = {};
        let globalSearchText = '';

        settings.columns.forEach(col => {
            visibleColumns[col.key] = true;
        });

        // Date parsing function
        function parseDate(str) {
            const [dd, mm, yyyy] = str.split('-');
            if (!dd || !mm || !yyyy) return null;
            const date = new Date(`${yyyy}-${mm}-${dd}`);
            return isNaN(date.getTime()) ? null : date;
        }

        function formatValueForSearch(value, col) {
            if (value == null) return '';
            if (col.type === 'date') {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`.toLowerCase();
                }
            }
            return value.toString().toLowerCase();
        }

        function buildColumnVisibilityDropdown() {
            const $dropdown = $element.find('.column-visibility-dropdown').empty();
            settings.columns.forEach(col => {
                if (col.type) {
                    const $li = $(`
                    <li class="dropdown-item">
                        <div class="form-check">
                            <input class="form-check-input column-toggle" type="checkbox" id="colVis_${col.key}" data-key="${col.key}" ${visibleColumns[col.key] ? 'checked' : ''}>
                            <label class="form-check-label" for="colVis_${col.key}">
                                ${col.title}
                            </label>
                        </div>
                    </li>
                    `);
                    $dropdown.append($li);
                }
            });

            $element.find('.column-toggle').off('change').on('change', function () {
                const key = $(this).data('key');
                visibleColumns[key] = $(this).is(':checked');
                buildTableHeader();
                renderTable();
            });
        }

        function buildTableHeader() {
            const $thead = $element.find('#table-head').empty();
            settings.columns.forEach(col => {
                if (!visibleColumns[col.key]) return;

                const inputType = col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text';
                const filter = filters[col.key] || {};
                const sortIcon = sortKey === col.key ? (sortAsc ? ' ▲' : ' ▼') : '';

                const $th = $('<th scope="col"></th>');
                const hasTitle = col.title !== null && col.title !== undefined && col.title !== '';

                // Use a normal span instead of strong, no wrapping element for empty title
                const $label = $('<span>').text(hasTitle ? col.title : '').append(sortIcon);

                // Because append(sortIcon) appends text node, but since sortIcon is string, use text manipulation instead:
                // Let's create text node for title and for sortIcon separately:
                // But simpler to build the label with text + sort icon concatenated
                // So replace to:
                const labelText = hasTitle ? col.title + sortIcon : '';
                const $labelSpan = $('<span>').text(labelText);

                // Conditionally attach the click event based on column's sortable property and overall enableSorting
                if (settings.enableSorting !== false && col.sortable !== false) {
                    $labelSpan.css('cursor', 'pointer'); // Set pointer cursor only when sortable
                    $labelSpan.click(() => {
                        if (sortKey === col.key) {
                            sortAsc = !sortAsc;
                        } else {
                            sortKey = col.key;
                            sortAsc = true;
                        }
                        buildTableHeader();
                        renderTable();
                    });
                } else {
                    $labelSpan.css('cursor', 'default'); // Remove pointer cursor for non-sortable columns
                }

                if (settings.enableColumnFilters && hasTitle && col.type) {
                    // Only render filter dropdown if title is provided AND filters enabled AND col.type exists
                    const $inputGroup = $(`
                    <div class="input-group input-group-sm mt-1">
                        <input type="${inputType}" class="form-control filter-input filter-val1" placeholder="Filter..." data-key="${col.key}" value="${filter.value1 || ''}">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true" aria-label="Filter options">
                            <i class="bi bi-funnel"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end p-3" style="min-width: 250px;">
                            <li class="mb-2">
                                <select class="form-select form-select-sm filter-operator" data-key="${col.key}">
                                    <option value="eq">Equal</option>
                                    <option value="neq">Not Equal</option>
                                    ${(col.type === 'number' || col.type === 'date')
                            ? `<option value="lt">Less Than</option> 
                                           <option value="gt">Greater Than</option> 
                                           <option value="lte">Less Than or Equal</option> 
                                           <option value="gte">Greater Than or Equal</option> 
                                           <option value="between">Between</option>`
                            : `<option value="contains">Contains</option> 
                                           <option value="startsWith">Starts With</option> 
                                           <option value="endsWith">Ends With</option>`
                        }
                                </select>
                            </li>
                            <li class="mb-2">
                                <input type="${inputType}" class="form-control form-control-sm filter-val2" placeholder="Second value (for between)" style="display: none;" value="${filter.value2 || ''}">
                            </li>
                            <li class="d-flex justify-content-between mt-2">
                                <button type="button" class="btn btn-sm btn-primary apply-filter" data-key="${col.key}">Apply</button>
                                <button type="button" class="btn btn-sm btn-secondary clear-filter" data-key="${col.key}">Reset</button>
                            </li>
                        </ul>
                    </div>
                    `);

                    const $dropdown = $inputGroup.find('.dropdown-menu');
                    const $operator = $dropdown.find('.filter-operator');
                    const $val1 = $inputGroup.find('.filter-val1');
                    const $val2 = $dropdown.find('.filter-val2');

                    $operator.on('change', function () {
                        $(this).val() === 'between' ? $val2.show() : $val2.hide().val('');
                    });

                    if (filter.op === 'between') {
                        $operator.val('between');
                        $val2.show();
                    } else if (filter.op) {
                        $operator.val(filter.op);
                    }

                    $dropdown.find('.apply-filter').click(function () {
                        const op = $operator.val();
                        const value1 = $val1.val().trim();
                        const value2 = op === 'between' ? $val2.val().trim() : '';

                        if (op === 'between' && (!value1 || !value2)) {
                            alert("Please enter both values for 'Between' filter.");
                            return;
                        } else if (!value1) {
                            delete filters[col.key];
                            $val1.val('');
                            $val2.val('').hide();
                            page = 1;
                            renderTable();
                            const dropdownInstance = bootstrap.Dropdown.getInstance($inputGroup.find('.dropdown-toggle')[0]);
                            dropdownInstance?.hide();
                            return;
                        }

                        filters[col.key] = { op, value1, value2 };
                        page = 1;
                        renderTable();
                        const dropdownInstance = bootstrap.Dropdown.getInstance($inputGroup.find('.dropdown-toggle')[0]);
                        dropdownInstance?.hide();
                    });

                    $dropdown.find('.clear-filter').click(function () {
                        delete filters[col.key];
                        $operator.val('eq');
                        $val1.val('');
                        $val2.val('').hide();
                        page = 1;
                        renderTable();
                        const dropdownInstance = bootstrap.Dropdown.getInstance($inputGroup.find('.dropdown-toggle')[0]);
                        dropdownInstance?.hide();
                    });

                    $dropdown.on('click', function (e) {
                        e.stopPropagation();
                    });

                    const $wrapper = $('<div class="d-flex flex-column"></div>');
                    $wrapper.append($labelSpan).append($inputGroup);
                    $th.append($wrapper);
                } else {
                    // No filter dropdown rendered if title not provided or filters disabled
                    $th.append($labelSpan);
                }
                $thead.append($th);
            });
        }

        function applyFilters(data) {
            return data.filter(row => {
                return Object.entries(filters).every(([key, filter]) => {
                    const rawVal = row[key];
                    const val = rawVal !== null && rawVal !== undefined ? rawVal.toString().toLowerCase() : '';
                    const value1 = (filter.value1 || '').toLowerCase();
                    const value2 = (filter.value2 || '').toLowerCase();

                    switch (filter.op) {
                        case 'eq': return val === value1;
                        case 'neq': return val !== value1;
                        case 'lt': return val < value1;
                        case 'gt': return val > value1;
                        case 'lte': return val <= value1;
                        case 'gte': return val >= value1;
                        case 'between': {
                            if (!filter.value1 || !filter.value2) return false;
                            const numVal = parseFloat(val);
                            const numVal1 = parseFloat(filter.value1);
                            const numVal2 = parseFloat(filter.value2);
                            if (!isNaN(numVal) && !isNaN(numVal1) && !isNaN(numVal2)) {
                                return numVal >= numVal1 && numVal <= numVal2;
                            }
                            const dateVal = parseDate(val);
                            const dateVal1 = parseDate(filter.value1);
                            const dateVal2 = parseDate(filter.value2);
                            if (dateVal && dateVal1 && dateVal2) {
                                return dateVal >= dateVal1 && dateVal <= dateVal2;
                            }
                            return false;
                        }
                        case 'contains': return val.includes(value1);
                        case 'startsWith': return val.startsWith(value1);
                        case 'endsWith': return val.endsWith(value1);
                        default: return true;
                    }
                });
            });
        }

        function renderTable() {
            const $tbody = $element.find('#table-body').empty();
            let filtered = applyFilters(data);

            if (globalSearchText) {
                const search = globalSearchText?.toLowerCase().trim();
                if (search) {
                    filtered = filtered.filter(row =>
                        settings.columns.some(col =>
                            visibleColumns[col.key] &&
                            formatValueForSearch(row[col.key], col).includes(search)
                        )
                    );
                }
            }

            // Apply sorting if enabled and sortKey exists
            if (settings.enableSorting !== false && sortKey) {
                filtered.sort((a, b) => {
                    let valA = a[sortKey], valB = b[sortKey];
                    if (typeof valA === "string") valA = valA.toLowerCase();
                    if (typeof valB === "string") valB = valB.toLowerCase();
                    return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
                });
            }

            const start = (page - 1) * pageSize;
            const paged = filtered.slice(start, start + pageSize);

            if (paged.length === 0) {
                const colspan = settings.columns.filter(col => visibleColumns[col.key]).length;
                $tbody.append(`<tr><td colspan="${colspan}" class="text-center">${settings.noDataMessage}</td></tr>`);
            } else {
                paged.forEach(row => {
                    const $tr = $('<tr>');
                    settings.columns.forEach(col => {
                        if (!visibleColumns[col.key]) return;

                        let value = row[col.key];
                        if (value === null || value === undefined || value === '') {
                            value = '';
                        }

                        if (col.cellTemplate !== null && col.cellTemplate !== undefined && col.cellTemplate !== '') {
                            if (typeof col.cellTemplate === 'function') {
                                value = col.cellTemplate(row);
                            } else if (typeof col.cellTemplate === 'string') {
                                value = col.cellTemplate.replace(/{([^}]+)}/g, (match, p1) => row[p1] || '');
                            }
                        }

                        if (col.type === 'date' && value) {
                            const date = new Date(value);
                            if (!isNaN(date.getTime())) {
                                const day = String(date.getDate()).padStart(2, '0');
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const year = date.getFullYear();
                                value = `${day}-${month}-${year}`;
                            }
                        }
                        $tr.append(`<td>${value}</td>`);
                    });
                    $tbody.append($tr);
                });
            }

            if (filtered.length > 0) {
                $element.find('#page-info').text(`Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${filtered.length} entries`).show();
                $element.find('#pagination').parent().show();
                renderPagination(Math.ceil(filtered.length / pageSize));
            } else {
                $element.find('#page-info').hide();
                $element.find('#pagination').parent().hide();
            }
        }

        function renderPagination(totalPages) {
            const $pagination = $element.find('#pagination').empty();
            for (let i = 1; i <= totalPages; i++) {
                const $li = $(`<li class="page-item ${i === page ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`);
                $li.click(function (e) {
                    e.preventDefault();
                    page = i;
                    renderTable();
                });
                $pagination.append($li);
            }
        }

        function fetchDataFromApi() {
            if (settings.apiUrl) {
                $.ajax({
                    url: settings.apiUrl,
                    method: 'GET',
                    success: function (response) {
                        data = response;
                        page = 1;
                        if (settings.enableColumnVisibility) {
                            buildColumnVisibilityDropdown();
                        }
                        buildTableHeader();
                        renderTable();
                    },
                    error: function (err) {
                        alert("Error loading data.");
                        console.error(err);
                    }
                });
            } else {
                page = 1;
                if (settings.enableColumnVisibility) {
                    buildColumnVisibilityDropdown();
                }
                buildTableHeader();
                renderTable();
            }
        }

        function initialize() {
            $element.html(`
                <h3>${settings.gridTitle}</h3>
                <div class="row mb-3">
                    <div class="col-md-6 d-flex align-items-center flex-wrap gap-2">
                        <label for="page-size-dropdown" class="form-label mb-0 me-2">Rows per page:</label>
                        <select id="page-size-dropdown" class="form-select form-select-sm w-auto" aria-label="Rows per page select">
                        </select>
                        ${settings.enableColumnFilters ? `<button id="reset-all-filters" type="button" class="btn btn-danger btn-sm ms-2">Reset All Filters</button>` : ''}
                        ${settings.enableColumnVisibility ? `
                        <div class="dropdown ms-2">
                            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="columnVisibilityDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Columns
                            </button>
                            <ul class="dropdown-menu column-visibility-dropdown" aria-labelledby="columnVisibilityDropdown" style="padding: 0.5rem; max-height: 300px; overflow-y: auto;"></ul>
                        </div>
                        ` : ''}
                        ${settings.exportOptions.enable ? `
                        <div class="dropdown ms-2">
                            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="exportDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Export
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="exportDropdown" style="padding: 0.5rem; min-width: 150px;">
                                ${settings.exportOptions.copy ? `
                                <li><button class="dropdown-item py-1 px-2" id="copy-btn">Copy</button></li>` : ''}
                                ${settings.exportOptions.excel ? `
                                <li><button class="dropdown-item py-1 px-2" id="excel-btn">Excel</button></li>` : ''}
                                ${settings.exportOptions.pdf ? `
                                <li><button class="dropdown-item py-1 px-2" id="pdf-btn">PDF</button></li>` : ''}
                            </ul>
                        </div>` : ''}
                    </div>

                    ${settings.enableAllColumnSearch ? `
                    <div class="col-md-6 d-flex align-items-center justify-content-md-end mt-2 mt-md-0">
                        <label for="common-search" class="form-label mb-0 me-2">Search:</label>
                        <input type="search" id="common-search" class="form-control form-control-sm w-100 w-md-auto" style="max-width: 300px;" placeholder="Search all columns..." aria-label="Search all columns">
                    </div>
                    ` : ''}
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered table-striped mb-0">
                        <thead class="table-light">
                            <tr id="table-head"></tr>
                        </thead>
                        <tbody id="table-body"></tbody>
                    </table>
                </div>
                <div class="row mt-3 align-items-center">
                    <div class="col-md-6">
                        <div id="page-info" class="text-muted small"></div>
                    </div>
                    <div class="col-md-6">
                        <nav aria-label="Page navigation" class="d-flex justify-content-md-end">
                            <ul class="pagination pagination-sm mb-0" id="pagination"></ul>
                        </nav>
                    </div>
                </div>
            `);

            let $pageSizeDropdown = $element.find('#page-size-dropdown');
            settings.pageSizeOptions.forEach(size => {
                $pageSizeDropdown.append(`<option value="${size}" ${size === settings.initialPageSize ? 'selected' : ''}>${size}</option>`);
            });

            $element.find('#page-size-dropdown').change(function () {
                pageSize = parseInt($(this).val());
                page = 1;
                renderTable();
            });

            // Event handlers for exporting functionality

            if (settings.exportOptions.copy) {
                $element.find('#copy-btn').click(() => {
                    const visibleCols = settings.columns.filter(c => visibleColumns[c.key]);
                    const filteredData = applyFilters(data);

                    let copyText = '';
                    // Header row
                    copyText += visibleCols.map(col => col.title).join('\t') + '\n';

                    // Data rows
                    filteredData.forEach(row => {
                        copyText += visibleCols.map(col => row[col.key] ?? '').join('\t') + '\n';
                    });

                    // Copy to clipboard via hidden textarea
                    const $tempTextArea = $('<textarea>');
                    $tempTextArea.val(copyText)
                        .css({ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0 })
                        .appendTo('body');

                    $tempTextArea[0].select();

                    try {
                        const successful = document.execCommand('copy');
                        alert(successful ? 'Copied to clipboard!' : 'Copy failed.');
                    } catch (err) {
                        alert('Copy failed.');
                    }

                    $tempTextArea.remove();
                });
            }
            if (settings.exportOptions.excel) {
                $element.find('#excel-btn').click(() => {
                    const visibleCols = settings.columns.filter(c => visibleColumns[c.key]);
                    const filteredData = applyFilters(data);

                    let csvContent = '';
                    csvContent += visibleCols.map(col => `"${col.title}"`).join(',') + '\n';

                    filteredData.forEach(row => {
                        csvContent += visibleCols.map(col => `"${row[col.key] ?? ''}"`).join(',') + '\n';
                    });

                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", "export.csv");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            }

            if (settings.exportOptions.pdf) {
                $element.find('#pdf-btn').click(() => {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF({ orientation: 'landscape' });

                    const visibleCols = settings.columns.filter(c => visibleColumns[c.key]);
                    const filteredData = applyFilters(data);

                    const head = [visibleCols.map(col => col.title)];
                    const body = filteredData.map(row => visibleCols.map(col => row[col.key] ?? ''));

                    const columnStyles = {};
                    visibleCols.forEach((col, idx) => {
                        columnStyles[idx] = { cellWidth: 'wrap' };
                    });

                    doc.autoTable({
                        head: head,
                        body: body,
                        startY: 10,
                        styles: { fontSize: 8 },
                        columnStyles: columnStyles,
                        tableWidth: 'wrap',
                        horizontalPageBreak: true,
                        horizontalPageBreakRepeat: head,
                    });

                    doc.save('export.pdf');
                });
            }
            if (settings.enableColumnFilters) {
                $element.find('#reset-all-filters').click(function () {
                    filters = {};
                    $element.find('.filter-input').val('');
                    $element.find('.filter-operator').val('eq');
                    $element.find('.filter-val2').val('').hide();
                    $element.find('.dropdown-menu.show').each(function () {
                        const toggleBtn = $(this).siblings('[data-bs-toggle="dropdown"]')[0];
                        if (toggleBtn) {
                            const bsDropdown = bootstrap.Dropdown.getInstance(toggleBtn);
                            if (bsDropdown) bsDropdown.hide();
                        }
                    });
                    Object.keys(visibleColumns).forEach(key => {
                        visibleColumns[key] = true;
                    });
                    $element.find('#common-search').val('');
                    globalSearchText = '';
                    $element.find('#page-size-dropdown').val(settings.initialPageSize);
                    pageSize = settings.initialPageSize;
                    sortKey = null;
                    sortAsc = true;
                    page = 1;
                    if (settings.enableColumnVisibility) {
                        buildColumnVisibilityDropdown();
                    }
                    buildTableHeader();
                    renderTable();
                });
            }
            if (settings.enableAllColumnSearch) {
                $element.find('#common-search').on('input', function () {
                    globalSearchText = $(this).val().toLowerCase();
                    page = 1;
                    renderTable();
                });
            }

            fetchDataFromApi();
        }

        initialize();

        return this;
    };
})(jQuery);