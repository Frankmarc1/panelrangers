import Link from 'next/link';
import { useRouter } from 'next/router';

const tabs = [
  {
    label: 'Motorizados',
    href: '/motorizados',
  },
  {
    label: 'Subscripciones',
    href: '/subs',
  },
];

export const MotorizedTabs = () => {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        marginBottom: 20,
      }}
    >
      {tabs.map((tab) => {
        const active = router.pathname === tab.href;

        return (
          <Link key={tab.href} href={tab.href}>
            <button
              type="button"
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                border: active ? '1px solid #111827' : '1px solid #d1d5db',
                background: active ? '#111827' : '#ffffff',
                color: active ? '#ffffff' : '#111827',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          </Link>
        );
      })}
    </div>
  );
};