import { API } from './API';

export const branch = {
    getBranches: async () => {
        const response = await API.get('all-branches');
        console.log('Branches response:', response);
        return response.branches;
    },
}