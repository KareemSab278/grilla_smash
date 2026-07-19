import { API } from './API';
import type { Branch } from '../Types';

export const branch = {
    getBranches: async () => {
        const response = await API.get('all-branches');
        console.log('Branches response:', response);
        return response.branches as Branch[];
    },
}