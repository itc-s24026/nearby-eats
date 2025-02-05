import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 Bootstrap 样式
import type { AppProps } from 'next/app'; // 引入 Next.js 类型定义

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

