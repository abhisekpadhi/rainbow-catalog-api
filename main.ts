import 'dotenv/config';
import {app} from './app';
import {RootRouter} from './src/resources';
import {OndcRouter} from './src/ondc-proto/ondc-router';

const port = process.env.PORT! as unknown as number;
const host = process.env.HOST! as unknown as string;

app.use('', RootRouter);
app.use('/api', OndcRouter);

// start server
app.listen(port, host, () => {
    console.log(`⚡️ Server running from main.ts at http://${host}:${port}`);
});
