import puppeteer from 'puppeteer'


export const launch_method_args = {
	headless: false, // it opens the browser
	defaultViewport: null, // setting the viewport same as the browser frame size
	ignoreDefaultArgs: ['--disable-extensions'], // https://pptr.dev/next/troubleshooting#chrome-headless-doesnt-launch-on-windows
	args: [
		'--start-maximized', // opens the browser in fullpage mode
		// `--window-size=0,0`,
		// `--window-size=768,800`,
    // '--window-position=0,0',
	],
}


/**
 * @param {object} url - URL of the page to load and get the products data.
*/
export const get_products_card_data_from_browse_page = async ( url ) => {
	const browser = await puppeteer.launch(launch_method_args)
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'load' })
	await page.addScriptTag({ path: './src/lib/dom-helpers.js' })

	const data = page.evaluate(()=> get_products_card_data( document.querySelectorAll('.css-lrwy1y') ))
  await browser.close()
	return await data
}


/**
 * @param {object} url - URL of the page to load and get the product data.
*/
export const get_product_single_page_data = async url => {
	const browser = await puppeteer.launch(launch_method_args)
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'load' })
	await page.addScriptTag({ path: './src/lib/dom-helpers.js' })

	const data = await page.evaluate(() => {

		let achievementsPageLink
		let faqPageLink
	
		// Content tabs
		document.querySelectorAll('li.css-160z0x6')?.forEach(tab => {
			const link = tab.querySelector('a')
			const title = link?.textContent
			if ( title === 'Achievements' ) achievementsPageLink = 'https://store.epicgames.com' + link?.getAttribute('href')
			if ( title.includes('FAQ') ) faqPageLink = 'https://store.epicgames.com' + link?.getAttribute('href')
		})

		let genres = []
		document.querySelectorAll( '.css-1kg0r30:first-of-type ul.css-vs1xw0 li.css-t8k7' )?.forEach( item => {
			const name = item.querySelector( '.css-z3vg5b' )?.textContent
			genres.push( name )
		})
		if ( genres.length === 0 ) genres = undefined

		let features = []
		document.querySelectorAll( '.css-1kg0r30:last-of-type ul.css-vs1xw0 li.css-t8k7' )?.forEach( item => {
			const name = item.querySelector( '.css-z3vg5b' )?.textContent
			features.push( name )
		})
		if ( features.length === 0 ) features = undefined

		const logo = get_img_element_src( document.querySelector('.css-1yo049y img.css-7i770w') )
		const poster = get_img_element_src( document.querySelector('.css-10o6sbo img.css-7i770w') )

		let info = []
		document.querySelectorAll('.css-10mlqmn')?.forEach(item => {
			const title = item.querySelector('.css-11ksoqt')?.textContent
			if ( title === 'Refund Type' ) {
				const content = item.querySelector('.css-btns76 .css-z3vg5b')?.textContent
				const link = item.querySelector('.css-btns76 .css-1sifqn')?.getAttribute('href')
				if (content) info.push({ title, content, link })
			} else if ( title === 'Platform' ) {
				const platforms = []
				item.querySelectorAll('.css-1nau1p3')?.forEach(platform => {
					platforms.push({
						name: platform.querySelector('.css-5ur8x')?.textContent,
						svg: get_svg_element_as_string( platform.querySelector('svg') ),
					})
				})
				if (platforms.length > 0) info.push({ title, items: platforms })
			} else {
				const content = item.querySelector('.css-btns76')?.textContent
				if (content) info.push({ title, content })
			}
		})
		if (info.length === 0) info = undefined

		const rating = document.querySelector('.css-xkkr33')?.textContent
		
		let ratingBulletPoints = []
		document.querySelectorAll('.css-1wv32e5')?.forEach(item => {
      const icon = get_img_element_src( item.querySelector('.css-1jrn0jl') )
			const subtitle = item.querySelector('.css-y2j3ic')?.textContent
			const title = item.querySelector('.css-1vmwtkj')?.textContent
			
			ratingBulletPoints.push({ icon, subtitle, title })
		})
		if (ratingBulletPoints.length === 0) ratingBulletPoints = undefined

		let ratingCritics = []
		document.querySelectorAll('li.css-1ufz7qh')?.forEach(item =>
		{
			const title = item.querySelector('.css-1put4uz')?.textContent
			const value = item.querySelector('.css-1icivsh')?.textContent

			ratingCritics.push({ title, value })
		})
		if (ratingCritics.length === 0) ratingCritics = undefined

		let reviews = []
		document.querySelectorAll('.css-e69dqy .swiper-slide')?.forEach(item =>
		{
			const authorTitle = item.querySelector('.css-uewl2b .css-z3vg5b')?.textContent
			const author = item.querySelector('.css-uewl2b .css-11ksoqt')?.textContent
			const rating = item.querySelector('.css-bp306l .css-8atqhb .css-z3vg5b')?.textContent === '' ? undefined : item.querySelector('.css-bp306l .css-8atqhb .css-z3vg5b')?.textContent
			const content = item.querySelector('.css-bp306l .css-11ksoqt')?.textContent
			const externalLink = item.querySelector('.css-1gx8m4x a')?.getAttribute('href')

			reviews.push({ authorTitle, author, rating, content, externalLink })
		})
		if (reviews.length === 0) reviews = undefined

		const reviewsExternalLink = document.querySelector('.css-fuc5di a')?.getAttribute('href')
		const reviewsBy = document.querySelector('.css-fyuh0d > div > span.css-dcpx1m')?.textContent

		let followUsLinks = []
		document.querySelectorAll('.css-1vasxza li')?.forEach(item => {
			const name = item.getAttribute('data-testid').replace('social-link-', '')
			const alt = item.querySelector('.css-5ur8x')?.textContent
      const href = item.querySelector('a')?.getAttribute('href')
			const svg = get_svg_element_as_string( item.querySelector('svg') )

			followUsLinks.push({ name, alt, href, svg })
		})
		if (followUsLinks.length === 0) followUsLinks = undefined

		let externalLinks = []
		document.querySelectorAll('li.css-1xftut')?.forEach(item => {
			const title = item.querySelector('.css-sw9may')?.textContent
      const href = item.querySelector('a')?.getAttribute('href')
			externalLinks.push({ title, href })
		})
		if (externalLinks.length === 0) externalLinks = undefined

		const purchaseBtn = document.querySelector('button[data-testid="purchase-cta-button"]')
		const primaryColor = purchaseBtn ? getComputedStyle(purchaseBtn)?.backgroundColor : undefined
		const primaryColorText = purchaseBtn ? getComputedStyle(purchaseBtn)?.color : undefined
		const purchaseText = purchaseBtn?.textContent.toUpperCase()

		const discountTime = document.querySelector('.css-1146xy9')?.textContent

		ageRestriction = undefined
		ageRestrictionTitle = document.querySelector('.css-1ik4laa .css-b3sav2')?.textContent
		ageRestrictionDescription = document.querySelector('.css-1ik4laa .css-11ksoqt')?.textContent
		ageRestrictionImg = get_img_element_src( document.querySelector('.css-1ik4laa .css-1qetu4g') )
		if (ageRestrictionTitle || ageRestrictionDescription || ageRestrictionImg) {
			ageRestriction = { ageRestrictionTitle, ageRestrictionDescription, ageRestrictionImg }
		}

		const shortDescription = document.querySelector('.css-1myreog')?.textContent
		const longDescription = document.querySelector('#about-long-description')?.outerHTML

		const systemRequirements = []
		document.querySelectorAll('.css-uejgfo > div')?.forEach(tab => {
			tab.click()

			let data = {
				os: tab.textContent,
				value: [],
			}
		
			document.querySelectorAll('.css-3rds8q')?.forEach(item => {
				const minimumEl = item.querySelector('.css-2sc5lq:first-of-type')
				const recommendedEl = item.querySelector('.css-2sc5lq:last-of-type')

				data.value.push({
					title: minimumEl?.querySelector('.css-11ksoqt')?.textContent || recommendedEl?.querySelector('.css-11ksoqt')?.textContent,
					minimum: minimumEl?.querySelector('.css-z3vg5b')?.textContent,
					recommended: recommendedEl?.querySelector('.css-z3vg5b')?.textContent,
				})
			})

			systemRequirements.push(data)
		})
		if (systemRequirements.length === 0) systemRequirements = undefined

		const copyRight = document.querySelector('.css-z9j4kt')?.textContent
		const privacyPolicyExternalLink = document.querySelector('.css-1potjqa > div > a')?.getAttribute('href')

		return {
			poster, logo,
			genres, features,
			rating, ratingBulletPoints, ratingCritics, reviews, reviewsExternalLink, reviewsBy,
			info,
			followUsLinks, externalLinks,
			primaryColor, primaryColorText,
			purchaseText,
			discountTime,
			ageRestriction,
			shortDescription, longDescription,
			achievementsPageLink, faqPageLink,
			systemRequirements,
			copyRight,
			privacyPolicyExternalLink,
		}
	})

  await browser.close()
	return await data
}


