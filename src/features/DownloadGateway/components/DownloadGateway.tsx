'use client';

import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { fetchGatewayConfig, GatewayConfig } from '../lib/gateway-client'
import styles from './DownloadGateway.module.css'

interface DownloadGatewayProps {
    triggerText?: string
    variant?: 'primary' | 'secondary'
    className?: string
    isOpen?: boolean
    onClose?: () => void
}

// Simple Icons - Brand Colors
const IconWeb = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

const IconAndroid = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#3DDC84" stroke="none">
        <path d="M17.523 15.3414C17.523 15.3414 17.5644 15.3414 17.5644 15.3414C17.5644 15.3414 17.5644 15.3414 17.5644 15.3414C17.5644 15.3414 17.5644 15.3414 17.5644 15.3414ZM7.22756 12.0163C6.73024 12.0163 6.31559 12.4309 6.31559 12.9282V17.9014C6.31559 18.3988 6.73024 18.8134 7.22756 18.8134C7.72489 18.8134 8.13953 18.3988 8.13953 17.9014V12.9282C8.13953 12.4309 7.72489 12.0163 7.22756 12.0163ZM3.78652 12.8868C3.78652 12.8868 3.78652 12.8868 3.78652 12.8868L3.78652 12.8868ZM1.83832 12.9282C1.83832 12.4309 2.25297 12.0163 2.75030 12.0163C3.24762 12.0163 3.66227 12.4309 3.66227 12.9282V16.6579C3.66227 17.1552 3.24762 17.5699 2.75030 17.5699C2.25297 17.5699 1.83832 17.1552 1.83832 16.6579V12.9282ZM12.0001 0.493164C11.5441 0.493164 11.1294 0.700486 10.8392 1.03219L9.18116 3.93414C7.44021 4.72195 6.06686 6.04878 5.36218 7.7483H18.638C17.9333 6.04878 16.5599 4.72195 14.819 3.93414L13.1609 1.03219C12.8708 0.700486 12.4561 0.493164 12.0001 0.493164ZM14.1972 5.09502C14.4874 5.09502 14.7362 5.34380 14.7362 5.63404C14.7362 5.92429 14.4874 6.17307 14.1972 6.17307C13.9069 6.17307 13.6582 5.92429 13.6582 5.63404C13.6582 5.34380 13.9069 5.09502 14.1972 5.09502ZM9.80295 5.09502C10.0932 5.09502 10.3420 5.34380 10.3420 5.63404C10.3420 5.92429 10.0932 6.17307 9.80295 6.17307C9.51271 6.17307 9.26393 5.92429 9.26393 5.63404C9.26393 5.34380 9.51271 5.09502 9.80295 5.09502ZM5.27927 8.57732H18.7209C19.1355 8.57732 19.4672 8.90903 19.4672 9.32366V15.5401C19.4672 17.5714 17.8091 19.2294 15.7779 19.2294H8.22229C6.19107 19.2294 4.53296 17.5714 4.53296 15.5401V9.32366C4.53296 8.90903 4.86467 8.57732 5.27927 8.57732ZM20.3375 12.9282C20.3375 12.4309 20.7521 12.0163 21.2495 12.0163C21.7468 12.0163 22.1614 12.4309 22.1614 12.9282V16.6579C22.1614 17.1552 21.7468 17.5699 21.2495 17.5699C20.7521 17.5699 20.3375 17.1552 20.3375 16.6579V12.9282Z" />
    </svg>
);

const IconApple = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#e5e5e5" stroke="none">
        <path d="M17.05 12.78c-.01-1.64.91-2.6 2.36-3.23-.49-1.39-1.42-2.33-2.67-2.84-.7-.27-1.4-.29-2.07-.06-.67.23-1.25.68-1.74.68-.5 0-1.12-.47-1.85-.71-1.35-.44-2.73-.24-3.95.73-1.66 1.34-2.5 3.72-1.92 6.02.43 1.7 1.48 3.51 2.89 4.96.65.65 1.38 1.28 2.21 1.28.66 0 1.05-.28 1.83-.28.77 0 1.13.28 1.81.28.77 0 1.57-.73 2.31-1.53.64-.7 1.25-1.66 1.58-2.36-1.55-.61-2.01-1.68-2.01-2.93zM14.99 6.27c.46-.86.5-1.84.22-2.82-.9.13-1.84.58-2.45 1.25-.49.54-.75 1.43-.54 2.33.91.13 1.95-.23 2.77-.76z" />
    </svg>
);

