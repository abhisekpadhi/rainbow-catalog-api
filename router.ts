import {app} from './app';
import {ApiRoutes} from './src/ApiRoutes';
import {
    RootResource,
} from './src/resources';

app.use(ApiRoutes.root, RootResource);
