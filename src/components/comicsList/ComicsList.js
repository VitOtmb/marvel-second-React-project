import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelServices from '../../services/MarvelServices';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import './comicsList.scss';

const ComicsList = () => {
	const [comics, setComics] = useState([]);
	const [newItemsLoading, setNewItemsLoading] = useState(false);
	const [offset, setOffset] = useState(100);
	const [comicsEnded, setComicsEnded] = useState(false);

	const { loading, error, getComics } = useMarvelServices();

	useEffect(() => {
		onRequest(offset, true);
	}, []);

	const onRequest = (offset, initialValue) => {
		initialValue ? setNewItemsLoading(false) : setNewItemsLoading(true);
		getComics(offset).then(onComicsLoaded);
	};

	const onComicsLoaded = (newComics) => {
		let ended = false;
		if (comicsEnded.length < 9) {
			ended = true;
		}

		setComics((comics) => [...comics, ...newComics]);
		setNewItemsLoading(false);
		setOffset((offset) => offset + 8);
		setComicsEnded((comicsEnded) => ended);
	};

	function renderItem(array) {
		const comicItem = array.map((comicBook, i) => (
			<li className="comics__item" key={i}>
				<Link to={`/comics/${comicBook.id}`}>
					<img src={comicBook.thumbnail} alt="ultimate war" className="comics__item-img" />
					<div className="comics__item-name">{comicBook.name}</div>
					<div className="comics__item-price">{comicBook.price}</div>
				</Link>
			</li>
		));

		return <ul className="comics__grid">{comicItem}</ul>;
	}

	const comicsListItems = renderItem(comics);

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;

	return (
		<div className="comics__list">
			{errorMessage}
			{spinner}
			{comicsListItems}
			<button
				className="button button__main button__long"
				onClick={() => onRequest(offset)}
				disabled={newItemsLoading}
			>
				<div className="inner">load more</div>
			</button>
		</div>
	);
};

export default ComicsList;
