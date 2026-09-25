import Image from "next/image";
import Link from "next/link";

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YoutubeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TiktokIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.76 1.19-.04 2.33-.67 2.97-1.68.32-.47.49-1.02.49-1.58.02-4.04.01-8.08.01-12.12z" />
    </svg>
  );
}

function WhatsappIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.778.978-.954 1.179-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.494-.894-.797-1.498-1.782-1.674-2.083-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.631-.929-2.233-.244-.587-.493-.507-.678-.517-.176-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.029-1.054 2.508c0 1.48 1.079 2.909 1.229 3.109.151.2 2.126 3.246 5.15 4.554.719.311 1.281.497 1.719.636.723.23 1.381.198 1.901.12.579-.087 1.78-.727 2.03-1.429.251-.702.251-1.304.176-1.43-.075-.125-.276-.2-.577-.35zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.98.58 3.82 1.58 5.37L2 22l4.78-1.54c1.49.91 3.23 1.44 5.11 1.44 5.53 0 10.02-4.49 10.02-10.02C21.91 6.49 17.42 2 12.04 2z" />
    </svg>
  );
}

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/sentradesa.id", icon: InstagramIcon, label: "Kunjungi Instagram SentraDesa" },
  { name: "Facebook", href: "https://facebook.com/sentradesa.id", icon: FacebookIcon, label: "Kunjungi Facebook SentraDesa" },
  { name: "YouTube", href: "https://youtube.com/@sentradesa", icon: YoutubeIcon, label: "Kunjungi YouTube SentraDesa" },
  { name: "TikTok", href: "https://tiktok.com/@sentradesa", icon: TiktokIcon, label: "Kunjungi TikTok SentraDesa" },
  { name: "WhatsApp", href: "https://wa.me/6281234567890", icon: WhatsappIcon, label: "Hubungi WhatsApp SentraDesa" }
];

export function Footer() {
  return (
    <footer className="mt-10 bg-sentra-soft px-6 py-10 border-t border-emerald-900/5">
      <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Logo & Platform Name */}
        <div className="flex items-center justify-center gap-3">
          <Image src="/images/logo.png" alt="Logo SentraDesa" width={42} height={42} className="h-10 w-auto object-contain drop-shadow-2xs" />
          <div className="text-left">
            <strong className="block font-headline text-base font-extrabold text-[#006e23] tracking-tight">SentraDesa</strong>
            <span className="font-sans text-[11px] font-semibold text-[#6b7c68]">Platform Ekosistem Digital Desa</span>
          </div>
        </div>

        <p className="mt-3.5 max-w-xl font-sans text-xs md:text-sm leading-6 text-[#3b4b39]">
          Portal digital desa untuk mempertemukan produk, layanan, informasi, dan peluang ekonomi lokal.
        </p>

        {/* Quick Nav Links */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6 font-sans text-xs font-semibold text-[#3b4b39]">
          <Link className="transition hover:text-[#006e23]" href="/wishlist/">Wishlist Antar Desa</Link>
          <Link className="transition hover:text-[#006e23]" href="/village-admin/register/">Daftar Admin Desa</Link>
          <Link className="transition hover:text-[#006e23]" href="/merchant/dashboard/">Dashboard Merchant</Link>
        </div>

        {/* Social Media Accounts */}
        <div className="mt-6 pt-5 border-t border-[#006e23]/10 w-full max-w-md flex flex-col items-center gap-2.5">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Ikuti Kami di Media Sosial</span>
          <div className="flex items-center justify-center gap-2.5">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                title={item.name}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 border border-slate-200/80 shadow-2xs transition-all duration-200 hover:bg-[#006e23] hover:text-white hover:border-[#006e23] hover:scale-110 active:scale-95 cursor-pointer"
              >
                <item.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
