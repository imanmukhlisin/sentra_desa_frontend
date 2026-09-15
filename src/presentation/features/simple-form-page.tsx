"use client";

import { FormEvent, useState } from "react";

type Field = { name: string; label: string; type?: string };

export function SimpleFormPage({ title, description, fields }: { title: string; description: string; fields: Field[] }) {
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Form siap disambungkan ke endpoint Laravel API.");
  }

  return (
    <>
      <section className="page-title">
        <div className="sentra-container pt-[112px]">
          <div className="rounded-flutter bg-white p-5 shadow-flutter">
            <span className="text-[10px] font-black uppercase tracking-[1px] text-sentra-emerald">Sentra Desa</span>
            <h1 className="mt-1 text-2xl font-black text-slate-800">{title}</h1>
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          </div>
        </div>
      </section>
      <form className="form-panel form-stack" onSubmit={submit}>
        {fields.map((field) => (
          <label className="form-stack" key={field.name}>
            <span>{field.label}</span>
            <input className="field" name={field.name} type={field.type ?? "text"} required />
          </label>
        ))}
        <button className="sentra-button-primary" type="submit">
          Kirim
        </button>
        {message ? <p className="muted">{message}</p> : null}
      </form>
    </>
  );
}
