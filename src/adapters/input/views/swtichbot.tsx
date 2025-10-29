import { FC } from "hono/jsx";

export type Device = {
    deviceId: string;
    deviceName: string;
    deviceType: string;
    enableCloudService?: boolean;
    hubDeviceId?: string;
};

export type SwitchbotProps = {
    devices: Device[];
    homePath: string;
};

export const Switchbot: FC<SwitchbotProps> = ({devices , homePath} , ) => {
    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>
                    Smart Lock 一覧
                </h1>
                <a
                    href={homePath}
                    style={{
                        marginLeft: '24px',
                        color: '#1976d2',
                        fontWeight: 600,
                        fontSize: '16px',
                        textDecoration: 'none',
                        padding: '6px 16px',
                        borderRadius: '6px',
                        border: '1px solid #1976d2',
                        background: '#e3f2fd',
                        transition: 'background 0.2s',
                    }}
                >
                    Go to home
                </a>
            </div>

            {devices.length === 0 ? (
                <p>Smart Lock デバイスが見つかりませんでした。</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 , margin: 0 , display: 'grid', gap: '12px' }}>
                        {devices.map((d) => (
                        <li key={d.deviceId} style={{ marginBottom: '12px' }}>
                        <button
                            data-device={d.deviceId}
                            class="js-control"
                            style={{
                            padding: '8px',
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            fontSize: '20px',
                            width: '100%',
                            background: '#fff',
                                cursor: 'pointer',                     
                            }}
                        >
                            {d.deviceName}
                                </button>  
                        </li>        
                    ))}
                    </ul>
            )}
            <div
                id='modal-backdrop'
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                }}>
                    <div
                        id="modal-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        style={{
                            width: 'min(520px, 92vw)',
                            background: '#fff',
                            borderRadius: '12px',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                            overflow: 'hidden',
                        }}>
                        <div
                            id="modal-header"
                            style={{
                                padding: '12px 16px',
                                color: '#fff',
                                fontWeight: 700
                        }}>
                            <span id="modal-title">ダイアログ</span>
                        </div>
                    <div
                        id="modal-body"
                        style={{
                            padding: '16px',
                            color: '#222'
                        }}>
                        <p>…</p>
                    </div>
                </div>
            </div>
            <script
        dangerouslySetInnerHTML={{
            __html: `
            (() => {
            const backdrop = document.getElementById('modal-backdrop');
            const header = document.getElementById('modal-header');
            const bodyEl = document.getElementById('modal-body');
            const titleEl = document.getElementById('modal-title');
            const dialog = document.getElementById('modal-dialog');

            function openModal({success, text}) {
                if (success) {
                    header.style.background = '#4caf50';
                    titleEl.textContent = '✅ 成功';
                } else {
                    header.style.background = '#f44336';
                    titleEl.textContent = '❌ 失敗';
                }

                bodyEl.innerHTML = text;
                backdrop.style.display = 'flex';
                document.documentElement.style.overflow = 'hidden';
            }

            function closeModal() {
                backdrop.style.display = 'none';
                document.documentElement.style.overflow = '';
            }

            backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
            dialog.addEventListener('click', closeModal);

            function showDialog(success, statusCode) {
                if (success) {
                    openModal({
                        success: true,
                        text: \`<p style="margin: 0;">扉が開きました</p>\`
                    });
                } else {
                    openModal({
                        success: false,
                        text: \`
                        <p style='margin: 0;'>ステータスコード:  \${statusCode} </p>
                        <p style='margin: 0;'>エラーが発生しました</p>
                        \`
                    });
                }
            }
            document.querySelectorAll('.js-control').forEach(btn => {
                btn.addEventListener('click', async () => {
                const deviceId = btn.getAttribute('data-device');
                if (!deviceId) return;

                  // 二度押し防止
                const prevText = btn.textContent;
                btn.setAttribute('disabled', 'true');
                btn.textContent = (prevText || '実行') + ' …';

                try {
                    const res = await fetch('/control', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ deviceId }),
                });

                const text = await res.text();

                if (!res.ok) {
                    showDialog(false,  res.status);
                }else{
                    showDialog(true,  res.status);
                }

                } catch (e) {
                    showDialog(false, e.message , 0);
                } finally {
                    btn.removeAttribute('disabled');
                    btn.textContent = prevText;
                }
            });
            });
            })();
            `,
            }}
            />
        </>
    );
};
