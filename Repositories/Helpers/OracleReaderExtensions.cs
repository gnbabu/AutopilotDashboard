using Oracle.ManagedDataAccess.Client;

namespace AutopilotDashboard.Repositories.Helpers
{
    public static class OracleReaderExtensions
    {
        public static T? GetNullable<T>(this OracleDataReader reader, string columnName)
        {
            int ordinal = reader.GetOrdinal(columnName);
            return reader.IsDBNull(ordinal) ? default : reader.GetFieldValue<T>(ordinal);
        }

        public static string? GetNullableString(this OracleDataReader reader, string columnName)
        {
            return reader.GetNullable<string>(columnName);
        }

        public static int? GetNullableInt(this OracleDataReader reader, string columnName)
        {
            return reader.GetNullable<int>(columnName);
        }

        public static DateTime? GetNullableDateTime(this OracleDataReader reader, string columnName)
        {
            return reader.GetNullable<DateTime>(columnName);
        }
    }
}
