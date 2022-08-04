import img from './error.gif';
import './error-message.scss';

const ErrorMessage = () => {
	return <img src={img} alt="error-img" className="error" />;
};

export default ErrorMessage;
