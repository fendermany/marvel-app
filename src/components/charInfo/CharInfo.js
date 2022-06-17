import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import useMarvelService from '../../services/MarvelService'

import './charInfo.scss'
import { setContent } from '../../utils/setContent'

const CharInfo = props => {
	const [char, setChar] = useState(null)
	const { charId } = props

	const { getCharacter, clearError, process, setProcess } = useMarvelService()

	useEffect(() => {
		updateChar()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [charId])

	const updateChar = () => {
		if (!charId) {
			return
		}
		clearError()
		getCharacter(charId)
			.then(onCharLoaded)
			.then(() => setProcess('confirmed'))
	}

	const onCharLoaded = char => {
		setChar(char)
	}

	return <div className='char__info'>{setContent(process, View, char)}</div>
}

const View = ({ data }) => {
	const { name, description, thumbnail, homepage, wiki, comics } = data
	let imgStyle = { objectFit: 'cover' }
	if (
		thumbnail ===
		'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
	) {
		imgStyle = { objectFit: 'contain' }
	}
	return (
		<>
			<div className='char__basics'>
				<img src={thumbnail} alt={name} style={imgStyle} />
				<div>
					<div className='char__info-name'>{name}</div>
					<div className='char__btns'>
						<a href={homepage} className='button button__main'>
							<div className='inner'>homepage</div>
						</a>
						<a href={wiki} className='button button__secondary'>
							<div className='inner'>Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className='char__descr'>{description}</div>
			<div className='char__comics'>Comics:</div>
			<ul className='char__comics-list'>
				{comics.length > 0
					? comics.map((item, i) => {
							return (
								<li key={i} className='char__comics-item'>
									<Link to={`/comics/${item.resourceURI.substring(43)}`}>
										{item.name}
									</Link>
								</li>
							)
					  })
					: 'There are no comics with this character'}
			</ul>
		</>
	)
}

CharInfo.propTypes = {
	charId: PropTypes.number,
}

export default CharInfo
