import React, { useId } from 'react';

/**
 * KorvenzaTech "K" — inline vector logo (master: brand-source/k-logo.svg).
 * Inline so it is crisp at every size, needs no request and cannot shift layout
 * (explicit width/height). Gradient ids are unique per instance.
 */
export function BrandMark({ size = 32, className, title }: { size?: number; className?: string; title?: string }) {
  const p = `k${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const w = Math.round((size * 1200) / 1400);
  return (
    <svg viewBox="480 350 1200 1400" width={w} height={size} className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title} focusable="false">
      <defs> <linearGradient id={`${p}arm`} x1="560" y1="1300" x2="1640" y2="480" gradientUnits="userSpaceOnUse"> <stop offset="0" stopColor="#0A5A2A"/><stop offset=".45" stopColor="#11924A"/><stop offset=".78" stopColor="#2BC46E"/><stop offset="1" stopColor="#7BE3A6"/> </linearGradient> <linearGradient id={`${p}stem`} x1="0" y1="380" x2="0" y2="1300" gradientUnits="userSpaceOnUse"> <stop offset="0" stopColor="#A7B1AC"/><stop offset=".45" stopColor="#4A5550"/><stop offset=".8" stopColor="#1D2723"/><stop offset="1" stopColor="#1D2723" stopOpacity="0"/> </linearGradient> <linearGradient id={`${p}bar`} x1="1000" y1="1200" x2="1530" y2="860" gradientUnits="userSpaceOnUse"> <stop offset="0" stopColor="#1A2320"/><stop offset=".6" stopColor="#3D4743"/><stop offset="1" stopColor="#7E8A84"/> </linearGradient> <linearGradient id={`${p}legs`} x1="980" y1="1200" x2="1520" y2="1590" gradientUnits="userSpaceOnUse"> <stop offset="0" stopColor="#2FC874"/><stop offset=".5" stopColor="#139A4E"/><stop offset="1" stopColor="#0A5E2C"/> </linearGradient> </defs> <path fill={`url(#${p}arm)`} d="M1656 475L1373 491L836 985L833 909L870 868L852 374L504 611L514 1463L850 1727L850 1319L898 1274L903 1213L1626 548Z"/> <path fill="none" stroke="#062E17" strokeWidth="12" strokeLinejoin="round" d="M836 985L580 1222L580 1430M903 1213L640 1455"/> <path fill={`url(#${p}stem)`} d="M504 611L852 374L870 868L833 909L836 985L600 1205L514 1270Z"/> <g fill="none" stroke="#8CF0B8" strokeOpacity=".75" strokeWidth="5" strokeLinecap="round"> <path d="M700 700V930L650 980V1120M760 690V860L730 890V1010M810 700V840"/> <path d="M700 1460V1600M760 1400V1520L800 1560"/> </g> <g fill="#B9F7D4"><circle cx="650" cy="1120" r="9"/><circle cx="730" cy="1010" r="9"/><circle cx="810" cy="840" r="9"/><circle cx="700" cy="1600" r="9"/><circle cx="800" cy="1560" r="9"/></g> <path fill={`url(#${p}bar)`} d="M1349 861L1534 868L1513 910L1187 1220L984 1188Z"/> <path fill={`url(#${p}legs)`} d="M984 1188L1187 1220L1394 1504L1462 1573L1440 1592L1306 1590L971 1254Z"/> <path fill={`url(#${p}legs)`} d="M1200 1222L1276 1228L1537 1482L1517 1502L1408 1503Z"/> <path fill="none" stroke="#062E17" strokeWidth="12" strokeLinejoin="round" d="M1190 1221L1400 1506"/> <path fill="none" stroke="#C9F8DD" strokeOpacity=".55" strokeWidth="5" strokeLinejoin="round" d="M1373 491L1656 475M504 611L852 374M1349 861L1534 868"/>
    </svg>
  );
}
