import { Component } from 'react';
import MarvelServices from './../../services/MarvelServices';
import Spinner from './../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
	state = {
		char: {},
		loading: true,
		error: false,
	};

	marvelServeces = new MarvelServices();

	componentDidMount() {
		this.updateChar();
	}

	onCharLoaded = (char) => {
		this.setState({ char, loading: false });
	};

	onCharLoading = () => {
		this.setState({ loading: true });
	};

	onError = () => {
		this.setState({ loading: false, error: true });
	};

	updateChar = () => {
		this.onCharLoading();
		const id = Math.round(Math.random() * (1011400 - 1011000) + 1011000);
		this.marvelServeces.getCharacter(id).then(this.onCharLoaded).catch(this.onError);
	};

	render() {
		const { char, loading, error } = this.state;

		const errorMessage = error ? <ErrorMessage /> : null;
		const load = loading ? <Spinner /> : null;
		const content = !(error || loading) ? <View char={char} /> : null;

		return (
			<div className="randomchar">
				{errorMessage}
				{load}
				{content}
				<div className="randomchar__static">
					<p className="randomchar__title">
						Random character for today!
						<br />
						Do you want to get to know him better?
					</p>
					<p className="randomchar__title">Or choose another one</p>
					<button className="button button__main" onClick={this.updateChar}>
						<div className="inner">try it</div>
					</button>
					<img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
				</div>
			</div>
		);
	}
}

// Компонент, котрый рендерит данные
const View = ({ char }) => {
	const { name, description, thumbnail, homepage, wiki } = char;
	// Динамические стили для картинки
	let imgStyle = { 'objectFit': 'cover' };
	if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
		imgStyle = { 'objectFit': 'fill' };
	}
	return (
		<div className="randomchar__block">
			<img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle} />
			<div className="randomchar__info">
				<p className="randomchar__name">{name}</p>
				<p className="randomchar__descr">{description}</p>
				<div className="randomchar__btns">
					<a href={homepage} className="button button__main">
						<div className="inner">homepage</div>
					</a>
					<a href={wiki} className="button button__secondary">
						<div className="inner">wiki</div>
					</a>
				</div>
			</div>
		</div>
	);
};

export default RandomChar;
