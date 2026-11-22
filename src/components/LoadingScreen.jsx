export function LoadingScreen({ message = 'Preparando boas descobertas…', exiting = false }) {
  return (
    <main className={`brand-loader${exiting ? ' is-exiting' : ''}`} aria-label="Carregando a Alba" aria-busy="true">
      <div className="brand-loader-content">
        <div className="brand-loader-mark" aria-hidden="true">
          <img src="/assets/sol-e-livro-logo.png" width="512" height="288" alt="" fetchPriority="high" />
        </div>
        <p className="brand-loader-name" aria-hidden="true">Alba</p>
        <p className="brand-loader-message" role="status" aria-live="polite">{message}</p>
        <span className="brand-loader-line" aria-hidden="true" />
      </div>
    </main>
  );
}
