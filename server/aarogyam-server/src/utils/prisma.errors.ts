export const prismaErrors = {
  // Authentication and Connection Errors
  P1000: "Authentication failed against the database.",
  P1001: "Can't reach the database server.",
  P1002: "Connection to the database timed out.",
  P1003: "Database does not exist.",
  P1008: "Operations timed out.",
  P1009: "Database already exists.",
  P1010: "User was denied access to the database.",
  P1011: "Error opening a TLS connection.",
  P1012: "Prisma schema is invalid.",
  P1013: "The provided database connection string is invalid.",
  P1014: "Underlying model does not exist.",
  P1015:
    "Prisma schema uses features not supported by the current database version.",
  P1016: "Incorrect number of parameters for a raw query.",
  P1017: "Server closed the connection unexpectedly.",

  // Query Engine Errors
  P2000: "The provided value for the column is too long.",
  P2001: "Record not found.",
  P2002: "Unique constraint failed.",
  P2003: "Foreign key constraint failed.",
  P2004: "A database constraint failed.",
  P2005: "Invalid value stored in the database.",
  P2006: "The provided value is not valid for the field.",
  P2007: "Data validation error.",
  P2008: "Failed to parse the query.",
  P2009: "Failed to validate the query.",
  P2010: "Raw query failed.",
  P2011: "Null constraint violation.",
  P2012: "Missing required value.",
  P2013: "Missing required argument for a field.",
  P2014: "Violation of required relation between models.",
  P2015: "Related record not found.",
  P2016: "Query interpretation error.",
  P2017: "Relation records not connected.",
  P2018: "Required connected records not found.",
  P2019: "Input error.",
  P2020: "Value out of range for the field type.",
  P2021: "Table does not exist in the current database.",
  P2022: "Column does not exist in the current database.",
  P2023: "Inconsistent column data.",
  P2024: "Timed out fetching a new connection from the connection pool.",
  P2025: "Operation failed due to missing required records.",
  P2026: "Database provider doesn't support a query feature.",
  P2027: "Multiple errors occurred during query execution.",
  P2028: "Transaction API error.",
  P2029: "Query parameter limit exceeded.",
  P2030: "Cannot find a full-text index for the search.",
  P2031: "MongoDB server must be run as a replica set for transactions.",
  P2033: "A number in the query is too large to fit into a 64-bit integer.",
  P2034: "Transaction failed due to write conflict or deadlock.",
  P2035: "Assertion violation in the database.",
  P2036: "Error in external connector.",
  P2037: "Too many database connections opened.",

  // Prisma Migrate (Schema Engine) Errors
  P3000: "Failed to create the database.",
  P3001: "Migration with destructive changes and possible data loss.",
  P3002: "Migration was rolled back due to database error.",
  P3003: "Saved migrations are no longer valid.",
  P3004: "Database is a system database and should not be altered.",
  P3005: "Database schema is not empty.",
  P3006: "Migration failed to apply cleanly to the shadow database.",
  P3007: "Requested preview features are not yet allowed.",
  P3008: "Migration is already recorded as applied in the database.",
  P3009: "Found failed migrations in the target database.",
  P3010: "Migration name is too long.",
  P3011: "Migration cannot be rolled back because it was never applied.",
  P3012: "Migration cannot be rolled back because it is not in a failed state.",
  P3013: "Datasource provider arrays are no longer supported in migrate.",
  P3014: "Prisma Migrate could not create the shadow database.",
  P3015: "Migration file could not be found.",
  P3016: "Fallback method for database reset failed.",
  P3017: "Migration could not be found.",
  P3018: "Migration failed to apply.",
  P3019: "Datasource provider does not match the one in migration history.",
  P3020: "Automatic shadow database creation is disabled on Azure SQL.",
  P3021: "Foreign keys cannot be created on this database.",
  P3022: "Direct execution of DDL SQL statements is disabled on this database.",

  // Prisma db pull Errors
  P4000: "Introspection operation failed to produce a schema file.",
  P4001: "The introspected database was empty.",
  P4002: "Inconsistent schema in the introspected database.",

  // Prisma Accelerate Errors
  P6000: "Generic server error.",
  P6001: "The URL is malformed.",
  P6002: "API key is invalid.",
  P6003: "Plan limit exceeded.",
  P6004: "Query timeout in Prisma Accelerate.",
  P6005: "Invalid parameters in query.",
  P6006: "Prisma version is not compatible with Accelerate.",
  P6008: "Engine failed to start.",
  P6009: "Response size limit exceeded.",
  P6010: "Prisma Accelerate project is disabled.",

  // Prisma Pulse Errors
  P6100: "Unexpected server error in Prisma Pulse.",
  P6101: "Datasource not reachable by Prisma Pulse.",
  P6102: "Invalid API key for Prisma Pulse.",
  P6103: "Prisma Pulse is disabled for the API key.",
  P6104: "Prisma Data Platform account is blocked.",
  P6105: "Prisma version not supported by Prisma Pulse.",
};