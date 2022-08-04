class MarvelServices {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/';
	_apiKey = 'apikey=a261415decae076ce5ae35c705b29132';
	// можно начинать с 0, просто персонажи тут более интересные
	_baseOffset = 200;
	getResource = async (url) => {
		let res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status ${res.status}`);
		}

		return await res.json();
	};

	getAllCharacters = async (offset = this._baseOffset) => {
		const res = await this.getResource(
			`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`
		);
		return res.data.results.map(this._transformCharacter);
	};

	getCharacter = async (id) => {
		const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
		return this._transformCharacter(res.data.results[0]);
	};

	_transformCharacter(char) {
		// Проверка на наличие описания персонажа
		if (char.description === '') {
			char.description = 'There is no description for this character yet...';
		} else if (char.description.length >= 210) {
			char.description = `${char.description.slice(0, 210)}...`;
		}

		return {
			id: char.id,
			name: char.name,
			description: char.description,
			thumbnail: char.thumbnail.path + `.${char.thumbnail.extension}`,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items,
		};
	}
}

export default MarvelServices;