/**
 * Worker Domain Configuration
 * 
 * 专门用于配置 Cloudflare Worker 的访问地址。
 * 如果域名被封，只需修改此文件即可。
 */

export const WORKER_DOMAINS = [
    'https://ooo.clickwar.app/', // 自定义域名 (首选)
    // 'https://backup-worker.your.workers.dev/', // 备用 Worker (示例)
    'https://cfgreturn.pages.dev/return.json'  // Pages 静态源 (最后的保底)
];
