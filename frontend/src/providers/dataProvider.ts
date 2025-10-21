import { fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const httpClient = (url: string, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('auth');
    if (token) {
        options.headers.set('Authorization', token);
    }
    return fetchUtils.fetchJson(url, options);
};

const baseDataProvider = jsonServerProvider(import.meta.env.VITE_API_URL, httpClient);

export const dataProvider = {
    ...baseDataProvider,
    getList: (resource: string, params: any) => {
        return baseDataProvider.getList(resource, params).then((response) => ({
            ...response,
            data: response.data.map((record: any) => ({
                ...record,
                id: record.id || record._id,
            })),
        }));
    },
    getOne: (resource: string, params: any) => {
        return baseDataProvider.getOne(resource, params).then((response) => ({
            data: {
                ...response.data,
                id: response.data.id || response.data._id,
            },
        }));
    },
    getMany: (resource: string, params: any) => {
        return baseDataProvider.getMany(resource, params).then((response) => ({
            data: response.data.map((record: any) => ({
                ...record,
                id: record.id || record._id,
            })),
        }));
    },
    create: (resource: string, params: any) => {
        return baseDataProvider.create(resource, params).then((response) => ({
            data: {
                ...response.data,
                id: response.data.id || response.data._id,
            },
        }));
    },
    update: (resource: string, params: any) => {
        return baseDataProvider.update(resource, params).then((response) => ({
            data: {
                ...response.data,
                id: response.data.id || response.data._id,
            },
        }));
    },
    delete: (resource: string, params: any) => {
        return baseDataProvider.delete(resource, params).then((response) => ({
            data: {
                ...response.data,
                id: response.data.id || response.data._id,
            },
        }));
    },
};
