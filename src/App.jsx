import React, { useEffect, useMemo, useState } from 'react';
import LogoMark from './components/LogoMark.jsx';

const TOTAL_WEEKS = 4000;
const GRID_MAX_WIDTH = 680;
const GRID_MIN_WIDTH = 200;
const GRID_MIN_HEIGHT = 400;
const GRID_MAX_HEIGHT = 680;
const GRID_HEIGHT_VIEWPORT_RATIO = 0.6;
const GRID_WIDTH_VIEWPORT_RATIO = 0.52;
const GRID_MIN_CELL_SIZE = 3;

const translations = {
  en: {
    title: '4000 Weeks',
    introHeading: 'Time is your most non‑renewable resource.',
    introBody:
      'Inspired by Oliver Burkeman\'s book, this mini-app lets you visualise every week of a typical human lifespan. Enter your birth date to see the weeks you\'ve already lived and the ones still ahead.',
    birthDateLabel: 'When were you born?',
    visualizeButton: 'Show my life in weeks',
    helper: 'You can always come back and adjust this later.',
    dateError: 'Please select a date in the past.',
    yourLifeInWeeks: 'Your life in weeks',
    born: 'Born',
    weeksLived: 'Weeks lived',
    weeksRemaining: 'Weeks remaining',
    shareThisView: 'Share this view',
    copy: 'Copy link',
    copied: 'Copied!',
    back: 'Back to introduction',
    clickToExpand: 'Open timeline details',
    clickToCollapse: 'Hide timeline details',
    past: 'Past weeks',
    currentWeek: 'Current week',
    future: 'Future weeks',
    languageToggle: 'DE',
    features: [
      'Beautifully branded to match the app icon.',
      'Responsive grid that adapts to any screen size.',
      'Shareable link with your language preference.',
    ],
  },
  de: {
    title: '4000 Wochen',
    introHeading: 'Zeit ist deine knappste Ressource.',
    introBody:
      'Dieses kleine Tool, inspiriert von Oliver Burkemans Buch, visualisiert jede Woche einer typischen Lebensspanne. Gib dein Geburtsdatum ein und sieh die Wochen, die du schon gelebt hast – und die, die noch kommen.',
    birthDateLabel: 'Wann wurdest du geboren?',
    visualizeButton: 'Zeige mein Leben in Wochen',
    helper: 'Du kannst das später jederzeit ändern.',
    dateError: 'Bitte wähle ein Datum in der Vergangenheit.',
    yourLifeInWeeks: 'Dein Leben in Wochen',
    born: 'Geboren',
    weeksLived: 'Gelebte Wochen',
    weeksRemaining: 'Verbleibende Wochen',
    shareThisView: 'Diese Ansicht teilen',
    copy: 'Link kopieren',
    copied: 'Kopiert!',
    back: 'Zur Einführung zurück',
    clickToExpand: 'Zeitleisten-Details anzeigen',
    clickToCollapse: 'Zeitleisten-Details verbergen',
    past: 'Vergangene Wochen',
    currentWeek: 'Aktuelle Woche',
    future: 'Zukünftige Wochen',
    languageToggle: 'EN',
    features: [
      'Markenauftritt passend zum App-Icon.',
      'Responsive Raster für jede Bildschirmgröße.',
      'Teilbarer Link mit deiner Spracheinstellung.',
    ],
  },
};

const encodeDate = (date) => (typeof window === 'undefined' ? date : window.btoa(date));

const decodeDate = (encoded) => {
  if (typeof window === 'undefined') return encoded;
  try {
    return window.atob(encoded);
  } catch (error) {
    console.error('Unable to decode date from URL', error);
    return null;
  }
};

const formatDate = (dateString, language) => {
  if (!dateString) return '--';
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const useResizeObserver = () => {
  const [node, setNode] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!node || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [node]);

  return [setNode, size];
};

