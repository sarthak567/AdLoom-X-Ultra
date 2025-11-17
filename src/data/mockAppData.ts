import data from './appData.json';

export type LocalAppData = typeof data;

const defaultAppData = data as LocalAppData;

export default defaultAppData;

