export default function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,25,27,.45)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          width: '100%',
          maxWidth: 460,
          borderRadius: '20px 20px 0 0',
          padding: '18px 20px calc(20px + env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ font: "700 16px/1 var(--font-ui)" }}>{title}</div>
          <div
            onClick={onClose}
            className="clickable"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'rgba(20,25,27,.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              font: "600 14px/1 var(--font-ui)",
              color: 'var(--sub)',
            }}
          >
            ×
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