const LanguageToggle = ({ language, onToggle, tone = 'light', className = '' }) => {
  const isDark = tone === 'dark';
  const baseClasses =
    'inline-flex items-center justify-center rounded-full border text-xs font-semibold tracking-wide transition focus:outline-none focus:ring-2 focus:ring-offset-2';

  const palette = isDark
    ? 'border-slate-700/70 bg-slate-900/80 text-amber-200 hover:bg-slate-800/80 focus:ring-amber-300/50 focus:ring-offset-slate-900'
    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-amber-200 focus:ring-offset-slate-100';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${baseClasses} ${palette} px-4 py-2 shadow-sm ${className}`}
    >
      {language === 'en' ? 'DE' : 'EN'}
    </button>
  );
};

const FeatureList = ({ items }) => (
  <ul className="space-y-3 text-sm text-slate-200/90">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_0_4px_rgba(250,204,21,0.12)]" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const LandingView = ({
  t,
  language,
  onToggleLanguage,
  birthdate,
  dateError,
  onDateChange,
  onSubmit,
}) => (
  <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="absolute bottom-12 left-12 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="absolute top-1/4 right-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
    </div>

    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 rounded-full bg-slate-900/70 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-200/70">
          <LogoMark size={28} className="drop-shadow-[0_10px_25px_rgba(8,47,73,0.45)]" />
          <span>{t.title}</span>
        </div>
        <LanguageToggle language={language} onToggle={onToggleLanguage} tone="dark" />
      </div>

      <div className="mt-12 grid items-center gap-12 rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {t.introHeading}
            </h1>
            <p className="text-base leading-relaxed text-slate-200/90 sm:text-lg">
              {t.introBody}
            </p>
          </div>
          <FeatureList items={t.features} />
        </div>

        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_35px_120px_-45px_rgba(15,118,110,0.35)] sm:p-8">
          <div className="flex flex-col items-center gap-5 text-center">
            <LogoMark size={120} className="drop-shadow-[0_25px_60px_rgba(30,64,175,0.35)]" />
            <p className="text-sm text-slate-300/80">
              {t.helper}
            </p>
          </div>
          <label htmlFor="birthdate" className="text-sm font-medium text-slate-100">
            {t.birthDateLabel}
          </label>
          <input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(event) => onDateChange(event.target.value)}
            max={typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : undefined}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-base text-slate-100 shadow-inner transition focus:border-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
          />
          {dateError && <p className="text-sm text-rose-300">{t.dateError}</p>}
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 px-5 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-amber-500/40 transition hover:from-amber-200 hover:via-amber-100 hover:to-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!birthdate || Boolean(dateError)}
          >
            {t.visualizeButton}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const VisualizationView = ({
  t,
  language,
  onToggleLanguage,
  weeks,
  birthdate,
  onBack,
  dimensions,
}) => {
  const [gridContainerRef, gridContainerSize] = useResizeObserver();

  const { cols, cellSize, gap, gridHeight, heightLimit } = useMemo(() => {
    const fallbackWidth = Math.min(
      Math.max(dimensions.width * GRID_WIDTH_VIEWPORT_RATIO, GRID_MIN_WIDTH),
      GRID_MAX_WIDTH,
    );
    const width = Math.min(Math.max(gridContainerSize.width || fallbackWidth, GRID_MIN_WIDTH), GRID_MAX_WIDTH);
    const heightLimit = Math.min(
      Math.max(dimensions.height * GRID_HEIGHT_VIEWPORT_RATIO, GRID_MIN_HEIGHT),
      GRID_MAX_HEIGHT,
    );

    const gapSize = width >= 1280 ? 6 : width >= 1024 ? 5 : width >= 768 ? 4 : width >= 640 ? 4 : 3;
    const maxColumns = Math.min(
      TOTAL_WEEKS,
      Math.max(1, Math.floor((width + gapSize) / (GRID_MIN_CELL_SIZE + gapSize))),
    );

    let bestCandidate = null;

    const considerCandidate = (candidate) => {
      if (!candidate) return;
      if (!bestCandidate) {
        bestCandidate = candidate;
        return;
      }

      if (candidate.cellSize > bestCandidate.cellSize) {
        bestCandidate = candidate;
        return;
      }

      if (candidate.cellSize === bestCandidate.cellSize && candidate.fillRatio > bestCandidate.fillRatio) {
        bestCandidate = candidate;
      }
    };

    for (let columns = maxColumns; columns >= 1; columns -= 1) {
      const rawCellSize = Math.floor((width - gapSize * (columns - 1)) / columns);
      if (rawCellSize < GRID_MIN_CELL_SIZE) {
        continue;
      }

      const rows = Math.ceil(TOTAL_WEEKS / columns);
      const requiredHeight = rows * rawCellSize + (rows - 1) * gapSize;

      if (requiredHeight <= heightLimit) {
        considerCandidate({
          cols: columns,
          cellSize: rawCellSize,
          gap: gapSize,
          rows,
          fillRatio: heightLimit ? requiredHeight / heightLimit : 1,
        });
        continue;
      }

      const adjustedCellSize = Math.floor((heightLimit - (rows - 1) * gapSize) / rows);
      if (adjustedCellSize < GRID_MIN_CELL_SIZE) {
        continue;
      }
      const constrainedHeight = rows * adjustedCellSize + (rows - 1) * gapSize;

      considerCandidate({
        cols: columns,
        cellSize: adjustedCellSize,
        gap: gapSize,
        rows,
        fillRatio: heightLimit ? constrainedHeight / heightLimit : 1,
      });
    }

    if (!bestCandidate) {
      const fallbackCols = Math.min(TOTAL_WEEKS, Math.ceil(Math.sqrt(TOTAL_WEEKS)));
      const fallbackRows = Math.ceil(TOTAL_WEEKS / fallbackCols);
      bestCandidate = {
        cols: fallbackCols,
        cellSize: GRID_MIN_CELL_SIZE,
        gap: gapSize,
        rows: fallbackRows,
        fillRatio: 0,
      };
    }

    const resolvedCellSize = Math.max(bestCandidate.cellSize, GRID_MIN_CELL_SIZE);
    const resolvedRows = Math.max(1, bestCandidate.rows || Math.ceil(TOTAL_WEEKS / bestCandidate.cols));
    const gridHeight = resolvedRows * resolvedCellSize + Math.max(0, resolvedRows - 1) * bestCandidate.gap;

    return {
      cols: bestCandidate.cols,
      cellSize: resolvedCellSize,
      gap: bestCandidate.gap,
      gridHeight,
      heightLimit,
    };
  }, [
    dimensions.height,
    dimensions.width,
    gridContainerSize.width,
  ]);

  const shareLink = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    const params = new URLSearchParams();
    params.set('lang', language);
    if (birthdate) {
      params.set('date', encodeDate(birthdate));
    }
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [birthdate, language]);

  const [copyState, setCopyState] = useState('idle');

  const handleCopyShareLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (error) {
      console.error('Unable to copy share link', error);
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  };

  const clampedGridHeight = Math.min(gridHeight, heightLimit);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-[1px] shadow-xl">
          <div className="flex flex-col gap-6 rounded-[calc(24px-1px)] bg-white p-6 shadow-inner lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">
                <LogoMark size={60} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{t.title}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                  {t.yourLifeInWeeks}
                </h2>
                <p className="mt-3 max-w-lg text-sm text-slate-500">
                  {t.introBody}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <LanguageToggle language={language} onToggle={onToggleLanguage} className="sm:order-2" />
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                ← {t.back}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-400">{t.born}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 break-words">{formatDate(birthdate, language)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-400">{t.weeksLived}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{weeks.lived}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-400">{t.weeksRemaining}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{Math.max(TOTAL_WEEKS - weeks.lived, 0)}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{t.shareThisView}</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  onFocus={(event) => event.target.select()}
                />
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                >
                  {copyState === 'copied' ? t.copied : t.copy}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-8">
            <div
              ref={gridContainerRef}
              className="relative w-full max-w-[680px]"
              style={{
                height: `${clampedGridHeight}px`,
                maxHeight: `${heightLimit}px`,
              }}
            >
              <div className="flex h-full w-full items-start justify-center px-1 lg:justify-end">
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                    gridAutoRows: `${cellSize}px`,
                    gap: `${gap}px`,
                  }}
                >
                  {Array.from({ length: TOTAL_WEEKS }).map((_, index) => {
                    const state =
                      index < weeks.lived
                        ? 'past'
                        : index === weeks.lived
                          ? 'present'
                            : 'future';

                    const palette =
                      state === 'past'
                        ? 'bg-slate-900'
                      : state === 'present'
                        ? 'bg-amber-400'
                        : 'bg-slate-200';

                    return (
                      <span
                        key={index}
                        className={`block h-full w-full rounded-full transition-colors duration-300 ${palette}`}
                        style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 rounded-full border border-slate-200 bg-white/95 px-6 py-3 text-xs text-slate-600 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-900" />
                {t.past}
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" />
                {t.currentWeek}
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-200" />
                {t.future}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState('landing');
  const [birthdate, setBirthdate] = useState('');
  const [dateError, setDateError] = useState('');
  const [weeks, setWeeks] = useState({ lived: 0, total: TOTAL_WEEKS });
  const [language, setLanguage] = useState('en');
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window === 'undefined' ? 1280 : window.innerWidth,
    height: typeof window === 'undefined' ? 800 : window.innerHeight,
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const params = new URLSearchParams(window.location.search);
    const encodedDate = params.get('date');
    const paramLanguage = params.get('lang');

    if (paramLanguage && ['en', 'de'].includes(paramLanguage)) {
      setLanguage(paramLanguage);
    }

    if (encodedDate) {
      const decoded = decodeDate(encodedDate);
      if (decoded) {
        const livedWeeks = calculateWeeks(decoded);
        setBirthdate(decoded);
        setWeeks({ lived: livedWeeks, total: TOTAL_WEEKS });
        setView('visualization');
      }
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const params = new URLSearchParams();
    params.set('lang', language);
    if (view === 'visualization' && birthdate) {
      params.set('date', encodeDate(birthdate));
    }
    const url = params.toString();
    const next = url ? `?${url}` : window.location.pathname;
    window.history.replaceState({}, '', next);

    return undefined;
  }, [language, birthdate, view]);

  const calculateWeeks = (date) => {
    const birth = new Date(date);
    const now = new Date();
    const difference = Math.max(now - birth, 0);
    return Math.min(Math.floor(difference / (1000 * 60 * 60 * 24 * 7)), TOTAL_WEEKS);
  };

  const validateAndSetDate = (value) => {
    if (!value) {
      setBirthdate('');
      setDateError('');
      return;
    }

    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected > today) {
      setDateError(translations[language].dateError);
      setBirthdate('');
      return;
    }

    setDateError('');
    setBirthdate(value);
  };

  const handleVisualize = () => {
    if (!birthdate || dateError) return;
    const livedWeeks = calculateWeeks(birthdate);
    setWeeks({ lived: livedWeeks, total: TOTAL_WEEKS });
    setView('visualization');
  };

  const toggleLanguage = () => {
    setLanguage((current) => (current === 'en' ? 'de' : 'en'));
  };

  const t = translations[language];

  if (view === 'landing') {
    return (
      <LandingView
        t={t}
        language={language}
        onToggleLanguage={toggleLanguage}
        birthdate={birthdate}
        dateError={dateError}
        onDateChange={validateAndSetDate}
        onSubmit={handleVisualize}
      />
    );
  }

  return (
    <VisualizationView
      t={t}
      language={language}
      onToggleLanguage={toggleLanguage}
      weeks={weeks}
      birthdate={birthdate}
      onBack={() => setView('landing')}
      dimensions={dimensions}
    />
  );
};

export default App;
