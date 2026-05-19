
export default function Navbar() {
    const pathname = usePathname();

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                height: 60,
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                borderBottom: '1px solid rgba(15,23,42,0.07)',
                boxShadow: '0 1px 12px rgba(14,165,233,0.06)',
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    height: '100%',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                    <div
                        style={{
                            width: 30,
                            height: 30,
                            background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C12 2 4 10 4 15a8 8 0 0016 0c0-5-8-13-8-13z" fill="white" />
                        </svg>
                    </div>
                    <span
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: 15,
                            color: '#0f172a',
                            letterSpacing: '-0.3px',
                        }}
                    >
                        AquaShield
                    </span>
                </Link>

                {/* Nav links */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                    {NAV_LINKS.map(({ href, label }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`nav-link${isActive ? ' active' : ''}`}
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 13,
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? 'var(--aqua)' : 'var(--text-secondary)',
                                    textDecoration: 'none',
                                }}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* CTA */}
                <Link
                    href="/test"
                    className="btn-primary"
                    style={{ padding: '7px 18px', fontSize: 13 }}
                >
                    Test Now
                </Link>
            </div>
        </header>
    );
}