export default function DownloadGateway({
    triggerText = '立即下载',
    variant = 'primary',
    className = '',
    isOpen: controlledIsOpen,
    onClose: controlledOnClose
}: DownloadGatewayProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [config, setConfig] = useState<GatewayConfig | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)
    const [isInternationalExpanded, setInternationalExpanded] = useState(false);

    const isControlled = typeof controlledIsOpen !== 'undefined';
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const loadConfig = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await fetchGatewayConfig()
            setConfig(data)
        } catch (err) {
            console.error('Failed to load download config', err)
            setError('获取下载链接失败，请稍后重试')
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Effect to load config when opened
    useEffect(() => {
        if (isOpen && !config && !isLoading && !error) {
            loadConfig();
        }
    }, [isOpen, config, isLoading, error, loadConfig]);

    const handleInternalOpen = () => {
        if (!isControlled) {
            setInternalIsOpen(true)
        }
    }

    const handleClose = () => {
        if (isControlled && controlledOnClose) {
            controlledOnClose()
        } else {
            setInternalIsOpen(false)
        }
    }

    const handleDownload = (url: string, type: 'download' | 'link') => {
        if (!url) return
        if (type === 'download') {
            window.location.href = url
        } else {
            window.open(url, '_blank')
        }
    }

    // Prevent scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!mounted) return null

    const modalContent = (
        <div className={styles.overlay} onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
        }}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3 className={styles.title}>选择访问方式</h3>
                    {isLoading && (
                        <p className={styles.description}>
                            正在加载访问选项...
                        </p>
                    )}
                </div>

                {isLoading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>正在加载...</p>
                    </div>
                ) : error ? (
                    <div className={styles.error}>
                        <p>{error}</p>
                        <button
                            onClick={loadConfig}
                            style={{ marginTop: '12px', padding: '6px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            重试
                        </button>
                    </div>
                ) : config ? (
                    <>
                        {/* Domestic Group (Green Theme) */}
                        <div className={styles.group}>
                            <h4 className={styles.groupTitle} style={{ color: '#f97316' }}>
                                【推荐】 <span className={styles.groupDescription}>推荐使用</span>
                            </h4>
                            <div className={styles.groupButtons}>
                                <button className={`${styles.actionBtn} ${styles.btnRecommend}`} onClick={() => handleDownload(config.web.china, 'link')}>
                                    <span className={styles.btnIcon}><IconWeb /></span>
                                    <span className={styles.btnMain}>访问官网</span>
                                    <span className={styles.btnTag}>🔥</span>
                                    <span className={styles.btnSub}>推荐线路 · 高速稳定</span>
                                </button>
                                <button className={`${styles.actionBtn} ${styles.btnRecommend}`} onClick={() => handleDownload(config.android.china, 'download')}>
                                    <span className={styles.btnIcon}><IconAndroid /></span>
                                    <span className={styles.btnMain}>安卓下载</span>
                                    <span className={styles.btnTag}>🔥</span>
                                    <span className={styles.btnSub}>官方APK安装包</span>
                                </button>
                                <button className={styles.actionBtn} onClick={() => handleDownload(config.web.china, 'link')}>
                                    <span className={styles.btnIcon}><IconApple /></span>
                                    <span className={styles.btnMain}>苹果下载</span>
                                    <span className={styles.btnSub}>需先官网注册或登录</span>
                                </button>
                            </div>
                        </div>

                        {/* International Group (Blue Theme) - Collapsible on Mobile */}
                        <div className={styles.group}>
                            <div
                                className={styles.groupHeader}
                                onClick={() => setInternationalExpanded(!isInternationalExpanded)}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: isInternationalExpanded ? '0' : '0'
                                }}
                            >
                                <h4 className={styles.groupTitle} style={{ color: '#3b82f6', marginBottom: 0 }}>
                                    【国际】 <span className={styles.groupDescription}>国际版 (需能够访问的国际网络环境)</span>
                                </h4>
                                <span style={{
                                    display: 'inline-block',
                                    transform: isInternationalExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                    color: 'rgba(255,255,255,0.4)',
                                    fontSize: '12px',
                                    marginLeft: '8px'
                                }}>
                                    ▼
                                </span>
                            </div>

                            {isInternationalExpanded && (
                                <div className={styles.groupButtons} style={{ marginTop: '10px' }}>
                                    <button className={styles.actionBtn} onClick={() => handleDownload(config.web.global, 'link')}>
                                        <span className={styles.btnIcon}><IconWeb /></span>
                                        <span className={styles.btnMain}>访问官网</span>
                                        <span className={styles.btnSub}>国际版 / 备用</span>
                                    </button>
                                    <button className={styles.actionBtn} onClick={() => handleDownload(config.android.global, 'download')}>
                                        <span className={styles.btnIcon}><IconAndroid /></span>
                                        <span className={styles.btnMain}>安卓下载</span>
                                        <span className={styles.btnSub}>全球通用</span>
                                    </button>
                                    <button className={styles.actionBtn} onClick={() => handleDownload(config.web.global, 'link')}>
                                        <span className={styles.btnIcon}><IconApple /></span>
                                        <span className={styles.btnMain}>苹果下载</span>
                                        <span className={styles.btnSub}>需先官网注册或登录</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={styles.footerNote}>
                            已有账号的用户可直接登录。
                        </div>
                    </>
                ) : null}

                <button className={styles.closeButton} onClick={handleClose}>
                    关闭窗口
                </button>
            </div>
        </div>
    );

    // Controlled Mode: Only render modal if open
    if (isControlled) {
        return isOpen ? createPortal(modalContent, document.body) : null
    }

    // Uncontrolled Mode: Render trigger button + modal
    return (
        <div className={`${styles.trigger} ${className}`}>
            <button
                type="button"
                className={`${styles.triggerButton} ${variant === 'primary' ? styles.triggerPrimary : styles.triggerSecondary}`}
                onClick={handleInternalOpen}
            >
                {triggerText}
            </button>
            {isOpen && createPortal(modalContent, document.body)}
        </div>
    )
}
