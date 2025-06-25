using System.Diagnostics;
using AutopilotDashboard.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Globalization;

namespace AutopilotDashboard.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        //DateTime startDate, DateTime endDate
        [HttpGet]
        public IActionResult GetOrders()
        {
            var allOrders = GetOrdersData();

            //var filtered = allOrders
            //    .Where(o => o.CreationDate.Date >= startDate.Date && o.CreationDate.Date <= endDate.Date)
            //    .ToList();

            return Ok(allOrders);
        }


        private List<OrderRecord> GetOrdersData()
        {
            var orderRecords = new List<OrderRecord>
            {
                new OrderRecord { ServiceTag = "G14W184", CustomerSalesOrderNo = "1016371832", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOCZE", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:32 PM",CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:19 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "DY4XT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:32 PM",CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:18 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "32ZVT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:32 PM",CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:13 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "41ZVT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:31 PM",CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:15:17 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "405XT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:31 PM",CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:15 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "73ZVT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:31 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:14 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "C2ZVT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:30 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:13 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "166XT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:30 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:12 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "HX4XT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:29 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:12 PM",CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "6W6WT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:29 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:11 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "685XT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:29 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:11 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "45ZVT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:28 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:10 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "936XT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:28 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:09 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "3Z4XT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:28 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:09 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "F56XT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:28 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:08 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "B75XT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:27 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:08 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "7Z4XT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:27 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:06 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "9ZJWT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:26 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:05 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "54ZVT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:26 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:04 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "D6BWT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:26 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:03 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "G85XT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:25 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:03 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "7H5XT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:25 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:15:12 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "H4ZVT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:25 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:02 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "22ZVT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:24 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:01 PM", CultureInfo.InvariantCulture), Buid = "" },
                new OrderRecord { ServiceTag = "H1ZVT74", CustomerSalesOrderNo = "1014752555", TenantId = "e0793d39-0939-496d-b129-198edd916feb", TenantDomain = "accenture.onmicrosoft.com", GroupTag = "CIOBEL", SkuNumber = "NA", StatusComment = "JACKED", CreationDate = DateTime.Parse("6/16/2025 4:54:24 PM", CultureInfo.InvariantCulture), LastUpdateDate = DateTime.Parse("6/16/2025 5:00:01 PM", CultureInfo.InvariantCulture), Buid = "" }
            };
            return orderRecords;

        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
