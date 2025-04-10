import 'bootstrap/dist/css/bootstrap.min.css';
import '@/../public/assets/css/style.css';
import '@/../public/assets/css/color/green.css';
import '@/../public/assets/css/fontawesome/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/../public/assets/css/flag/flag-icon.min.css';

const App = ({ Component, pageProps })=> {
    return <Component {...pageProps} />
}

export default App;