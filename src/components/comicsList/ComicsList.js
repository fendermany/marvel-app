import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './comicsList.scss'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/errorMessage'
import useMarvelService from '../../services/MarvelService'

export const setContent = (process, Component, newItemLoading) => {
	switch (process) {
		case 'waiting':
			return <Spinner />
		case 'loading':
			return newItemLoading ? <Component /> : <Spinner />
		case 'confirmed':
			return <Component />
		case 'error':
			return <ErrorMessage />
		default:
			throw new Error('Unexpected process state')
	}
}

const ComicsList = () => {
	const [comicsList, setComicsList] = useState([])
	const [newItemLoading, setNewItemLoading] = useState(false)
	const [offset, setOffset] = useState(0)
	const [comicsEnded, setComicsEnded] = useState(false)

	const { getAllComics, process, setProcess } = useMarvelService()

	useEffect(() => {
		onRequest(offset, true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true)
		getAllComics(offset)
			.then(onComicsListLoaded)
			.then(() => setProcess('confirmed'))
	}

	const onComicsListLoaded = newComicsList => {
		let ended = false
		if (newComicsList.length < 8) {
			ended = true
		}

		setComicsList(comicsList => [...comicsList, ...newComicsList])
		setNewItemLoading(false)
		setOffset(offset => offset + 8)
		setComicsEnded(ended)
	}

	function renderItems(arr) {
		const items = arr.map((item, i) => {
			let imgStyle = { objectFit: 'cover' }
			if (
				item.thumbnail ===
				'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
			) {
				imgStyle = { objectFit: 'unset' }
			}

			return (
				<li key={i} className='comics__item'>
					<Link to={`/comics/${item.id}`}>
						<img
							src={item.thumbnail}
							alt={item.name}
							className='comics__item-img'
							style={imgStyle}
						/>
						<div className='comics__item-name'>{item.name}</div>
						<div className='comics__item-price'>{item.price}</div>
					</Link>
				</li>
			)
		})
		// А эта конструкция вынесена для центровки спиннера/ошибки
		return <ul className='comics__grid'>{items}</ul>
	}

	return (
		<div className='comics__list'>
			{setContent(process, () => renderItems(comicsList), newItemLoading)}
			<button
				onClick={() => onRequest(offset)}
				style={{ display: comicsEnded ? 'none' : 'block' }}
				disabled={newItemLoading}
				className='button button__main button__long'
			>
				<div className='inner'>load more</div>
			</button>
		</div>
	)
}

export default ComicsList
