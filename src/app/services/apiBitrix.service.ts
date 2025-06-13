import axiosCf from '../../config/axios.config';
import * as AuthBitrix from './authBitrix.service';
export const anyApiOAuthBitrix = async ({
    domain,
    action,
    payload,
    access_token,
    member_id,
}: {
    access_token: string;
    domain: string;
    action: string;
    payload: any;
    member_id?: string;
}): Promise<any> => {
    try {
        payload.auth = access_token;
        const url = `https://${domain}/rest/${action}.json`;
        const response = await axiosCf.post(url, payload);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi gọi API Bitrix:', error.response?.data || error.message);
        if (error.response?.data?.error === 'expired_token') {
            const newToken = await AuthBitrix.getTokenBitrix(member_id || '');
            return await anyApiOAuthBitrix({
                domain,
                action,
                payload,
                access_token: newToken,
                member_id,
            });
        }
        throw error;
    }
};
// curl -X POST \
// -H "Content-Type: application/json" \
// -H "Accept: application/json" \
// -d '{"FILTER":{"SOURCE_ID":"CRM_FORM","!=NAME":"","!=LAST_NAME":"","LOGIC":"OR","0":{"=%NAME":"I%"},"1":{"=%LAST_NAME":"I%"},"EMAIL":"special-for@example.com","@ASSIGNED_BY_ID":[1,6],"IMPORT":"Y",">=DATE_CREATE":"**put_six_month_ago_date_here**"},"ORDER":{"LAST_NAME":"ASC","NAME":"ASC"},"SELECT":["ID","NAME","LAST_NAME","EMAIL","EXPORT","ASSIGNED_BY_ID","DATE_CREATE"],"auth":"**put_access_token_here**"}' \
// https://**put_your_bitrix24_address**/rest/crm.contact.list
// payload :{
//   "FILTER": {
//       "SOURCE_ID": "CRM_FORM",
//       "!=NAME": "",
//       "!=LAST_NAME": "",
//       "LOGIC": "OR",
//       "0": {
//           "=%NAME": "I%"
//       },
//       "1": {
//           "=%LAST_NAME": "I%"
//       },
//       "EMAIL": "special-for@example.com",
//       "@ASSIGNED_BY_ID": [
//           1,
//           6
//       ],
//       "IMPORT": "Y",
//       ">=DATE_CREATE": "**put_six_month_ago_date_here**"
//   },
//   "ORDER": {
//       "LAST_NAME": "ASC",
//       "NAME": "ASC"
//   },
//   "SELECT": [
//       "ID",
//       "NAME",
//       "LAST_NAME",
//       "EMAIL",
//       "EXPORT",
//       "ASSIGNED_BY_ID",
//       "DATE_CREATE"
//   ],
//   "auth": "**put_access_token_here**"
// }
