import ErrorMessage from '../../errorMessage/errorMessage';
import { Link } from 'react-router-dom';

import './page404.scss';

const Page404 = () => {
	return (
		<div>
			<ErrorMessage />
			<p className="note-page">Стараница не найдена</p>
			<Link to="/" className="back-main-page">
				Возврат на главную страницу
			</Link>
		</div>
	);
};

export default Page404;
