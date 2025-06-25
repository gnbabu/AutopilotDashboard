using AutopilotDashboard.Models;
using AutopilotDashboard.Repositories.Helpers;
using Oracle.ManagedDataAccess.Client;
using System.Data;

namespace AutopilotDashboard.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly OracleDataAccessHelper _oracleHelper;

        public OrderRepository(OracleDataAccessHelper oracleHelper)
        {
            _oracleHelper = oracleHelper;
        }

        public async Task<IEnumerable<OrderRecord>> GetOrdersByTenantAsync(string tenantId)
        {
            var parameters = new OracleParameter[]
            {
        new OracleParameter("p_tenant_id", OracleDbType.Varchar2, 50)
        {
          Direction = ParameterDirection.Input,
          Value = tenantId
        },
        new OracleParameter("p_result", OracleDbType.RefCursor)
        {
          Direction = ParameterDirection.Output
        }
            };

            return await _oracleHelper.ExecuteReaderAsync("usp_GetOrderRecords", parameters, reader => new OrderRecord
            {
                ServiceTag = reader.GetNullableString("SERVICE_TAG"),
                CustomerSalesOrderNo = reader.GetNullableString("CUSTOMER_SALES_ORDER_NO"),
                TenantId = reader.GetNullableString("TENANT_ID"),
                TenantDomain = reader.GetNullableString("TENANT_DOMAIN"),
                GroupTag = reader.GetNullableString("GROUP_TAG"),
                SkuNumber = reader.GetNullableString("SKU_NUMBER"),
                StatusComment = reader.GetNullableString("STATUS_COMMENT"),
                CreationDate = reader.GetNullableDateTime("CREATION_DATE") ?? DateTime.MinValue,
                LastUpdateDate = reader.GetNullableDateTime("LAST_UPDATE_DATE") ?? DateTime.MinValue,
                Buid = reader.GetNullableString("BUID")
            });
        }
    }
}
