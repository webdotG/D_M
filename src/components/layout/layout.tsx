import { ReactNode } from 'react'
import style from './layout.module.scss'
import Header from '../header/header'
import Footer from '../footer/footer'
import { Link } from 'react-router-dom'

type typeProps = {
  children: ReactNode
}

export default function Layout({ children }: typeProps) {

  return (

    <div className={style['layout']}>

      <ul className={style['layout__content']}>
        <li className={style['layout__content__item']}>
          <Link to='/'>cны</Link>
        </li>
        <li className={style['layout__content__item']}>
          <Link to='/'>воспоминания</Link>
        </li>
      </ul>
      <Header />
      {children}
      <Footer />

    </div>
  )

}