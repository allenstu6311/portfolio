import $http from '../index';

/**
 * 選舉支持度
 * @param id 區域id 
 */
export const getSelectionData = async (id: string) => {
    const response = await $http.get(`/data/TaiwanSelection/topoJson/selection/${id}.json`)
    return response.data;
}

/**
 * 取得地圖topojson
 */
export const getMapData = async (url: string) => {
    const response = await $http.get(url)
    return response.data;
}

/**
 * 取得所有地名編碼
 */
export const getLocationCode = async () => {
    const response = await $http.get('/data/TaiwanSelection/csv/area-code.csv', { responseType: 'text' })
    return response.data;
}

/**
 * 取得AI分析
 * @param fileName 檔案名稱
 */
export const getAreaDetail = async (fileName: string) => {
    const response = await $http.get(`/data/TaiwanSelection/csv/${fileName}.csv`, { responseType: 'text' })
    return response.data;
}


