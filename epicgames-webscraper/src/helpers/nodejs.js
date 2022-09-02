import fs from 'fs'

/**
 * @param {string} file - Path and file name.
 * @param {string} data - Data to write into the file.
*/
export const write_file_code = ( file, data ) => {
	fs.writeFileSync(file, JSON.stringify(data, null, 2))
}


export const try_parse_json = ( data ) => {
	try {
		return JSON.parse(data)
	} catch {
		return false
	}
}

