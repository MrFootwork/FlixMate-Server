const config = require('../../config')
const countries = require('./movies.data')

const MONTHS_IN_PAST = 1
const START_RATING = 7
const COUNTRY_CODES = ['FR', 'DE', 'ES']

const defaultConfig = {
  method: 'GET',
  url: 'https://unogs-unogs-v1.p.rapidapi.com/search/titles',
  headers: {
    'x-rapidapi-key': config.RAPID_API_KEY,
    'x-rapidapi-host': 'unogs-unogs-v1.p.rapidapi.com',
  },
}

module.exports = {
  // Top Picks of the last couple months
  topPicks: {
    ...defaultConfig,
    params: {
      order_by: 'date',
      limit: '20',
      start_rating: START_RATING,
      new_date: getDate().newDate,
      start_year: getDate().startYear,
      country_list: getUNOGSCountryList(COUNTRY_CODES),
    },
  },
  titleSearch: {
    ...defaultConfig,
    params: {
      title: '',
      limit: '20',
    },
  },
}

/**
 * Computes the first day of the month a specified number of months in the past and returns it
 * along with the corresponding year, adjusting for year spans when necessary.
 *
 * @function
 * @returns {{ newDate: string, startYear: string }} An object containing:
 * - `newDate` {string}: The ISO 8601 formatted date string (YYYY-MM-DD) representing the first day
 *   of the month `MONTHS_IN_PAST` before the current month.
 * - `startYear` {string}: The year (YYYY) corresponding to `newDate`, adjusted for year spans.
 *
 * @example
 * // Assuming MONTHS_IN_PAST = 1 and the current date is 2025-01-12:
 * const result = getDate();
 * console.log(result);
 * // Output: { newDate: "2024-12-01", startYear: "2024" }
 */
function getDate() {
  const currentDate = new Date()
  currentDate.setDate(1)
  currentDate.setMonth(currentDate.getMonth() - MONTHS_IN_PAST)

  const newDate = currentDate.toISOString().split('T')[0]
  const startYear = currentDate.getFullYear().toString() // Extract the adjusted year

  return { newDate, startYear }
}

/**
 * Transforms an array of country codes into a comma-separated string of UNO-GS country IDs.
 *
 * @param {string[]} countryCodes - An array of ISO 3166-1 alpha-2 country codes (e.g., ['FR', 'DE', 'ES']).
 * @returns {string} - A comma-separated string of UNO-GS country IDs (e.g., '45,39,270').
 *
 * @example
 * // Assuming `countries` is defined as:
 * // const countries = [
 * //   { id: 45, countrycode: 'FR' },
 * //   { id: 39, countrycode: 'DE' },
 * //   { id: 270, countrycode: 'ES' }
 * // ];
 *
 * const countryCodes = ['FR', 'DE', 'ES'];
 * const result = getUNOGSCountryList(countryCodes);
 * console.log(result); // Output: '45,39,270'
 */
function getUNOGSCountryList(countryCodes) {
  return countryCodes
    .map(code => countries.find(({ countrycode }) => countrycode === code).id)
    .join(',')
}
