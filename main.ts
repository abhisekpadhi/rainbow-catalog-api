import 'dotenv/config';
import {app} from './app';
import {RootResource} from './src/resources';
import {OndcResource} from './src/ondc-proto/ondc-resources';

const port = process.env.PORT! as unknown as number;
const host = process.env.HOST! as unknown as string;

app.use('', RootResource);
app.use('/api', OndcResource);

// start server
app.listen(port, host, () => {
    console.log(`⚡️ Server running from main.ts at http://${host}:${port}`);
});
