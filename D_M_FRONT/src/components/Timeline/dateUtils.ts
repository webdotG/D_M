export const generateScale = (startDate: Date, endDate: Date): Date[] => {
    const scale: Date[] = [];
    const currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      scale.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  
    if (scale.length === 0 || scale[scale.length - 1].getMonth() !== endDate.getMonth() || scale[scale.length - 1].getFullYear() !== endDate.getFullYear()) {
      scale.push(new Date(endDate));
    }
  
    return scale.reverse();
  };
  
  export const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    return { year, month };
  };
  
  export const getDaysInMonth = (year: number, month: number) => {
    const days: number[] = [];
    const date = new Date(year, month, 1);
    const today = new Date();
  
    while (date.getMonth() === month && date <= today) {
      days.push(date.getDate());
      date.setDate(date.getDate() + 1);
    }
  
    return days;
  };
  