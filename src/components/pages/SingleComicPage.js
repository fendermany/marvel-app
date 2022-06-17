import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

import useMarvelService from '../../services/MarvelService'
import './singleComicPage.scss'
import { setContent } from '../../utils/setContent'

const SingleComicPage = () => {
	const { comicId } = useParams()
	const [comic, setComic] = useState(null)

	const { getComic, clearError, process, setProcess } = useMarvelService()

	useEffect(() => {
		updateComic()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [comicId])

	const updateComic = () => {
		clearError()
		getComic(comicId)
			.then(onComicLoaded)
			.then(() => setProcess('confirmed'))
	}

	const onComicLoaded = comic => {
		setComic(comic)
	}

	return <>{setContent(process, View, comic)}</>
}

const View = ({ data }) => {
	const { name, description, count, lang, thumbnail, price } = data

	return (
		<div className='single-comic'>
			<img src={thumbnail} alt={name} className='single-comic__img' />
			<div className='single-comic__info'>
				<h2 className='single-comic__name'>{name}</h2>
				<p className='single-comic__descr'>{description}</p>
				<p className='single-comic__descr'>{count}</p>
				<p className='single-comic__descr'>Language: {lang}</p>
				<div className='single-comic__price'>{price}</div>
			</div>
			<Link to='/comics' className='single-comic__back'>
				Back to all
			</Link>
		</div>
	)
}

export default SingleComicPage
