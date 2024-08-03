import React, { useMemo, useState, useRef, useEffect } from 'react';
import ModalComponent from './Modal';
import YearComponent from './Year';
import { generateScale, formatDate, getDaysInMonth } from './dateUtils';
import styles from './TimelineY.module.scss';

interface Record {
  id: number;
  title: string;
  date: string;
  day?: number;
  month?: number;
  year?: number;
  associations?: string;
}

interface TimelineYProps {
  recordsByMonth: { [month: string]: Record[] };
  associationsByMonth: { [month: string]: string[] };
  records: Record[];
}

const TimelineY: React.FC<TimelineYProps> = ({ recordsByMonth, associationsByMonth }) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [selectedMonthRecords, setSelectedMonthRecords] = useState<Record[]>([]);
  const [selectedMonthAssociations, setSelectedMonthAssociations] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [expandedYears, setExpandedYears] = useState<{ [key: number]: boolean }>({});
  const [selectedSeasons, setSelectedSeasons] = useState<{ [year: number]: string[] }>({});

  const modalRef = useRef<HTMLDivElement>(null);

  const startDate = new Date('1989-06-25');
  const endDate = new Date();

  const scale = useMemo(() => generateScale(startDate, endDate), [endDate]);

  const handleMonthClick = (date: Date) => {
    const today = new Date();
    if (date > today) return;

    const { year, month } = formatDate(date);
    const monthIndex = date.getMonth();
    const monthKey = `${monthIndex + 1}-${year}`;

    setSelectedYear(year);
    setSelectedMonth(month);
    setDaysInMonth(getDaysInMonth(year, monthIndex));
    setSelectedMonthRecords(recordsByMonth[monthKey] || []);
    setSelectedMonthAssociations(associationsByMonth[monthKey] || []);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedYear(null);
    setSelectedMonth(null);
    setDaysInMonth([]);
    setSelectedMonthRecords([]);
    setSelectedMonthAssociations([]);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (modalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalOpen]);

  const seasons = {
    winterNewEar: [11],
    fall: [8, 9, 10],
    summer: [5, 6, 7],
    spring: [2, 3, 4],
    winterOldEar: [0, 1],
  };

  const seasonNames = {
    winterNewEar: 'Зима НГ',
    fall: 'Осень',
    summer: 'Лето',
    spring: 'Весна',
    winterOldEar: 'Зима',
  };

  const toggleYear = (year: number) => {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
  };

  const handleSeasonClick = (year: number, season: string) => {
    setSelectedSeasons(prev => {
      const currentSeasons = prev[year] || [];
      const seasonIndex = currentSeasons.indexOf(season);
      if (seasonIndex === -1) {
        return { ...prev, [year]: [...currentSeasons, season] };
      } else {
        return { ...prev, [year]: currentSeasons.filter(s => s !== season) };
      }
    });
  };

  const renderSeasons = (year: number) => {
    const selectedSeasonsForYear = selectedSeasons[year] || [];
    const monthRecordCounts: { [key: string]: number } = {};

    Object.keys(recordsByMonth).forEach(monthKey => {
      const [month, yearStr] = monthKey.split('-');
      if (parseInt(yearStr) === year) {
        monthRecordCounts[monthKey] = recordsByMonth[monthKey].length;
      }
    });

    const seasonRecordCounts: { [key: string]: number } = {};

    Object.keys(seasons).forEach(season => {
      const seasonMonths = seasons[season];
      const totalRecords = scale
        .filter(date => {
          const dateYear = date.getFullYear();
          const dateMonth = date.getMonth();
          return dateYear === year && seasonMonths.includes(dateMonth);
        })
        .reduce((total, date) => {
          const monthKey = `${date.getMonth() + 1}-${year}`;
          return total + (monthRecordCounts[monthKey] || 0);
        }, 0);

      seasonRecordCounts[season] = totalRecords;
    });

    return Object.keys(seasons).map(season => {
      const seasonMonths = seasons[season];
      const isSeasonVisible = scale.some(date => {
        const dateYear = date.getFullYear();
        const dateMonth = date.getMonth();
        return dateYear === year && seasonMonths.includes(dateMonth);
      });

      if (!isSeasonVisible) return null;

      let seasonClass = styles.season;

      if (season === 'winterNewEar') {
        seasonClass = selectedSeasonsForYear.includes('winterNewEar')
          ? styles.winterNewEar
          : styles.winterOldEar;
      } else {
        seasonClass = styles[season];
      }

      const totalRecords = seasonRecordCounts[season] || 0;

      return (
        <div key={season} className={seasonClass}>
          <button onClick={() => handleSeasonClick(year, season)} className={styles.seasonButton}>
            {seasonNames[season]}
            {totalRecords > 0 && (
              <span className={styles.recordCount}>
                {totalRecords}
              </span>
            )}
          </button>
          {selectedSeasonsForYear.includes(season) && (
            <div className={styles.monthsContainer}>
              {scale
                .filter(date => {
                  const dateYear = date.getFullYear();
                  const dateMonth = date.getMonth();
                  return dateYear === year && seasonMonths.includes(dateMonth);
                })
                .map(date => {
                  const month = formatDate(date).month;
                  const monthKey = `${date.getMonth() + 1}-${year}`;
                  const count = monthRecordCounts[monthKey] || 0;
                  return (
                    <div
                      key={monthKey}
                      onClick={() => handleMonthClick(date)}
                      className={`${styles.monthItem} ${count > 0 ? styles.monthItemWithAssociations : ''}`}
                    >
                      <span>
                        {month} {count > 0 && <span className={styles.recordCount}> {count} </span>}
                      </span>
                      {count > 0 && (
                        <div className={styles.associations} title={associationsByMonth[monthKey]?.join(', ') || ''}>
                          {associationsByMonth[monthKey]?.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      );
    });
  };

  const getYearRecordCount = (year: number) => {
    return scale
      .filter(date => date.getFullYear() === year)
      .reduce((total, date) => {
        const monthKey = `${date.getMonth() + 1}-${year}`;
        return total + (recordsByMonth[monthKey]?.length || 0);
      }, 0);
  };

  return (
    <div className={styles.timelineContainer}>
      {Array.from(new Set(scale.map(date => date.getFullYear()))).map(year => (
        <YearComponent
          key={year}
          year={year}
          expanded={expandedYears[year]}
          toggleYear={toggleYear}
          renderSeasons={renderSeasons}
          getYearRecordCount={getYearRecordCount}
        />
      ))}

      <ModalComponent
        ref={modalRef}
        isOpen={modalOpen}
        onClose={closeModal}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        daysInMonth={daysInMonth}
        records={selectedMonthRecords}
        modalRef={modalRef}
      />
    </div>
  );
};

export default TimelineY;
