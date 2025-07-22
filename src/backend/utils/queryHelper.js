// utils/queryHelper.js
// Helper functions to convert MySQL queries to PostgreSQL

/**
 * Convert MySQL placeholders (?) to PostgreSQL placeholders ($1, $2, etc.)
 * @param {string} query - MySQL query with ? placeholders
 * @param {Array} params - Parameters array
 * @returns {Object} - {query: string, params: Array}
 */
function convertQuery(query, params = []) {
  let paramIndex = 1;
  const convertedQuery = query.replace(/\?/g, () => `$${paramIndex++}`);
  
  return {
    query: convertedQuery,
    params: params
  };
}

/**
 * Convert MySQL LIMIT syntax to PostgreSQL
 * @param {string} query - Query string
 * @returns {string} - Converted query
 */
function convertLimit(query) {
  // MySQL: LIMIT offset, count
  // PostgreSQL: LIMIT count OFFSET offset
  return query.replace(/LIMIT\s+(\d+),\s*(\d+)/gi, 'LIMIT $2 OFFSET $1');
}

/**
 * Convert MySQL date functions to PostgreSQL
 * @param {string} query - Query string
 * @returns {string} - Converted query
 */
function convertDateFunctions(query) {
  return query
    .replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP')
    .replace(/CURDATE\(\)/gi, 'CURRENT_DATE')
    .replace(/DATE\(/gi, 'DATE(')
    .replace(/YEAR\(/gi, 'EXTRACT(YEAR FROM ')
    .replace(/MONTH\(/gi, 'EXTRACT(MONTH FROM ')
    .replace(/DAY\(/gi, 'EXTRACT(DAY FROM ');
}

/**
 * Convert MySQL AUTO_INCREMENT to PostgreSQL SERIAL
 * @param {string} query - Query string
 * @returns {string} - Converted query
 */
function convertAutoIncrement(query) {
  return query.replace(/AUTO_INCREMENT/gi, '');
}

/**
 * Convert MySQL ENUM to PostgreSQL CHECK constraint
 * @param {string} query - Query string
 * @returns {string} - Converted query
 */
function convertEnum(query) {
  // This is a basic conversion - more complex ENUM handling may be needed
  return query.replace(/ENUM\s*\((.*?)\)/gi, (match, values) => {
    return `VARCHAR(50) CHECK (column_name IN (${values}))`;
  });
}

/**
 * Execute query with PostgreSQL client
 * @param {Object} pool - PostgreSQL pool
 * @param {string} query - Query string
 * @param {Array} params - Parameters
 * @returns {Promise} - Query result
 */
async function executeQuery(pool, query, params = []) {
  const converted = convertQuery(query, params);
  const finalQuery = convertLimit(convertDateFunctions(converted.query));
  
  try {
    const result = await pool.query(finalQuery, converted.params);
    return result.rows;
  } catch (error) {
    console.error('Query execution error:', error);
    console.error('Query:', finalQuery);
    console.error('Params:', converted.params);
    throw error;
  }
}

/**
 * Execute query and return single row
 * @param {Object} pool - PostgreSQL pool
 * @param {string} query - Query string
 * @param {Array} params - Parameters
 * @returns {Promise} - Single row or null
 */
async function executeQuerySingle(pool, query, params = []) {
  const rows = await executeQuery(pool, query, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Execute INSERT query and return inserted ID
 * @param {Object} pool - PostgreSQL pool
 * @param {string} query - INSERT query
 * @param {Array} params - Parameters
 * @returns {Promise} - Inserted row ID
 */
async function executeInsert(pool, query, params = []) {
  // Add RETURNING id to get the inserted ID
  const insertQuery = query.includes('RETURNING') ? query : query + ' RETURNING id';
  const result = await executeQuerySingle(pool, insertQuery, params);
  return result ? result.id : null;
}

/**
 * Build WHERE clause with dynamic conditions
 * @param {Object} conditions - Key-value pairs for conditions
 * @param {number} startIndex - Starting parameter index
 * @returns {Object} - {whereClause: string, params: Array, nextIndex: number}
 */
function buildWhereClause(conditions, startIndex = 1) {
  const whereParts = [];
  const params = [];
  let paramIndex = startIndex;

  for (const [key, value] of Object.entries(conditions)) {
    if (value !== undefined && value !== null) {
      whereParts.push(`${key} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    }
  }

  return {
    whereClause: whereParts.length > 0 ? 'WHERE ' + whereParts.join(' AND ') : '',
    params,
    nextIndex: paramIndex
  };
}

/**
 * Build pagination clause
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @returns {string} - LIMIT OFFSET clause
 */
function buildPagination(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  return `LIMIT ${limit} OFFSET ${offset}`;
}

module.exports = {
  convertQuery,
  convertLimit,
  convertDateFunctions,
  convertAutoIncrement,
  convertEnum,
  executeQuery,
  executeQuerySingle,
  executeInsert,
  buildWhereClause,
  buildPagination
};
