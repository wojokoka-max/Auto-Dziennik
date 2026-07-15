'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDb } from '@/lib/db';
import { VEHICLE_TYPES, Vehicle } from '@/lib/types';
import VehicleForm from '@/components/VehicleForm';
import SearchPanel from '@/components/SearchPanel';
import { healthAlerts } from '@/lib/calc';
import { fmtKm } from '@/lib/util';

const TYPE_ICON: Record<string, string> = {
  osobowy: '🚗',
  motocykl: '🏍️',
  dostawczy: '🚚',
  kamper: '🚐',
  przyczepa: '🛞',
  klasyk: '🏁',
};

export default function GaragePage() {
  const db = useDb();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!db.ready) {
    return (
      <main className="wrap">
        <p className="hint">Wczytywanie garażu…</p>
      </main>
    );
  }

  const active = db.data.vehicles.filter((v) => !v.archiwalny);
  const archived = db.data.vehicles.filter((v) => v.archiwalny);

  const onImport = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    let msg = '';
    try {
      const peek = JSON.parse(text);
      if (peek && Array.isArray(peek.vehicles) && peek.paczka !== 'autodziennik-pojazd') {
        if (
          !confirm(
            'To pełna kopia zapasowa — zastąpi WSZYSTKIE obecne dane w tej przeglądarce. Kontynuować?'
          )
        )
          return;
      }
      msg = db.importJson(text);
    } catch {
      msg = 'To nie jest poprawny plik JSON.';
    }
    alert(msg);
  };

  const card = (v: Vehicle) => {
    const alerts = healthAlerts(db.data, v);
    const bad = alerts.filter((a) => a.tone === 'bad').length;
    const warn = alerts.filter((a) => a.tone === 'warn').length;
    return (
      <a className="veh-card" key={v.id} href={`/auto/${v.id}`}>
        <div className="veh-photo">
          {v.zdjecie ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={v.zdjecie} alt={`${v.marka} ${v.model}`} />
          ) : (
            <span aria-hidden="true">{TYPE_ICON[v.typ] || '🚗'}</span>
          )}
        </div>
        <div className="veh-body">
          <div className="veh-name">
            {v.marka} {v.model} {v.wersja ? <span className="r-muted">{v.wersja}</span> : null}
          </div>
          <div className="veh-sub">
            {v.rejestracja && <span>{v.rejestracja}</span>}
            {v.rok && <span>{v.rok}</span>}
            {v.przebieg != null && <span>{fmtKm(v.przebieg)}</span>}
          </div>
          <div className="veh-flags">
            {v.archiwalny && <span className="chip chip-info">Archiwum</span>}
            {bad > 0 && <span className="chip chip-bad">{bad} zaległe</span>}
            {bad === 0 && warn > 0 && <span className="chip chip-warn">{warn} wkrótce</span>}
            {bad === 0 && warn === 0 && <span className="chip chip-ok">W porządku</span>}
          </div>
        </div>
      </a>
    );
  };

  return (
    <main className="wrap">
      <header className="topbar">
        <a className="logo" href="/">
          <span className="logo-mark">KM</span>
          <span className="logo-name">
            Auto<em>Dziennik</em>
          </span>
        </a>
        <div className="topbar-actions">
          <button className="btn btn-ghost" onClick={() => setShowSearch((s) => !s)}>
            Szukaj
          </button>
          <button className="btn btn-ghost" onClick={() => db.exportAll()}>
            Kopia zapasowa
          </button>
          <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
            Import
          </button>
          <input
            ref={fileRef}
            className="import-input"
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              onImport(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <button className="btn btn-amber" onClick={() => setAdding(true)}>
            + Dodaj pojazd
          </button>
        </div>
      </header>

      <p className="tagline">
        Kompletna historia samochodu: naprawy, terminy, koszty, tankowania i dokumenty. Dane
        zostają w Twojej przeglądarce — bez konta, bez reklam.
      </p>

      {showSearch && (
        <SearchPanel
          onOpen={(r) => router.push(`/auto/${r.vehicleId}?tab=${r.tab}&hit=${r.id}`)}
        />
      )}

      {adding && (
        <VehicleForm
          onSave={(v) => {
            const created = db.addVehicle(v as any);
            setAdding(false);
            router.push(`/auto/${created.id}`);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      {active.length === 0 && !adding && (
        <section className="panel">
          <h2 className="panel-title">Garaż jest pusty</h2>
          <p className="hint" style={{ marginTop: 10 }}>
            Dodaj pierwszy pojazd — {VEHICLE_TYPES.map((t) => t.label.toLowerCase()).join(', ')}.
            Każdy dostanie własną kartę i całkowicie oddzielną historię.
          </p>
          <button className="btn btn-amber" onClick={() => setAdding(true)}>
            + Dodaj pierwszy pojazd
          </button>
        </section>
      )}

      <div className="garage-grid">{active.map(card)}</div>

      {archived.length > 0 && (
        <>
          <h2 className="panel-subtitle">Archiwum (sprzedane / nieużywane)</h2>
          <div className="garage-grid">{archived.map(card)}</div>
        </>
      )}

      <p className="footer-note">
        AutoDziennik działa lokalnie ({db.storageKB()} KB zapisane w tej przeglądarce). Rób
        regularnie kopię zapasową — plik JSON można też wczytać na innym urządzeniu. Sprzedajesz
        auto? Wejdź w pojazd i wygeneruj pakiet przekazania dla nowego właściciela.
      </p>
    </main>
  );
}
