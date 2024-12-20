import 'dotenv/config';
import {app} from './app';
import {RootRouter} from './src/resources';
import {OndcRouter} from './src/ondc-proto/ondc-router';
import {OndcTrackingRouter} from './src/ondc-proto/ondc-tracking-router';
import {DiganosticsApi} from './src/resources/diganostics-api';
import {Request, Response} from 'express';

const port = process.env.PORT! as unknown as number;
const host = process.env.HOST! as unknown as string;

app.use('/bap', (req: Request, res: Response) => {
    res.json({message: 'ok'});
});
app.use('/api', OndcRouter);
app.use('/tracking', OndcTrackingRouter);
app.use('/_', DiganosticsApi);
app.use('', RootRouter);

// start server
app.listen(port, () => {
    console.log(`⚡️ Server running from main.ts at http://${host}:${port}`);
});
