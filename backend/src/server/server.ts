import App from './app';
import 'dotenv/config';

const PORT = process.env.PORT || 3005;

App.listen(Number(PORT));
