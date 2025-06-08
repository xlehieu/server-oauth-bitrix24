# install bitrix

-   lấy memberid,DOMAIN,... bitrix thêm vào db
    -- lấy member_id của bitrix lại lưu vào access_token của backend riêng
    -- khi call api bitrix sẽ tìm thông tin memberid và lấy ra access_token,domain,... từ db
    -- redirect về FE có query chứa member_id bitrix
    -- FE khi có member_id quay lại BE lấy access_token chứa thông tin member_id và domain và fresh_token
    -- lưu vào localStorage
    -- khi access_token của BE hết hạn thì đổi lại (chưa có cơ chế hết hạn refresh token thì ví dụ như đăng nhập lại => cấp lại access_token khi hết hạn)

# login cấp access_token

-   FE lưu vào localStorage

# FE => gọi api backend => gọi api Bitrix

-   BE check access_token của FE gửi
    -- lấy member_id, action, payload
    --- gọi api Bitrix

## fix bitrix post install được vercel lại không - call api ok
