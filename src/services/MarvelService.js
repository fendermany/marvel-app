import { useHttp } from '../hooks/http.hook'

const useMarvelService = () => {
	const { request, clearError, process, setProcess } = useHttp()

	const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
	const _apiKey = 'apikey=1b84fd6221b25b51d1016d2f1d8be8a3'
	const _baseOffset = 210

	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(
			`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
		)
		return res.data.results.map(_transformCharacter)
	}

	const getAllComics = async (offset = 0) => {
		const res = await request(
			`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
		)

		return res.data.results.map(_transformComics)
	}

	const getCharacter = async id => {
		const res = await request(`${_apiBase}characters/${id}?&${_apiKey}`)
		return _transformCharacter(res.data.results[0])
	}

	const getComic = async id => {
		const res = await request(`${_apiBase}comics/${id}?&${_apiKey}`)
		return _transformComics(res.data.results[0])
	}

	const _transformComics = comic => {
		return {
			id: comic.id,
			name: comic.title,
			description: comic.description || 'There is no description',
			count: comic.pageCount
				? `${comic.pageCount} p.`
				: 'No information about the number of pages',
			lang: comic.textObjects.language || 'en-us',
			thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
			price: comic.prices.price ? `${comic.prices.price}$` : 'not available',
		}
	}

	const _transformCharacter = char => {
		return {
			id: char.id,
			name: char.name,
			description: char.description
				? `${char.description.slice(0, 210)}...`
				: 'There is no description for this character',
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items.slice(0, 10),
		}
	}

	return {
		clearError,
		process,
		setProcess,
		getAllCharacters,
		getCharacter,
		getAllComics,
		getComic,
	}
}

export default useMarvelService
