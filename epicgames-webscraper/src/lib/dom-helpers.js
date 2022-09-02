/**
 * Removing the class attribute and returning it as a string.
 * @param {HTMLElement} el - <svg> element
*/
const get_svg_element_as_string = ( el ) =>
{
	if (!el) return

	el.removeAttribute('class')

	// converte to text
	return el.outerHTML
}


/**
 * Get and fix up the image element `src` attribute.
 * @param {HTMLElement} el - <img> element
 * Using `replaceAll(' ', '%20')` to 
*/
const get_img_element_src = ( el ) =>
{
	if (!el) return

	let src = el?.getAttribute('src')
	
	// remove anything after the `?` character because we just need the pure source without the size params
	src = src.split('?')[0]
	
	// remove all of the whitespaces, to make the URL work
	src = src.replaceAll(' ', '%20')

	return src
}


/**
 * @param {String} text - Text to transform to slug.
*/
const convert_to_slug = ( text ) =>
{
  let result = ''

	// We always want the slug to be lowercase.
  result = text.toLowerCase()

	// Converting cases like "Assassin's Creed" to "Assassins Creed" because we don't want a `-` between "Assassin" and "s" (because we don't want to separate the "s" letter from its letter).
	// "Assassin's Creed" to "assassins-creed" instead of "assassin-s-creed"
  result = result.replaceAll(`'`, '')

  result = result.replaceAll(/[^a-z0-9-]/g, '-')

  let newResult = ''

  // Removing scenarios like `--`
  for (let i = 0; i < result.length; i++) {
    const currentChar = result[i]
    const previousChar = result[i - 1]

    if ( !(currentChar === '-' && previousChar === '-') ) {
      newResult += currentChar
    }
  }

	// Removing the last remaining `-` char, that the loop above couldn't remove it.
	if (newResult[newResult.length - 1] === '-') {
		newResult = newResult.slice(0, -1)
	}

  return newResult
}


/**
 * Get card and return its data
 * @param {HTMLElement} card_el - card element
*/
const get_product_card_data = ( card_el ) =>
{
	const title = card_el.querySelector('.css-n55ojx')?.textContent
	const slug = convert_to_slug(title)
	const originalSlug = card_el.querySelector('.css-15fmxgh')?.getAttribute('href').replace('/en-US/p/', '')
	const thumb = get_img_element_src( card_el.querySelector('.css-1nbweuk') )
	const type = card_el.querySelector('.css-r7q7qr')?.textContent.toUpperCase()
	const label = card_el.querySelector('.css-1t8lqo3')?.textContent
	const discount = card_el.querySelector('.css-b0xoos')?.textContent
	const originalPrice = card_el.querySelector('.css-z3vg5b')?.textContent
	const discountPrice = card_el.querySelector('.css-z3vg5b')?.textContent

	return {
		title,
		slug,
		originalSlug,
		thumb,
		type,
		label,
		discount,
		originalPrice,
		discountPrice,
	}
}


/**
 * Get cards and return data
 * @param {Array.HTMLElement} card_els - Array of card elements
*/
const get_products_card_data = ( card_els ) =>
{
	const results = []

	card_els.forEach(card_el => {
		const card_data = get_product_card_data(card_el)
		results.push(card_data)
	})

	return results
}

