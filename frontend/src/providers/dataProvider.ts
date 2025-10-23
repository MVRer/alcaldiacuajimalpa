import { fetchUtils } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

const httpClient = (url: string, options: never = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = localStorage.getItem("auth");
  if (token) {
    options.headers.set("Authorization", token);
  }
  return fetchUtils.fetchJson(url, options);
};

const baseDataProvider = jsonServerProvider(
  import.meta.env.VITE_API_URL,
  httpClient,
);

const dataProvider = {
  ...baseDataProvider,
  getList: (resource: string, params: never) => {
    return baseDataProvider.getList(resource, params).then((response) => ({
      ...response,
      data: response.data.map((record: never) => ({
        ...record,
        id: record.id || record._id,
      })),
    }));
  },
  getOne: (resource: string, params: never) => {
    return baseDataProvider.getOne(resource, params).then((response) => ({
      data: {
        ...response.data,
        id: response.data.id || response.data._id,
      },
    }));
  },
  getMany: (resource: string, params: never) => {
    return baseDataProvider.getMany(resource, params).then((response) => ({
      data: response.data.map((record: never) => ({
        ...record,
        id: record.id || record._id,
      })),
    }));
  },
  create: (resource: string, params: never) => {
    return baseDataProvider.create(resource, params).then((response) => ({
      data: {
        ...response.data,
        id: response.data.id || response.data._id,
      },
    }));
  },
  update: (resource: string, params: never) => {
    return baseDataProvider.update(resource, params).then((response) => ({
      data: {
        ...response.data,
        id: response.data.id || response.data._id,
      },
    }));
  },
  delete: (resource: string, params: never) => {
    return baseDataProvider.delete(resource, params).then((response) => ({
      data: {
        ...response.data,
        id: response.data.id || response.data._id,
      },
    }));
  },
};

export default dataProvider;