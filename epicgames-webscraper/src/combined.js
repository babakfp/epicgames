import fs from 'fs'
import chalk from 'chalk'
import { write_file_code } from './helpers/nodejs.js'
import { get_product_single_page_data, get_product_single_page_achievements_data } from './helpers/puppeteer.js'

// Command-line args
const isRemoveContent = process.argv.includes('--remove-content')

if (isRemoveContent) {
	fs.writeFile('data/combined.json', '', ()=> {
		console.log( chalk.green(`Removed ${chalk.underline.blue('data/combined.json')} content`) )
	})
}

const cardsAvailableRawData = fs.readFileSync('data/cards.json')
let cardsData = []

if (cardsAvailableRawData.toString() !== '') {
	
	let data = []

	console.log( chalk.green(`Getting available cards data from ${chalk.underline.blue('data/cards.json')}`) )
	cardsData = JSON.parse(cardsAvailableRawData)

	const combinedAvailableRawData = fs.readFileSync('data/combined.json')

	if (combinedAvailableRawData.toString() !== '') {
		console.log( chalk.green(`Getting available combined data from ${chalk.underline.blue('data/combined.json')}`) )
		data = JSON.parse(combinedAvailableRawData)
	}

	if (data.length > 0) {
		cardsData = cardsData.splice(data.length, cardsData.length)
	}

	for (let i = 0; i < cardsData.length; i++) {
		const product = cardsData[i]
		
		console.log( chalk.green(`Getting product ${chalk.magentaBright(data.length)} of ${chalk.magentaBright(data.length + cardsData.length)}`) )

		console.log( chalk.green(`Getting single product data`) )
		const singlePage = await get_product_single_page_data(product.href)

		let achievements = {}
		if (singlePage.achievementsPageLink) {
			console.log( chalk.green(`Getting single product achievements data`) )
			achievements = await get_product_single_page_achievements_data(singlePage.achievementsPageLink)
		}

		let faq = {}
		if (singlePage.faqPageLink) {
			console.log( chalk.green(`Getting single product FAQ data`) )
			faq = await get_product_single_page_faq_data(singlePage.faqPageLink)
		}

		await data.push({
			...product,
			...singlePage,
			...achievements,
			...faq,
		})

		write_file_code('data/combined.json', data)
	}
	
} else {

	console.log( chalk.red(`✖ No cards data found in ${chalk.underline.blue('data/cards.json')}`) )

}
