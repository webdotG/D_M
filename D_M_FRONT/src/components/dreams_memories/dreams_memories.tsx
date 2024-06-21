import style from './dreams_memories.module.scss'

const analys = false
const dreamDate = '04.06.2024'
const dreamCategory = 'dream category item'

export default function Dream() {
  return (
    <div className={style['dream']}>Dream/Item
      <div className={style['dream-content']}>
        <h3 className={style['dream-content-title']}>что-то запоминающееся</h3>
        <p className={style['dream-content-text']}>немного самого сна</p>
        <div className={style['dream-content-info']}>
          <div className={style['dream-date']}>
            <p>{dreamDate}</p>
          </div>
          <div className={style['dream-category']}>
            <p>{dreamCategory}</p>
          </div>
        </div>
      </div>
      <div className={style['dream-function']}>
        <button className={style['dream-function__edit-btn']} onClick={console.log}>редактировать</button>
        <button className={style['dream-function__edit-btn']} onClick={console.log}>
          {
            analys ? (
              <img src='' alt='картинка что анализировано' width='12px' height='12px'></img>
            ) : (
              <img src='' alt='картинка что НЕ анализировано'></img>
            )
          }
          {
            analys ? (
              <p>сделано</p>
            ) : (
              <p>анализировать</p>
            )
          }
        </button>
      </div>

    </div>
  )
}
