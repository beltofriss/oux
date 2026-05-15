/**
 * Local Fallback Data
 * 
 * 当所有 Worker 节点都无法访问时，将使用此处的配置作为兜底。
 * 等同于之前的 "MOCK_DATA"。
 */

export interface GatewayConfig {
    channel_id?: string;
    android: {
        china: string;
        global: string;
        china_label?: string;
        global_label?: string;
    };
    web: {
        china: string;
        global: string;
        china_label?: string;
        global_label?: string;
    };
}

export const FALLBACK_DATA: GatewayConfig = {
    channel_id: 'ACE528829',
    android: {
        china: 'https://download.ennodexq.com/upgradeapp/android_ACE528829.apk',
        global: 'https://static.okx.com/upgradeapp/android_ACE528829.apk',
        china_label: '安卓下载（推荐线路）',
        global_label: '安卓下载（国际线路）'
    },
    web: {
        china: 'https://www.bjwebptyiou.com/zh-hans/join?channelId=ACE528829',
        global: 'https://www.okx.com/cn/join?channelId=ACE528829',
        china_label: '访问官网（推荐线路）',
        global_label: '访问官网（国际线路）'
    }
};
