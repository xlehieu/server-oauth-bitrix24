import axios from 'axios';
const axiosCf = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default axiosCf;
