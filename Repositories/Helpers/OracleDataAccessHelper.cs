using Oracle.ManagedDataAccess.Client;
using System.Data;

namespace AutopilotDashboard.Repositories.Helpers
{
    public class OracleDataAccessHelper
    {

        private readonly string _connectionString;

        public OracleDataAccessHelper(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("OracleConnection");

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException("Database connection string 'OracleConnection' is not configured.");
            }

            _connectionString = connectionString;
        }

        public async Task<T> ExecuteScalarAsync<T>(string storedProcedure, OracleParameter[] parameters)
        {
            try
            {
                using var connection = new OracleConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new OracleCommand(storedProcedure, connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                if (parameters != null)
                    command.Parameters.AddRange(parameters);

                var result = await command.ExecuteScalarAsync();

                if (result == null || result == DBNull.Value)
                    return default;

                return (T)Convert.ChangeType(result, typeof(T));
            }
            catch (OracleException ex)
            {
                throw new InvalidOperationException($"Oracle error executing stored procedure '{storedProcedure}'.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Unexpected error executing stored procedure '{storedProcedure}'.", ex);
            }
        }

        public async Task<int> ExecuteNonQueryAsync(string storedProcedure, OracleParameter[] parameters)
        {
            try
            {
                using var connection = new OracleConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new OracleCommand(storedProcedure, connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                if (parameters != null)
                    command.Parameters.AddRange(parameters);

                return await command.ExecuteNonQueryAsync();
            }
            catch (OracleException ex)
            {
                throw new InvalidOperationException($"Oracle error executing stored procedure '{storedProcedure}'.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Unexpected error executing stored procedure '{storedProcedure}'.", ex);
            }
        }

        public async Task<IEnumerable<T>> ExecuteReaderAsync<T>(string storedProcedure, OracleParameter[] parameters, Func<OracleDataReader, T> map)
        {
            var results = new List<T>();

            try
            {
                using var connection = new OracleConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new OracleCommand(storedProcedure, connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                if (parameters != null)
                    command.Parameters.AddRange(parameters);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    results.Add(map(reader));
                }
            }
            catch (OracleException ex)
            {
                throw new InvalidOperationException($"Oracle error executing stored procedure '{storedProcedure}'.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Unexpected error executing stored procedure '{storedProcedure}'.", ex);
            }

            return results;
        }
    }
}
