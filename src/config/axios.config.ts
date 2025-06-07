import axios from 'axios';
const axiosCf = () => {
    return axios.create({
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });
};
export default axiosCf;
