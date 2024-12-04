

## Công nghệ sử dụng:

- Thư viện:

  - [ReactJS][https://react.dev/learn]

- Plugin:

  - [Vite][https://vitejs.dev/guide/]

- Quản lý state:

  - [redux-toolkit (các init state)][https://redux-toolkit.js.org/api/configureStore]
  - useState Hooks (các local state)

- Dùng API:

  - [axios][https://axios-http.com/]

- Framework CSS:

  - [TailwindCSS] [https://tailwindcss.com/docs/installation]
  - [Flowbite (Kham khảo để xem className)][https://flowbite.com/docs/getting-started/quickstart/]

- Framework UI component:

  - [Material UI][https://mui.com/material-ui/all-components/]

- Icon:

  - [HeroIcon][https://heroicons.com/]

- Validation:

  - [Yup + Fomik][https://formik.org/docs/tutorial]

- Hiển thị thông báo lỗi:

  - [SweetAlert2][https://sweetalert2.github.io/recipe-gallery/]

- Slide:

  - [Swiper][https://swiperjs.com/element#usage-with-react]

- Vẽ chart:

  - Chart.js [https://www.chartjs.org/docs/latest/]

- Google Auth: <Optional>

- Deploy:
  - Vercel [https://vercel.com/docs/frameworks/vite]

# Các lệnh cần dụng v0.0

- npm i hoặc npm install : Tải các dependencies có trong package.json chưa có

- npm update: Update các

- npm run dev: Chạy app

- npm run lint: Kiểm tra các lỗi có trong các file (Lỗi khai báo không dùng, lỗi thiếu props validation)

# Cấu trúc thư mục v0.0

- src/api:

  - Chứa các function call api của các trang
  - Đầu vào: các url của api
  - Đầu ra: các response data

- src/apps:

  - Chứa App.jsx và store.js
  - App.jsx: Khai báo các đường dẫn của trang
  - store.js: Khai báo store configuration của redux

- src/assets:

  - Chứa các hình ảnh, icon

- src/components:

  - Chứa các components chung và components riêng giữa các trang
  - Components chung: đặt ở directory gốc
  - Components riêng của các trang: đặt trong các thư mục riêng (tự tạo theo module của người phụ trách)

- src/configs:

  - Chứa các configuration của các thư viện bên thứ 3 cần thiết (Ví dụ: độ trễ của thông báo, màu sắc mặc định của Material UI,...)

- src/constants:

  - Chứa các hardcode để dynamic rendering các trang (Ví dụ: các ListItem trong các List)

- src/features:

  - Chứa các thư mục cần để dùng redux = slices + reducers

- src/hooks:

  - Chứa các custom hook được sử dụng nhiều (Ví dụ: useFetch để call api nhanh)

- src/layouts:

  - Chứa các layouts để dùng chung cho các trang
  - Sử dụng các components chung có trong components

- src/pages:

  - Chứa các trang khác nhau
  - Sử dụng các component riêng có trong components

- src/styles:

  - Chứa các file css (Nếu có)

- src/utils:

  - Chứa các function dùng chung ví dụ (Ví dụ: Tính tổng, Quy đổi tiền tệ)

- main.jsx:

  - Configuration chính của trang web (Ví dụ: ThemeProvider)

- .env:

  - Khai báo các biến môi trường (nếu có)

- index.html:

  - Hiển thị: icon và title của trang web

# ChangeLog
