import { WORKER_DOMAINS } from './worker-domains';

export const GATEWAY_CONFIG = {
    /**
     * 下载网关配置 (防封弹窗)
     */
    gateway: {
        // 真实 API 地址列表 (自动轮询)
        endpoints: WORKER_DOMAINS,
    }
} as const;
