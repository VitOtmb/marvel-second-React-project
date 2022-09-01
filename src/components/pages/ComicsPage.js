import { Routes, Route } from 'react-router-dom';

import ComicsList from '../comicsList/ComicsList';
import AppBanner from '../appBanner/AppBanner';

const ComicsPage = () => {
	return (
		<>
			<AppBanner />
			<Routes>
				<Route>
					<Route path="/" element={<ComicsList />}></Route>
				</Route>
			</Routes>
		</>
	);
};

export default ComicsPage;
