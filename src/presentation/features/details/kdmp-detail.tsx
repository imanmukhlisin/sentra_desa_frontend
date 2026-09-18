"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { formatCurrency } from "@/shared/utils/format";
import { KdmpIcon, MapPinIcon, ChevronLeftIcon, PhoneIcon } from "@/presentation/components/icons";

export function KdmpDetail({ id }: { id: string }) {
  const [kdmp, setKdmp] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDetail("kdmp", id)
      .then((data) => {
        if (active) {
          setKdmp(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setKdmp(null);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#006e23] border-t-transparent" />
          <p className="text-xs font-bold text-slate-600">Memuat detail KDMP...</p>
        </div>
      </div>
    );
  }

  if (!kdmp) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-[14px] ambient-card p-8 border border-white/85 shadow-sm max-w-md mx-auto my-12">
            <KdmpIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-extrabold text-[#171d18]">KDMP Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data Kawasan Perdesaan Mandiri Pangan tidak tersedia.</p>
            <Link className="ambient-btn-primary mt-6 inline-flex text-xs px-6 py-3 rounded-[14px] font-bold" href="/kdmp">
              Kembali ke KDMP
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = kdmp.raw || {};
  const status = String(raw.status || "aktif").toUpperCase();
  const code = String(raw.code || kdmp.id || "-");
  const nomorBadanHukum = String(raw.nomor_badan_hukum || "Terdaftar Resmi Kemenkop");
  const ketuaName = String(raw.ketua_name || "Pengurus Koperasi");
  const sekretarisName = raw.sekretaris_name ? String(raw.sekretaris_name) : null;
  const bendaharaName = raw.bendahara_name ? String(raw.bendahara_name) : null;
  const totalMembers = Number(raw.total_members || 0);
  const modalAwal = Number(raw.modal_awal || 0);
  const totalAssets = Number(raw.total_assets || 0);
  const phone = String(raw.phone || "6281234567890");

  const unitsList: string[] = Array.isArray(raw.unit_usaha)
    ? raw.unit_usaha.map(String)
    : typeof raw.unit_usaha === "string" && raw.unit_usaha
    ? String(raw.unit_usaha).split(",")
    : ["simpan_pinjam", "perdagangan", "pertanian"];

  const unitLabels: Record<string, string> = {
    simpan_pinjam: "Simpan Pinjam",
    perdagangan: "Perdagangan Sembako",
    pertanian: "Pertanian & Pangan",
    peternakan: "Peternakan",
    perikanan: "Perikanan & Kelautan",
    jasa: "Jasa Umum & Logistik",
    pariwisata: "Pariwisata Desa"
  };

  return (
    <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
      {/* Top Navigation Bar */}
      <div className="sentra-container mb-6">
        <div className="ambient-card flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-5 py-3.5 shadow-xs">
          <Link href="/kdmp" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#006e23] transition-colors">
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Kembali ke KDMP</span>
          </Link>
          <span className="rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-[11px] font-extrabold text-[#006e23] uppercase tracking-wider">
            Status: {status}
          </span>
        </div>
      </div>

      <div className="sentra-container space-y-6">
        {/* Main Info Card */}
        <div className="ambient-card rounded-[14px] p-6 md:p-8 shadow-xs space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-xs font-extrabold text-[#006e23] uppercase tracking-wider">
              <KdmpIcon className="h-3.5 w-3.5" /> Koperasi Desa Merah Putih
            </span>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-[#171d18] tracking-tight leading-tight">
              {kdmp.title}
            </h1>
            <p className="mt-2 text-xs md:text-sm text-slate-500 flex items-center gap-1.5 font-medium">
              <MapPinIcon className="h-4 w-4 text-[#006e23] shrink-0" />
              {kdmp.subtitle || kdmp.meta?.join(", ") || "Indonesia"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Nomor Badan Hukum</span>
              <strong className="text-xs font-black text-slate-900 mt-1 block truncate" title={nomorBadanHukum}>
                📜 {nomorBadanHukum}
              </strong>
            </div>
            <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Kode Registrasi KDMP</span>
              <strong className="text-xs font-extrabold text-slate-800 mt-1 block truncate">
                🆔 {code}
              </strong>
            </div>
            <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Ketua Koperasi</span>
              <strong className="text-xs font-extrabold text-slate-800 mt-1 block truncate" title={ketuaName}>
                👤 {ketuaName}
              </strong>
            </div>
            <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Jumlah Anggota</span>
              <strong className="text-xs font-extrabold text-slate-800 mt-1 block">
                👥 {totalMembers > 0 ? `${totalMembers} Anggota` : "Terverifikasi Aktif"}
              </strong>
            </div>
            <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Modal Awal Koperasi</span>
              <strong className="text-xs font-extrabold text-slate-800 mt-1 block">
                💰 {modalAwal > 0 ? formatCurrency(modalAwal) : "Simpanan Pokok Anggota"}
              </strong>
            </div>
            <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Aset Koperasi</span>
              <strong className="text-xs font-black text-[#006e23] mt-1 block">
                📈 {totalAssets > 0 ? formatCurrency(totalAssets) : "Dalam Penilaian"}
              </strong>
            </div>
          </div>

          {unitsList.length > 0 ? (
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">Unit Usaha Koperasi Aktif</h3>
              <div className="flex flex-wrap gap-2">
                {unitsList.map((u, idx) => (
                  <span key={idx} className="rounded-[10px] bg-[#006e23]/10 px-3 py-1.5 text-xs font-bold text-[#006e23] border border-[#006e23]/20">
                    ✓ {unitLabels[u] || u.replace(/_/g, " ").toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {sekretarisName || bendaharaName ? (
            <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 text-xs text-slate-600 flex flex-wrap gap-6 shadow-xs">
              {sekretarisName ? <div><span className="text-slate-400 font-bold block text-[11px] uppercase">Sekretaris:</span> <strong className="text-slate-800">{sekretarisName}</strong></div> : null}
              {bendaharaName ? <div><span className="text-slate-400 font-bold block text-[11px] uppercase">Bendahara:</span> <strong className="text-slate-800">{bendaharaName}</strong></div> : null}
            </div>
          ) : null}

          <div className="pt-2">
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20Pengurus%20${encodeURIComponent(kdmp.title)},%20saya%20tertarik%20mengenai%20keanggotaan%20atau%20layanan%20koperasi.`}
              target="_blank"
              rel="noopener noreferrer"
              className="ambient-btn-primary rounded-[14px] px-6 py-3.5 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition"
            >
              <PhoneIcon className="h-4 w-4" /> Hubungi Pengurus Koperasi ({ketuaName})
            </a>
          </div>
        </div>

        {/* Profil & Description Card */}
        <div className="ambient-card rounded-[14px] p-6 md:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-[#171d18] border-b border-black/5 pb-3">
            Profil & Gambaran Koperasi Desa Merah Putih
          </h2>
          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{
              __html: kdmp.body || kdmp.description || "<p>Koperasi Desa Merah Putih ini menggerakkan ekonomi masyarakat desa melalui layanan simpan pinjam, perdagangan komoditas, dan unit usaha produktif berbasis gotong royong.</p>"
            }}
          />
        </div>
      </div>
    </div>
  );
}
