import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';

const App = () => {
  const [view, setView] = useState('landing');
  const [birthdate, setBirthdate] = useState('');
  const [dateError, setDateError] = useState('');
  const [weeks, setWeeks] = useState({ lived: 0, total: 4000 });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      title: '4000 Weeks',
      intro: 'Based on Oliver Burkeman\'s book "Four Thousand Weeks", this visualization shows you how precious and finite your time is.',
      birthDateLabel: 'When were you born?',
      visualizeButton: 'Visualize My Time',
      dateError: 'Please select a date in the past',
      yourLifeInWeeks: 'Your Life in Weeks',
      born: 'Born',
      weeksLived: 'Weeks lived',
      weeksRemaining: 'Weeks remaining',
      shareThisView: 'Share this view',
      copy: 'Copy',
      back: '← Back',
      clickToExpand: '(click to expand)',
      clickToCollapse: '(click to collapse)',
      past: 'Past',
      currentWeek: 'Current Week',
      future: 'Future'
    },
    de: {
      title: '4000 Wochen',
      intro: 'Basierend auf Oliver Burkemans Buch "Four Thousand Weeks" zeigt diese Visualisierung, wie kostbar und endlich deine Zeit ist.',
      birthDateLabel: 'Wann wurdest du geboren?',
      visualizeButton: 'Zeit visualisieren',
      dateError: 'Bitte wähle ein Datum in der Vergangenheit',
      yourLifeInWeeks: 'Dein Leben in Wochen',
      born: 'Geboren',
      weeksLived: 'Gelebte Wochen',
      weeksRemaining: 'Verbleibende Wochen',
      shareThisView: 'Diese Ansicht teilen',
      copy: 'Kopieren',
      back: '← Zurück',
      clickToExpand: '(zum Aufklappen klicken)',
      clickToCollapse: '(zum Zuklappen klicken)',
      past: 'Vergangenheit',
      currentWeek: 'Aktuelle Woche',
      future: 'Zukunft'
    }
  };

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Check URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedDate = params.get('date');
    const urlLang = params.get('lang');
    
    if (urlLang && ['en', 'de'].includes(urlLang)) {
      setLanguage(urlLang);
    }
    
    if (encodedDate) {
      const decodedDate = decodeDate(encodedDate);
      if (decodedDate) {
        validateAndSetDate(decodedDate);
        const livedWeeks = calculateWeeks(decodedDate);
        setWeeks({ lived: livedWeeks, total: 4000 });
        setView('visualization');
      }
    }
  }, []);

  const calculateWeeks = (date) => {
    const birth = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - birth);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  };

  const calculateGridDimensions = () => {
    const baseMargin = Math.min(dimensions.width, dimensions.height) * 0.05;
    const headerHeight = isPanelOpen ? 110 : 60;
    const legendHeight = 40;
    
    const availableHeight = dimensions.height - headerHeight - legendHeight - (baseMargin * 4);
    const availableWidth = dimensions.width - (baseMargin * 4);
    
    const ratio = availableWidth / availableHeight;
    const cols = Math.ceil(Math.sqrt(4000 * ratio));
    const rows = Math.ceil(4000 / cols);
    
    const cellSize = Math.min(
      availableWidth / cols,
      availableHeight / rows
    ) * 0.85;
    
    return { cols, cellSize };
  };

  const encodeDate = (date) => {
    return btoa(date);
  };

  const decodeDate = (encoded) => {
    try {
      return atob(encoded);
    } catch {
      return null;
    }
  };

  const validateAndSetDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setDateError(translations[language].dateError);
      setBirthdate('');
      window.history.pushState({}, '', window.location.pathname);
    } else {
      setDateError('');
      setBirthdate(date);
    }
  };

  const updateURL = (date = null) => {
    const params = new URLSearchParams();
    if (date) {
      params.set('date', encodeDate(date));
    }
    params.set('lang', language);
    window.history.pushState({}, '', date ? `?${params.toString()}` : window.location.pathname);
  };

  const handleVisualize = () => {
    if (birthdate && !dateError) {
      const livedWeeks = calculateWeeks(birthdate);
      setWeeks({ lived: livedWeeks, total: 4000 });
      updateURL(birthdate);
      setView('visualization');
    }
  };

  const LanguageToggle = () => (
    <div className="absolute top-4 right-4">
      <button
        onClick={() => {
          const newLang = language === 'en' ? 'de' : 'en';
          setLanguage(newLang);
          updateURL(view === 'visualization' ? birthdate : null);
        }}
        className="px-3 py-1 text-sm bg-white rounded-md shadow-sm hover:bg-gray-50 border"
      >
        {language === 'en' ? 'DE' : 'EN'}
      </button>
    </div>
  );

  if (view === 'landing') {
    const t = translations[language];
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <LanguageToggle />
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Logo size="xl" />
              <h1 className="text-4xl font-bold text-gray-900">{t.title}</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">{t.intro}</p>
            <div className="mt-8 space-y-6">
              <div>
                <label htmlFor="birthdate" className="block text-lg text-gray-700 mb-2">
                  {t.birthDateLabel}
                </label>
                <input
                  type="date"
                  id="birthdate"
                  value={birthdate}
                  onChange={(e) => validateAndSetDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="block w-full max-w-xs mx-auto px-4 py-2 border border-gray-300 rounded-md"
                />
                {dateError && (
                  <p className="text-red-500 text-sm mt-1">{t.dateError}</p>
                )}
              </div>
              <button
                onClick={handleVisualize}
                className="block w-full max-w-xs mx-auto bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!birthdate || dateError}
              >
                {t.visualizeButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { cols, cellSize } = calculateGridDimensions();
  const t = translations[language];

  return (
    <div className="h-screen bg-gray-100 flex flex-col p-4 sm:p-6 lg:p-8">
      <LanguageToggle />
      <div className="flex-1 flex flex-col space-y-3 min-h-0">
        <div className="bg-white rounded-lg shadow-lg">
          <div
            className="p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-gray-50"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
          >
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-900">{t.yourLifeInWeeks}</h2>
                <span className="ml-2 text-gray-500 text-sm">
                  {isPanelOpen ? t.clickToCollapse : t.clickToExpand}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setView('landing');
                window.history.pushState({}, '', window.location.pathname);
              }}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 self-start sm:self-auto"
            >
              {t.back}
            </button>
          </div>
          {isPanelOpen && (
            <div className="px-3 pb-3">
              <p className="text-gray-600 mb-3">
                {t.born}: {new Date(birthdate).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
                <br />
                {t.weeksLived}: {weeks.lived}
                <br />
                {t.weeksRemaining}: {weeks.total - weeks.lived}
              </p>
              <div className="text-sm text-gray-500">
                {t.shareThisView}:
                <div className="flex mt-1">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="flex-1 p-1 text-xs border rounded-l bg-gray-50"
                    onClick={(e) => e.target.select()}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 border border-l-0 rounded-r hover:bg-gray-200"
                  >
                    {t.copy}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-lg shadow-lg flex-1 flex items-center justify-center">
            <div
              className="grid gap-px"
              style={{ 
                gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                transform: 'scale(0.98)',
                transformOrigin: 'center'
              }}
            >
              {Array.from({ length: 4000 }, (_, i) => (
                <div
                  key={i}
                  className={`rounded-full ${
                    i < weeks.lived 
                      ? 'bg-blue-500' 
                      : i === weeks.lived 
                        ? 'bg-yellow-500' 
                        : 'bg-gray-200'
                  }`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-center space-x-6 mt-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
              <span className="text-sm text-gray-600">{t.past}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
              <span className="text-sm text-gray-600">{t.currentWeek}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-200 mr-2" />
              <span className="text-sm text-gray-600">{t.future}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;