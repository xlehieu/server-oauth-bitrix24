# Em chào anh/chị ạ

# Khi dựng server thì em cũng có dùng ngrok nhưng khi em dùng client(em deploy lên Vercel) để gọi api đến server thì bị trả ra một đoạn html vì ngrok khi click vào link thì redirect(khi gọi từ local thì không bị ạ) đến một trang có button visit site ý ạ

# Server em dùng NODEJS + EXPRESS + MONGODB

    -- DB em dùng Atlas

# Cài đặt:

-   NODE VERSON 22.x
    -- npm run dev : chạy server

-   Enviroment variable:
    PORT=8080
    BITRIX_CLIENT_ID=local.6840f32c4595b6.11637008
    BITRIX_CLIENT_SECRET=RWwFsClBMjCBns7r63TPu9Pl6o4yRncrv7Ef3W0XothoPqcNpa
    FRONTEND_URL=http://localhost:3000
    DATABASE_URI=mongodb+srv://xlehieu:Hieumao2003@cluster0.uwnpg.mongodb.net/OAuthBitrix?retryWrites=true&w=majority&appName=Cluster0
    ALLOWED_ORIGINS=http://localhost:3000,https://client-oauth-bitrix24.vercel.app
    JWT_SECRET=i_want_to_work_at_AASC

# Deploy server lên Vercel:

-   Truy cập url : vercel.com
-   Chọn project của Github
-   Cấu hình deplpoy:
    => chỉ cần sửa Build Command: tsc, còn lại các cài đặt mặc định ạ
    Cấu hình Enviroment variable:
    BITRIX_CLIENT_ID=local.6840f32c4595b6.11637008
    BITRIX_CLIENT_SECRET=RWwFsClBMjCBns7r63TPu9Pl6o4yRncrv7Ef3W0XothoPqcNpa
    FRONTEND_URL=https://fe-domain-vercel.vercel.app
    DATABASE_URI=mongodb+srv://xlehieu:Hieumao2003@cluster0.uwnpg.mongodb.net/OAuthBitrix?retryWrites=true&w=majority&appName=Cluster0
    ALLOWED_ORIGINS=http://localhost:3000,https://client-oauth-bitrix24.vercel.app
    JWT_SECRET=i_want_to_work_at_AASC
-   Để server chạy nhanh hơn thì anh chị có thể vào mục Settings => Functions => Advanced Settings => Function Region => chuyển về Asia Pacific
