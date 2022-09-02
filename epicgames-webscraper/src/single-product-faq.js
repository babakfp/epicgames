/**
 * Get data from the single page > faq of a product.
*/

import { write_file_code } from './helpers/nodejs.js'
import { get_product_single_page_faq_data } from './helpers/puppeteer.js'

const data = await get_product_single_page_faq_data('https://store.epicgames.com/en-US/p/far-cry-6--far-cry-6-faq')

write_file_code('data/single-product-faq.json', data)
