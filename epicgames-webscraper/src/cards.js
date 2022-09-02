import fs from 'fs'
import chalk from 'chalk'
import { get_products_card_data_from_browse_page } from './helpers/puppeteer.js'
import { try_parse_json, write_file_code } from './helpers/nodejs.js'

// removing the content for rewrite
if ( process.argv.includes('--rewrite') ) {
	fs.writeFileSync('./data/cards.json', '')
	console.log( chalk.green(`Removed ${chalk.underline.blue('./data/cards.json')} content`) )
}

let data = []
let number_of_cards_in_each_page = 40
const number_of_available_pages = 35
let index_of_cards_to_start_from = 0

const available_cards = try_parse_json( fs.readFileSync('./data/cards.json') )

if (available_cards)
{
	console.log( chalk.green(`Getting available products from ${chalk.underline.blue('./data/cards.json')}`) )
	data = available_cards

	console.log( chalk.green(`Set ${chalk.magentaBright('index_of_cards_to_start_from')} to ${chalk.magentaBright(data.length)}`) )
	index_of_cards_to_start_from = data.length
}

const index_of_cards_to_start_from_for_last_page = number_of_cards_in_each_page * number_of_available_pages - number_of_cards_in_each_page
const is_data_not_already_up_to_date = data.length <= index_of_cards_to_start_from_for_last_page

if ( is_data_not_already_up_to_date )
{
	do {
		console.log( chalk.green(`Getting products from ${chalk.magentaBright(index_of_cards_to_start_from + 1)} to ${chalk.magentaBright(index_of_cards_to_start_from + number_of_cards_in_each_page)}`) )
		const products_data = await get_products_card_data_from_browse_page(`https://store.epicgames.com/en-US/browse?sortBy=releaseDate&sortDir=DESC&category=Game&count=${number_of_cards_in_each_page}&start=${index_of_cards_to_start_from}`)
		await data.push(...products_data)
		index_of_cards_to_start_from += number_of_cards_in_each_page
	
		console.log( chalk.green(`Writing data to ${chalk.underline.blue('./data/cards.json')}`) )
		write_file_code('./data/cards.json', data)
	
	} while (index_of_cards_to_start_from <= index_of_cards_to_start_from_for_last_page)
} else
{
	console.log( chalk.green(`Data is already up to date`) )
	console.log( `Number of pages: ${chalk.magentaBright(number_of_available_pages)}` )
	console.log( `Number of products: ${chalk.magentaBright(data.length)}` )
}
