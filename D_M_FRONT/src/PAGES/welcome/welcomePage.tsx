import style from './welcomePage.module.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import firstSlide from '../../PNG/think-outside-box-concept-illustration_114360-15764.png';
import secondeSlide from '../../PNG/untangle-concept-illustration_114360-21205.png';
import thirdSlide from '../../PNG/poetry-concept-illustration_114360-8382.png'
import fourthSlide from '../../PNG/chat-bot-concept-illustration_114360-5223.png'
import Back from '../../SVG/back.svg'
import Next from '../../SVG/next.svg'
import Skip from '../../SVG/forward.svg'

const SLIDES = [
  {
    img: firstSlide,
    title: 'Привет',
    text: 'Я программа для записи снов и воспоминаний ',
  }, 
  {
    img: secondeSlide,
    title: 'Воспоминания',
    text: 'Получается автобиография с картинками и временными датами',
  }, 
  {
    img: thirdSlide,
    title: 'Сны',
    text: 'Подсознание общается с нами через образы, интересно научться понимать.',
  },
  {
    img: fourthSlide,
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
              className={currentSlide === 0 ? style['opacity'] : ''}>
              <img src={Back} alt='back icon' className={style['pagination_btn']} />
             </button>
            {currentSlide === SLIDES.length - 1 ? (
              <button onClick={createAccount}>Создать аккаунт</button>
            ) : (
              <button onClick={goToNextSlide}>
                <img src={Next} alt='next icon' className={style['pagination_btn']} />
              </button>
            )}
          </div>
        </div>
        <button className={style['skip-button']} onClick={skipSlide}>
        <img src={Skip} alt='skip icon' />
             
        </button>
      </div>

    </section>
  )
}
