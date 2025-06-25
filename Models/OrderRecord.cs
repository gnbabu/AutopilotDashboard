namespace AutopilotDashboard.Models
{
    public class OrderRecord
    {
        public string ServiceTag { get; set; }
        public string CustomerSalesOrderNo { get; set; }
        public string TenantId { get; set; }
        public string TenantDomain { get; set; }
        public string GroupTag { get; set; }
        public string SkuNumber { get; set; }
        public string StatusComment { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public string Buid { get; set; }
    }
}
