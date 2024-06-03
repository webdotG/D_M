import style from './welcomePage.module.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    img: './think-outside-box-concept-illustration_114360-15764.png',
    title: 'Привет',
    text: 'Я программа для записи снов и воспоминаний ',
  }, 
  {
    img: './untangle-concept-illustration_114360-21205.png',
    title: 'Воспоминания',
    text: 'Получается автобиография с картинками и временными датами',
  }, 
  {
    img: './poetry-concept-illustration_114360-8382.png',
    title: 'Сны',
    text: 'Подсознание общается с нами через образы, интересно научться понимать.',
  },
  {
    img: './chat-bot-concept-illustration_114360-5223.png',
    title: 'Эпоха ИИ',
    text: 'У нас появился крутой инструмент для работы ',
  }
]



export default function WelcomePage() {
 const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === SLIDES.length - 1 ? 0 : prevSlide + 1));
  };

  const goToPreviousSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? SLIDES.length - 1 : prevSlide - 1));
  };

  const skipSlide = () => {
    createAccount();
  };

  const createAccount = () => {
    navigate('/D_M/login')
  };

  return (
    <section className={style['welcome-page']}>

      <div className={style['slide']}>
        <div className={style['slide-content']}>
          <img src={SLIDES[currentSlide].img} alt={'картинка png'} />
          <h2>{SLIDES[currentSlide].title}</h2>
          <p>{SLIDES[currentSlide].text}</p>
          <div className={style['button-container']}>
            <button onClick={goToPreviousSlide}
              disabled={currentSlide === 0}
              className={currentSlide === 0 ? style['opacity'] : ''}
            >Назад</button>
            {currentSlide === SLIDES.length - 1 ? (
              <button onClick={createAccount}>Создать аккаунт</button>
            ) : (
              <button onClick={goToNextSlide}>Дальше</button>
            )}
          </div>
        </div>
        <button className={style['skip-button']} onClick={skipSlide}>Пропустить</button>
      </div>

    </section>
  )
}
