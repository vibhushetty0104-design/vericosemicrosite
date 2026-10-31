import React, { useState, useMemo } from 'react';
import { DOCTORS_DATA, DoctorProfile, VASCULAR_CREDENTIALS_GLOSSARY, DEMO_PROFILE_LABEL } from '../data/doctorsData';
import { trackEvent } from '../utils/analytics';
import { GUIDE_LABELS, GuideIcon } from '../content/guideLabels';
import {
  Stethoscope,
  MapPin,
  Calendar,
  Video,
  Award,
  Search,
  Building2,
  Info,
  Languages,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface DoctorDirectoryProps {
  onSelectDoctor: (doctor: DoctorProfile) => void;
  onOpenAiWithPrompt?: (prompt: string) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({
  onSelectDoctor,
  onOpenAiWithPrompt
}) => {
  const [filterCity, setFilterCity] = useState<string>('All');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('All');
  const [filterModality, setFilterModality] = useState<'All' | 'In-Person OPD' | 'Video Teleconsultation'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);

  const cities = ['All', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai'];
  const specialties = ['All', 'Vascular Surgery', 'Interventional Radiology', 'Phlebology', 'Venous Wound Care'];

  const filteredDoctors = useMemo(() => {
    return DOCTORS_DATA.filter((doc) => {
      // 1. City filter
      if (filterCity !== 'All' && doc.city !== filterCity) {
        return false;
      }
      // 2. Specialty filter
      if (filterSpecialty !== 'All' && doc.specialty !== filterSpecialty) {
        return false;
      }
      // 3. Modality filter
      if (filterModality !== 'All' && !doc.modalities.includes(filterModality)) {
        return false;
      }
      // 4. Search query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(query);
        const matchesCredentials = doc.credentials.toLowerCase().includes(query);
        const matchesCity = doc.city.toLowerCase().includes(query);
        const matchesExpertise = doc.expertise.some(e => e.toLowerCase().includes(query));
        const matchesBio = doc.bio.toLowerCase().includes(query);
        const matchesLang = doc.languagesSpoken.some(l => l.toLowerCase().includes(query));
        if (!matchesName && !matchesCredentials && !matchesCity && !matchesExpertise && !matchesBio && !matchesLang) {
          return false;
        }
      }
      return true;
    });
  }, [filterCity, filterSpecialty, filterModality, searchQuery]);

  return (
    <section id="specialists" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-mv-outline/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Prominent Synthetic Demonstration Notice */}
        <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-white border border-mv-outline/70 text-mv-ink flex items-start gap-3.5 shadow-2xs">
          <Info className="w-5 h-5 text-mv-forest shrink-0 mt-0.5" />
          <div className="text-xs sm:text-[13px] leading-relaxed">
            <span className="font-semibold text-mv-forest block mb-1">
              Demo profiles · fictional · For platform evaluation only
            </span>
            <p className="text-mv-ink-muted">
              The profiles below are <strong>fictional demo records</strong> that show how vascular specialist discovery could work (qualification types, cities, spoken languages and sample INR fees). They are not real doctors. Their colleges and institutions are fictional, every fee and time is a sample, and they have no ratings, reviews, clinic addresses, availability or affiliations. Demo requests are not sent to any clinic.
            </p>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-mv-outline/60 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] font-semibold text-mv-terracotta bg-mv-terracotta/10 px-3 py-1 rounded-full">
                Vascular Specialist Directory
              </span>
              <span className="text-xs font-mono text-mv-ink-muted">
                India Healthcare Hubs
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-mv-forest tracking-tight">
              Explore Indian Vascular Specialists (Demonstration Directory)
            </h2>
            <p className="mt-3.5 text-sm sm:text-base text-mv-ink-muted max-w-2xl leading-relaxed">
              Review representative profiles of vein specialists across Bengaluru, Mumbai, Delhi NCR, Hyderabad, and Chennai to understand clinical qualifications (MCh, DNB, FVIR) and outpatient care workflows.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs font-mono text-mv-forest bg-white p-3.5 rounded-2xl border border-mv-outline/70 shadow-2xs shrink-0">
            <div>
              <span className="block font-bold text-base font-serif text-mv-forest">5 Metros</span>
              <span className="text-[11px] text-mv-ink-muted">India Coverage</span>
            </div>
            <div className="h-8 w-px bg-mv-outline/60" />
            <div>
              <span className="block font-bold text-base font-serif text-mv-forest">MCh / FVIR</span>
              <span className="text-[11px] text-mv-ink-muted">Super-Specialty</span>
            </div>
          </div>
        </div>

        {/* Multi-tier Filter Controls Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-mv-ink-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by doctor, city, procedure (EVLA, VenaSeal), or language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-mv-outline/70 rounded-full focus:outline-none focus:ring-2 focus:ring-mv-forest/20 text-mv-forest placeholder:text-mv-ink-muted/70 min-h-[44px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-mv-ink-muted hover:text-mv-forest"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Modality Filter Pills */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-mv-ink-muted">Mode:</span>
              <div className="flex items-center bg-white p-1 rounded-full border border-mv-outline/70 shadow-2xs">
                {(['All', 'In-Person OPD', 'Video Teleconsultation'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterModality(mode)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer tap-tactile min-h-[36px] ${
                      filterModality === mode
                        ? 'bg-mv-forest text-white shadow-xs'
                        : 'text-mv-ink-muted hover:text-mv-forest'
                    }`}
                  >
                    {mode === 'In-Person OPD' ? 'In-Person OPD' : mode === 'Video Teleconsultation' ? 'Teleconsult' : 'All Modes'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* City Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-mv-ink-muted mr-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-mv-terracotta" /> City:
            </span>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setFilterCity(city)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer border tap-tactile min-h-[36px] ${
                  filterCity === city
                    ? 'bg-mv-forest border-mv-forest text-white shadow-xs'
                    : 'bg-white border-mv-outline/70 text-mv-ink-muted hover:border-mv-forest/40 hover:text-mv-forest'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Subspecialty Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-mv-ink-muted mr-1 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-mv-forest" /> Subspecialty:
            </span>
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setFilterSpecialty(spec)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer border tap-tactile min-h-[36px] ${
                  filterSpecialty === spec
                    ? 'bg-mv-forest border-mv-forest text-white shadow-xs'
                    : 'bg-white border-mv-outline/70 text-mv-ink-muted hover:border-mv-forest/40 hover:text-mv-forest'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Credential Explainer Popover (when user clicks an Indian credential tag) */}
        {selectedCredential && VASCULAR_CREDENTIALS_GLOSSARY[selectedCredential] && (
          <div className="mb-8 p-5 rounded-2xl bg-white border border-mv-outline/70 text-xs flex items-start justify-between gap-4 animate-in fade-in shadow-2xs">
            <div>
              <span className="font-semibold text-mv-forest block mb-1">
                {VASCULAR_CREDENTIALS_GLOSSARY[selectedCredential].fullName} ({selectedCredential})
              </span>
              <p className="text-mv-ink-muted leading-relaxed">
                {VASCULAR_CREDENTIALS_GLOSSARY[selectedCredential].description}
              </p>
            </div>
            <button
              onClick={() => setSelectedCredential(null)}
              className="text-mv-ink-muted hover:text-mv-forest font-semibold text-xs px-2 py-1 rounded cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

        {/* Results Counter & Active Filter Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-mv-ink-muted mb-8 px-1">
          <span>
            Showing <strong className="font-semibold text-mv-forest">{filteredDoctors.length}</strong> {filteredDoctors.length === 1 ? 'specialist' : 'specialists'}
            {filterCity !== 'All' ? ` in ${filterCity}` : ' across 5 Indian metros'}
            {filterSpecialty !== 'All' ? ` · ${filterSpecialty}` : ''}
            {filterModality !== 'All' ? ` (${filterModality})` : ''}
          </span>
          {(filterCity !== 'All' || filterSpecialty !== 'All' || filterModality !== 'All' || searchQuery.trim().length > 0) && (
            <button
              onClick={() => {
                setFilterCity('All');
                setFilterSpecialty('All');
                setFilterModality('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-mv-terracotta hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-mv-outline/70 p-8 shadow-2xs">
            <Search className="w-8 h-8 text-mv-ink-muted/50 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-mv-forest">No specialists found matching your search</h3>
            <p className="text-xs text-mv-ink-muted mt-1 max-w-sm mx-auto">
              Try selecting &ldquo;All&rdquo; cities or clearing your search keywords.
            </p>
            <button
              onClick={() => {
                setFilterCity('All');
                setFilterSpecialty('All');
                setFilterModality('All');
                setSearchQuery('');
              }}
              className="mt-5 px-5 py-2.5 bg-mv-forest text-white text-xs font-semibold rounded-full min-h-[40px] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-mv-outline/70 rounded-3xl p-7 sm:p-8 shadow-2xs hover:border-mv-forest/40 transition-all flex flex-col justify-between"
              >
                <div>
                  
                  {/* Top Row: Monogram, Name, Credentials, and Demo Badge */}
                  <div className="flex items-start justify-between gap-4 pb-5 border-b border-mv-outline/60 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-mv-cream border border-mv-outline/70 flex items-center justify-center text-mv-forest font-serif font-bold text-xl shrink-0 shadow-2xs">
                        {doc.name.split(' ').map(n => n[0]).slice(1).join('')}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-serif text-lg sm:text-xl font-bold text-mv-forest">
                            {doc.name}
                          </h2>
                        </div>
                        {/* Demo label sits directly under the name so it is read with it */}
                        <span
                          className="mt-1.5 inline-block text-[12px] font-semibold bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-300/60"
                          data-demo-label
                        >
                          {DEMO_PROFILE_LABEL}
                        </span>
                        <span className="text-xs font-mono font-semibold text-mv-terracotta block mt-1.5">
                          <span className="font-sans font-semibold text-mv-ink-muted">Sample credentials: </span>
                          {doc.credentials}
                        </span>
                        <span className="text-xs text-mv-ink-muted block mt-0.5">
                          {doc.title} · {doc.yearsExperience} yrs exp (sample)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-[13.5px] text-mv-ink-muted mt-4.5 leading-relaxed">
                    {doc.bio}
                  </p>

                  {/* Medical College & Training */}
                  <div className="mt-3.5 text-[11px] text-mv-ink-muted flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-mv-forest shrink-0" />
                    <span>{doc.education}</span>
                  </div>

                  {/* Indian Credential Definitions Clickable Tags */}
                  <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-mv-ink-muted">Sample credentials explained:</span>
                    {['MCh', 'DNB', 'FVIR', 'MS'].map((key) => {
                      if (!doc.credentials.includes(key)) return null;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedCredential(key)}
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-mv-cream text-mv-forest border border-mv-outline/70 hover:bg-mv-forest hover:text-white transition-colors cursor-pointer"
                          title={`Click to inspect ${key} clinical significance`}
                        >
                          {key}
                        </button>
                      );
                    })}
                  </div>

                  {/* Languages Spoken */}
                  <div className="mt-3.5 text-[11.5px] text-mv-ink-muted flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-mv-forest shrink-0" />
                    <span className="font-semibold text-mv-forest">Languages: </span>
                    <span>{doc.languagesSpoken.join(', ')}</span>
                  </div>

                  {/* Clinical Expertise Pills */}
                  <div className="mt-4">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-mv-forest block mb-2">
                      Procedures &amp; Expertise:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.expertise.map((exp, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-[#FAF7F2] text-mv-forest border border-mv-outline/70 px-3 py-1 rounded-full font-medium"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Consultation Fee & Insurance Guidance */}
                  <div className="mt-5 p-4 rounded-2xl bg-[#FAF7F2] border border-mv-outline/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-mv-ink-muted block">Consultation fee (illustrative):</span>
                      <span className="font-mono font-bold text-sm text-mv-forest">
                        Sample fee ₹{doc.consultationFeeINR}
                      </span>
                    </div>
                    <div className="text-[11px] text-mv-ink-muted sm:text-right max-w-xs leading-relaxed">
                      <span className="font-semibold text-mv-forest">Sample insurance note: </span>
                      <span>{doc.insuranceNote}</span>
                    </div>
                  </div>

                </div>

                {/* Card Footer: Location, Availability & Actions */}
                <div className="mt-6 pt-5 border-t border-mv-outline/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 text-mv-forest font-medium">
                      <MapPin className="w-3.5 h-3.5 text-mv-terracotta shrink-0" />
                      <span className="truncate max-w-[220px]">{doc.city} (no real clinic address)</span>
                    </div>
                    <div className="text-[11px] text-mv-forest font-semibold mt-1 flex items-center gap-2">
                      <span>Sample time: {doc.nextAvailable} (illustrative, not real availability)</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-mv-forest">
                        <Video className="w-3 h-3" /> Teleconsult Available
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {onOpenAiWithPrompt && (
                      <button
                        onClick={() => onOpenAiWithPrompt(`What questions should I ask ${doc.name} (${doc.specialty}, ${doc.city}) during my venous ultrasound OPD consultation?`)}
                        className="px-3.5 py-2.5 bg-white hover:bg-mv-cream text-mv-forest border border-mv-outline/70 font-semibold rounded-full transition-all text-xs flex items-center gap-1.5 cursor-pointer tap-tactile min-h-[40px]"
                        title={`Prepare consultation questions with the ${GUIDE_LABELS.name.toLowerCase()}`}
                      >
                        <GuideIcon className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
                        <span>Prep Visit</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        // Provider choice is not recorded in analytics.
                        trackEvent('simulated_booking_opened', { from: 'doctor_directory' });
                        onSelectDoctor(doc);
                      }}
                      className="px-4.5 py-2.5 bg-mv-forest hover:bg-[#073028] text-white font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs text-xs tap-tactile min-h-[40px]"
                    >
                      <Calendar className="w-3.5 h-3.5 text-mv-terracotta" />
                      <span>Request (demo)</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
