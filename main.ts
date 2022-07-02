import 'dotenv/config';
import './src/common/init';
import {app} from './app';

const port = process.env.PORT! as unknown as number;
const host = process.env.HOST! as unknown as string;

// start server
app.listen(port, host, () => {
    console.log(`⚡️ Server running from main.ts at http://${host}:${port}`);
});