/**
 * @param {object} url - URL of the page to load and get the product achievements data.
*/
export const get_product_single_page_achievements_data = async url => {
	const browser = await puppeteer.launch(launch_method_args)
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'load' })

	const data = await page.evaluate(() => {

		const availableAchievements = document.querySelector('.css-o9ybm7:first-of-type .css-8t238z')?.textContent.replaceAll(/[^0-9-]/g, '')
		const availableXp = document.querySelector('.css-o9ybm7:last-of-type .css-8t238z')?.textContent.replaceAll(/[^0-9-]/g, '')

		const achievementsGuide = {}
		const achievementsGuideElement = document.querySelector('.css-uuawq0 [role="tooltip"]')._tippy.popper.children[0].children[0].children[0].children[0]
		achievementsGuide.description = achievementsGuideElement?.querySelector('span:first-of-type')?.textContent
		achievementsGuide.items = []
		achievementsGuideElement?.querySelectorAll('.css-70qvj9').forEach(item => {
			const text = item.querySelector('.css-ziobv1')?.textContent
			const svg = get_svg_element_as_string( item.querySelector('svg') )
			achievementsGuide.items.push({ text, svg })
		})

		const achievements = []
		document.querySelectorAll('.css-8atqhb').forEach(item => {

			const img = item.querySelector('img')?.getAttribute('src').split('?')[0].replaceAll(' ', '%20')
			const title = item.querySelector('.css-zrwm56')?.textContent
			const description = item.querySelector('.css-11ksoqt')?.textContent

			const xp = {}
			xp.text = item.querySelector('.css-12folkm')?.textContent
			xp.svg = get_svg_element_as_string( item.querySelector('svg') )
			xp.rarity = item.querySelector('.css-dcpx1m')?.textContent

			achievements.push({ img, title, description, xp })
		})

		return { availableAchievements, availableXp, achievementsGuide, achievements }

	})

  await browser.close()
	return await data
}


/**
 * @param {object} url - URL of the page to load and get the product achievements data.
*/
export const get_product_single_page_faq_data = async url => {
	const browser = await puppeteer.launch(launch_method_args)
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'load' })

	const data = await page.evaluate(() => {
		const faqDescription = document.querySelector('.css-1lwib6p')?.outerHTML
		return { faqDescription }
	})

  await browser.close()
	return await data
}

