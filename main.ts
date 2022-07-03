import 'dotenv/config';
import {app} from './app';
import './router';
import {ApiRoutes} from './src/ApiRoutes';
import {RootResource} from './src/resources';

const port = process.env.PORT! as unknown as number;
const host = process.env.HOST! as unknown as string;

app.use('', RootResource);

// start server
app.listen(port, host, () => {
    console.log(`⚡️ Server running from main.ts at http://${host}:${port}`);
});
