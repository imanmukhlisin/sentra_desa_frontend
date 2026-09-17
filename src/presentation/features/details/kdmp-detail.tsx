"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { formatCurrency } from "@/shared/utils/format";
import { KdmpIcon, MapPinIcon } from "@/presentation/components/icons";

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
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-800 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat detail KDMP...</p>
        </div>
      </div>
    );
  }

  if (!kdmp) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <KdmpIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">KDMP Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data Kawasan Perdesaan Mandiri Pangan tidak tersedia.</p>
            <Link className="sentra-button-primary mt-6 inline-flex text-xs px-5 py-2.5" href="/kdmp">
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
    <div className="min-h-screen bg-slate-50 pt-[90px] pb-16">
      <div className="sticky top-[70px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="sentra-container px-4 py-3 flex items-center justify-between">
          <Link href="/kdmp" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-red-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke KDMP
          </Link>
          <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-[11px] font-extrabold text-red-900 uppercase">
            Status: {status}
          </span>
        </div>
      </div>

      <div className="sentra-container px-4 mt-6 space-y-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-900 uppercase">
              <KdmpIcon className="h-3.5 w-3.5" /> Koperasi Desa Merah Putih
            </span>
            <h1 className="mt-3 text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {kdmp.title}
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-500 flex items-center gap-1">
              <MapPinIcon className="h-4 w-4 text-red-700" />
              {kdmp.subtitle || kdmp.meta?.join(", ") || "Indonesia"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            <div className="rounded-xl border border-slate-200 bg-red-50/40 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Nomor Badan Hukum</span>
              <strong className="text-xs font-black text-slate-900 mt-1 block truncate" title={nomorBadanHukum}>
                📜 {nomorBadanHukum}
              </strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Kode Registrasi KDMP</span>
              <strong className="text-xs font-extrabold text-slate-800 mt-1 block truncate">
                🆔 {code}
              </strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Ketua Koperasi</span>
              <strong className="text-xs font-extrabold text-slate-800 mt-1 block truncate" title={ketuaName}>
                👤 {ketuaName}
              </strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Jumlah Anggota</span>
              <strong className="text-xs font-extrabold text-slate-800 mt-1 block">
                👥 {totalMembers > 0 ? `${totalMembers} Anggota` : "Terverifikasi Aktif"}
              </strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Modal Awal Koperasi</span>
              <strong className="text-xs font-extrabold text-slate-800 mt-1 block">
                💰 {modalAwal > 0 ? formatCurrency(modalAwal) : "Simpanan Pokok Anggota"}
              </strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-emerald-50/50 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Aset Koperasi</span>
              <strong className="text-xs font-black text-emerald-800 mt-1 block">
                📈 {totalAssets > 0 ? formatCurrency(totalAssets) : "Dalam Penilaian"}
              </strong>
            </div>
          </div>

          {unitsList.length > 0 ? (
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Unit Usaha Koperasi Aktif</h3>
              <div className="flex flex-wrap gap-2">
                {unitsList.map((u, idx) => (
                  <span key={idx} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-900 border border-red-200">
                    ✓ {unitLabels[u] || u.replace(/_/g, " ").toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {sekretarisName || bendaharaName ? (
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-600 flex flex-wrap gap-4">
              {sekretarisName ? <div><span className="text-slate-400 font-bold block">Sekretaris:</span> <strong>{sekretarisName}</strong></div> : null}
              {bendaharaName ? <div><span className="text-slate-400 font-bold block">Bendahara:</span> <strong>{bendaharaName}</strong></div> : null}
            </div>
          ) : null}

          <div className="pt-2">
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20Pengurus%20${encodeURIComponent(kdmp.title)},%20saya%20tertarik%20mengenai%20keanggotaan%20atau%20layanan%20koperasi.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-800 px-5 py-3 text-xs font-extrabold text-white shadow-md hover:bg-red-900 transition"
            >
              📞 Hubungi Pengurus Koperasi ({ketuaName})
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
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
