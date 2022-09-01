import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useMarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import './charList.scss';

const CharsList = (props) => {
	const [charsList, setCharsList] = useState([]);
	const [newItemsLoading, setNewItemsLoading] = useState(false);
	const [offset, setOffset] = useState(200);
	const [charEnded, setCharEnded] = useState(false);

	const { loading, error, getAllCharacters } = useMarvelServices();

	useEffect(() => {
		onRequest(offset, true);
	}, []);

	// Метод отвечает за запрос на сервер
	const onRequest = (offset, initialValue) => {
		initialValue ? setNewItemsLoading(false) : setNewItemsLoading(true);
		getAllCharacters(offset).then(onCharsListLoaded);
	};

	const onCharsListLoaded = (newCharsList) => {
		// Проверка на количество персонажей пришедших от сервера
		let ended = false;
		if (newCharsList.length < 9) {
			ended = true;
		}

		setCharsList((charsList) => [...charsList, ...newCharsList]);
		setNewItemsLoading(false);
		setOffset((offset) => offset + 9);
		setCharEnded((charEnded) => ended);
	};

	// массив элементов li со страницы
	const itemRefs = useRef([]);

	const focusOnItem = (id) => {
		itemRefs.current.forEach((item) => {
			item.classList.remove('char__item_selected');
		});
		itemRefs.current[id].classList.add('char__item_selected');
		itemRefs.current[id].focus();
	};

	function renderItems(arr) {
		// Динамические стили для картинки
		const notImg = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
		let thereIsPic = { 'objectFit': 'cover' };
		let thereIsNotPic = { 'objectFit': 'fill' };

		const charItem = arr.map((char, i) => (
			<li
				ref={(el) => (itemRefs.current[i] = el)}
				className="char__item"
				key={char.id}
				onClick={() => {
					props.onCharSelected(char.id);
					focusOnItem(i);
				}}
			>
				<img src={char.thumbnail} alt={char.name} style={notImg ? thereIsNotPic : thereIsPic} />
				<div className="char__name">{char.name}</div>
			</li>
		));
		return (
			<div className="char__list">
				<ul className="char__grid">{charItem}</ul>
			</div>
		);
	}

	const charsListItems = renderItems(charsList);

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading && !newItemsLoading ? <Spinner /> : null;

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{charsListItems}
			<button
				className="button button__main button__long"
				disabled={newItemsLoading}
				style={{ display: charEnded ? 'none' : 'block' }}
				onClick={() => onRequest(offset)}
			>
				<div className="inner">load more</div>
			</button>
		</div>
	);
};
// Проверка типов пропсов.
CharsList.propTypes = {
	onCharSelected: PropTypes.func.isRequired,
};

export default CharsList;
