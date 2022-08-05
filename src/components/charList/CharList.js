import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import './charList.scss';

class CharsList extends Component {
	state = {
		charsList: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 100,
		charEnded: false,
		charSelected: false,
	};
	marvelServeces = new MarvelServices();

	componentDidMount() {
		this.onRequest();
		window.addEventListener('scroll', () => this.onLoadCharsByScroll());
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', () => this.onLoadCharsByScroll());
	}

	// Метод отвечает за запрос на сервер
	onRequest = (offset) => {
		this.onCharListLoading();
		this.marvelServeces
			.getAllCharacters(offset)
			.then(this.onCharsListLoaded)
			.catch((error) => console.log(error));
	};

	onCharListLoading = () => {
		this.setState({
			newItemLoading: true,
		});
	};

	onCharsListLoaded = (newCharsList) => {
		// Проверка на количество персонажей пришедших от сервера
		let ended = false;
		if (newCharsList.length < 9) {
			ended = true;
		}
		this.setState(({ offset, charsList }) => ({
			charsList: [...charsList, ...newCharsList],
			loading: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended,
		}));
	};

	onError = () => {
		this.setState({ loading: false, error: true });
	};

	onLoadCharsByScroll = () => {
		let scrollHeight = Math.max(
			(document.documentElement.scrollHeight, document.body.scrollHeight)
		);

		if (Math.floor(window.scrollY + document.documentElement.clientHeight) >= scrollHeight) {
			this.onRequest(this.state.offset);
		}
	};
	// массив элементов li со страницы
	itemRefs = [];

	setRef = (ref) => {
		this.itemRefs.push(ref);
	};

	focusOnItem = (id) => {
		this.itemRefs.forEach((item) => {
			item.classList.remove('char__item_selected');
		});
		this.itemRefs[id].classList.add('char__item_selected');
		this.itemRefs[id].focus();
	};

	renderItems = (arr) => {
		// Динамические стили для картинки
		const notImg = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
		let thereIsPic = { 'objectFit': 'cover' };
		let thereIsNotPic = { 'objectFit': 'fill' };

		const charItem = arr.map((char, i) => (
			<li
				ref={this.setRef}
				className="char__item"
				key={char.id}
				onClick={() => {
					this.props.onCharSelected(char.id);
					this.focusOnItem(i);
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
	};

	render() {
		let { charsList, loading, error, newItemLoading, offset, charEnded } = this.state;

		const charsListItems = this.renderItems(charsList);

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error) ? charsListItems : null;

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{content}
				<button
					className="button button__main button__long"
					disabled={newItemLoading}
					style={{ display: charEnded ? 'none' : 'block' }}
					onClick={() => this.onRequest(offset)}
				>
					<div className="inner">load more</div>
				</button>
			</div>
		);
	}
}
// Проверка типов пропсов.
CharsList.propTypes = {
	onCharSelected: PropTypes.func.isRequired,
};

export default CharsList;
