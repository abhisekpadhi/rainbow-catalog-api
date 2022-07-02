import axios, {AxiosRequestConfig} from 'axios';
import { URL, URLSearchParams } from 'url';

const post = async <T>(url: string, body: object): Promise<T> => {
    const resp = await axios.post(url, body);
    return await resp.data as T;
}

const get = async <T>(url: URL): Promise<T> => {
    const resp = await axios.get(url.href);
    return resp.data as T;
}

const postWithParamAndConfig = async <T>(url: URL, params: URLSearchParams, config: AxiosRequestConfig): Promise<T> => {
    const res = await axios.post(url.href, params, config);
    return res.data as T;
}

export const http = {post, get, postWithParamAndConfig};
