import 'dotenv/config';
import {app} from './app';
import {RootRouter} from './src/resources';
import {OndcRouter} from './src/ondc-proto/ondc-router';
import {OndcTrackingRouter} from './src/ondc-proto/ondc-tracking-router';
import {DiagnosticsRouter} from './src/resources/DiagnosticsRouter';

const port = process.env.PORT! as unknown as number;
const host = process.env.HOST! as unknown as string;

app.use('', RootRouter);
app.use('/api', OndcRouter);
app.use('/tracking', OndcTrackingRouter);
app.use('/_', DiagnosticsRouter);

// start server
app.listen(port, host, () => {
    console.log(`⚡️ Server running from main.ts at http://${host}:${port}`);
});
