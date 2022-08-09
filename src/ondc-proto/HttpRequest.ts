import axios, {AxiosRequestConfig} from 'axios';
import {LOG} from '../common/lib/logger';

/**
 * Used to communicate with server
 */
class HttpRequest {

    baseUrl: string;
    url: string;
    method: string;
    data: object;
    headers: object;
    options: object;

    /**
     * @param {*} baseUrl Base URL(domain url)
     * @param {*} url Resource URL
     * @param {*} method HTTP method(GET | POST | PUT | PATCH | DELETE)
     * @param {*} headers HTTP request headers
     * @param {*} data HTTP request data (If applicable)
     * @param {*} options other params
     */
    constructor(baseUrl: string, url: string, method = 'get', data = {}, headers = {}, options = {}) {
        this.baseUrl = baseUrl;
        this.url = url;
        this.method = method;
        this.data = data;
        this.headers = headers;
        this.options = options;
    }

    /**
     * Send http request to server to write data to / read data from server
     * axios library provides promise implementation to send request to server
     * Here we are using axios library for requesting a resource
     */
    async send()
    {
        try {
            const headers = {
                ...this.headers,
                ...(this.method.toLowerCase() != "get" && {'Content-Type': 'application/json'})
            };

            let result;

            if (this.method.toLowerCase() == 'get') {
                const payload: AxiosRequestConfig = {
                    baseURL: this.baseUrl,
                    url: this.url,
                    method: this.method,
                    headers: headers,
                    timeout: 180000, // If the request takes longer than `timeout`, the request will be aborted.
                }
                LOG.info({msg: 'httpRequest GET', payload})
                result = await axios(payload);
            } else {
                const payload: AxiosRequestConfig = {
                    baseURL: this.baseUrl,
                    url: this.url,
                    method: this.method,
                    headers: headers,
                    timeout: 180000, // If the request takes longer than `timeout`, the request will be aborted.
                    data: this.data,
                }
                LOG.info({msg: 'httpRequest POST', payload})
                // Make server request using axios
                result = await axios(payload);
            }
            return result;
        } catch (err) {
            LOG.info({msg: 'httpRequest error', error: err});
        }
    }
}

export default HttpRequest;
