import React, { useMemo, useState, useRef, useEffect } from 'react';
import Modal from './Modal';
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
  recordsByMonth: { [month: string]: Record[] }; // Записи по месяцам
  associationsByMonth: { [month: string]: string[] }; // Ассоциации по месяцам
  daysByMonth: { [month: string]: number[] }; // Дни по месяцам
}

const TimelineY: React.FC<TimelineYProps> = ({
  recordsByMonth,
  associationsByMonth,
  daysByMonth
}) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [selectedMonthRecords, setSelectedMonthRecords] = useState<Record[]>([]);
  const [selectedMonthAssociations, setSelectedMonthAssociations] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [expandedYears, setExpandedYears] = useState<{ [key: number]: boolean }>({});
  const [selectedSeasons, setSelectedSeasons] = useState<{ [year: number]: string | null }>({});
  const modalRef = useRef<HTMLDivElement>(null);

  const startDate = new Date('1989-06-25');
  const endDate = new Date();

  const generateScale = () => {
    const scale: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      scale.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return scale.reverse();
  };

  const scale = useMemo(generateScale, [endDate]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    return { year, month };
  };

  const getDaysInMonth = (year: number, month: number) => {
    const days: number[] = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      days.push(date.getDate());
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handleMonthClick = (date: Date) => {
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
    fall: [8, 9, 10], // Сентябрь, Октябрь, Ноябрь
    summer: [5, 6, 7], // Июнь, Июль, Август
    spring: [2, 3, 4], // Март, Апрель, Май
    winter: [0, 1, 11], // Декабрь, Январь, Февраль
  };

  const seasonNames = {
    fall: 'Осень',
    summer: 'Лето',
    spring: 'Весна',
    winter: 'Зима',
  };

  const seasonClasses = {
    fall: styles.fallSeason,
    summer: styles.summerSeason,
    spring: styles.springSeason,
    winter: styles.winterSeason,
  };

  const toggleYear = (year: number) => {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
    setSelectedSeasons(prev => ({ ...prev, [year]: null })); 
  };

  const handleSeasonClick = (year: number, season: string) => {
    setSelectedSeasons(prev => ({ ...prev, [year]: prev[year] === season ? null : season }));
  };

  const renderSeasons = (year: number) => {
    const selectedSeason = selectedSeasons[year];
    return Object.keys(seasons).map(season => (
      <div key={season} className={`${styles.season} ${selectedSeason === season ? seasonClasses[season] : ''}`}>
        
        {selectedSeason === season && (
          <div className={styles.monthsContainer}>
            {scale.filter(date => date.getFullYear() === year && seasons[season].includes(date.getMonth()))
                  .map(date => {
                    const { month } = formatDate(date);
                    const monthKey = `${date.getMonth() + 1}-${year}`;
                    const monthAssociations = associationsByMonth[monthKey] || [];
                    return (
                      <div
                        key={monthKey}
                        onClick={() => handleMonthClick(date)}
                        className={`${styles.monthItem} 
                        ${monthAssociations.length ? styles.monthItemWithAssociations : ''}`}
                      >
                        <span>{month}</span>
                        {monthAssociations.length > 0 && (
                          <div className={styles.associations} title={monthAssociations.join(', ')}>
                            {monthAssociations.join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
          </div>
        )}
        <button onClick={() => handleSeasonClick(year, season)} 
          className={styles.seasonButton}>
          {seasonNames[season]}
        </button>

      </div>
    ));
  };

  return (
    <div className={styles.timelineContainer}>
      {Array.from(new Set(scale.map(date => date.getFullYear()))).map(year => (
        <div key={year} className={styles.yearContainer}>
          
          {expandedYears[year] && renderSeasons(year)}
          <button onClick={() => toggleYear(year)} 
            className={styles.yearButton}>
            {expandedYears[year] ?
                                  <span className={styles.yearButton__content}> 
                                  Свернуть {year} год <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
	viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
<g>
	<path d="M48.252,69.253c-2.271,0-4.405-0.884-6.011-2.489L17.736,42.258c-1.646-1.645-2.546-3.921-2.479-6.255
		c-0.068-2.337,0.833-4.614,2.479-6.261L42.242,5.236c1.605-1.605,3.739-2.489,6.01-2.489c2.271,0,4.405,0.884,6.01,2.489
		c3.314,3.314,3.314,8.707,0,12.021L35.519,36l18.743,18.742c3.314,3.314,3.314,8.707,0,12.021
		C52.656,68.369,50.522,69.253,48.252,69.253z M48.252,6.747c-1.202,0-2.332,0.468-3.182,1.317L21.038,32.57
		c-0.891,0.893-0.833,2.084-0.833,3.355c0,0.051,0,0.101,0,0.151c0,1.271-0.058,2.461,0.833,3.353l24.269,24.506
		c0.85,0.85,1.862,1.317,3.063,1.317c1.203,0,2.273-0.468,3.123-1.317c1.755-1.755,1.725-4.61-0.03-6.365L31.292,37.414
		c-0.781-0.781-0.788-2.047-0.007-2.828L51.438,14.43c1.754-1.755,1.753-4.61-0.001-6.365C50.587,7.215,49.454,6.747,48.252,6.747z"
		/>
</g>
</svg> 
                                  </span> 
                                  :year
            }
          </button>

        </div>
      ))}

      <Modal
        ref={modalRef}
        isOpen={modalOpen}
        onClose={closeModal}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        daysInMonth={daysInMonth}
        records={selectedMonthRecords}
      />
    </div>
  );
};

export default TimelineY;
