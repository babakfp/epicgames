/**
 * Get data from the single page > achievements of a product.
*/

import { write_file_code } from './helpers/nodejs.js'
import { get_product_single_page_achievements_data } from './helpers/puppeteer.js'

const data = await get_product_single_page_achievements_data('https://store.epicgames.com/en-US/achievements/dying-light-2-stay-human')

write_file_code('data/single-product-achievements.json', data)
