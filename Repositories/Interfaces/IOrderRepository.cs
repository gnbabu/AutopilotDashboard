using AutopilotDashboard.Models;

namespace AutopilotDashboard.Repositories
{
    public interface IOrderRepository
    {
        Task<IEnumerable<OrderRecord>> GetOrdersByTenantAsync(string tenantId);
    }
}
