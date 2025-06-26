using AutopilotDashboard.Models;

namespace AutopilotDashboard.Repositories
{
    public interface IOrderRepository
    {
        Task<IEnumerable<OrderRecord>> GetOrdersAsync(string tenantId);
    }
}
