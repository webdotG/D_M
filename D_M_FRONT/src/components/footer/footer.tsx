import { Link } from 'react-router-dom';
import styles from './footer.module.scss';

export const BUTTONS = [
  {
    id: 1,
    name: 'home',
    url: '/D_M/',
    svg: <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
    viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
 <g>
   <path d="M70.202,26.797l-33-24.833c-0.033-0.025-0.069-0.04-0.104-0.063c-0.056-0.037-0.111-0.072-0.17-0.103
     c-0.06-0.031-0.119-0.058-0.181-0.083c-0.059-0.024-0.116-0.045-0.177-0.063c-0.064-0.02-0.129-0.035-0.195-0.047
     c-0.061-0.012-0.121-0.021-0.182-0.027c-0.066-0.006-0.131-0.009-0.196-0.009c-0.063,0-0.126,0.002-0.189,0.008
     c-0.064,0.006-0.127,0.016-0.19,0.028c-0.063,0.012-0.124,0.026-0.186,0.044c-0.065,0.019-0.128,0.042-0.19,0.068
     c-0.056,0.023-0.11,0.046-0.164,0.075c-0.066,0.034-0.129,0.074-0.192,0.116c-0.029,0.02-0.061,0.033-0.09,0.055l-33,24.833
     c-0.882,0.664-1.06,1.918-0.396,2.801c0.394,0.522,0.994,0.797,1.6,0.797c0.419,0,0.841-0.131,1.201-0.401l5.179-3.897v33.964
     c0,7.854,2.049,10.375,9.619,10.375h34c7.57,0,10.381-2.521,10.381-10.375V26.671l4.416,3.323c0.36,0.271,0.782,0.402,1.201,0.402
     c0.607,0,1.207-0.274,1.6-0.798C71.262,28.715,71.085,27.461,70.202,26.797z M31.201,47.438H40.8c2.2,0,2.581,0.039,2.581,2.025
     v16.975H29.382V49.463C29.382,47.477,29.001,47.438,31.201,47.438z M59.381,24.438v35.625c0,5.721-0.998,6.375-6.381,6.375h-7.619
     V49.463c0-3.443-1.677-4.025-4.581-4.025h-9.599c-2.904,0-3.819,0.582-3.819,4.025v16.975H19c-5.384,0-5.619-0.654-5.619-6.375
     V24.438c0-0.407-0.123-0.784-0.332-1.1L36,6.066l23.508,17.69C59.43,23.97,59.381,24.198,59.381,24.438z"/>
   <path d="M30.612,16.207L17.582,26.27c-0.247,0.189-0.201,0.482-0.201,0.793v11.375c0,0.554,0.447,1,1,1c0.552,0,1-0.446,1-1V27.556
     l12.567-9.762c0.439-0.336,0.354-0.964,0.018-1.402C31.631,15.954,31.05,15.871,30.612,16.207z"/>
   <path d="M18.381,41.438c-0.553,0-1,0.447-1,1v1c0,0.554,0.447,1,1,1c0.552,0,1-0.446,1-1v-1
     C19.381,41.885,18.933,41.438,18.381,41.438z"/>
 </g>
 </svg>
  },
  {
    id: 2,
    name: 'calendar',
    url: '/D_M/visualPage',
    svg: <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
    viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
    <g>
      <path d="M61.568,11.5H10.432c-3.828,0-6.932,3.104-6.932,6.932v35.136c0,3.828,3.104,6.933,6.932,6.933h51.136
        c3.828,0,6.932-3.104,6.932-6.933h0.001V18.432C68.501,14.604,65.396,11.5,61.568,11.5z M54.5,56.501h-37V56.5v-2.6
        c0-2.303,1.828-4.4,3.886-4.4h29.135c2.059,0,3.979,2.098,3.979,4.4V56.501L54.5,56.501z M64.501,53.568
        c0,1.619-1.313,2.933-2.933,2.933h-5.067V56.5v-2.6c0-3.41-2.819-6.4-5.978-6.4H21.386c-3.16,0-5.886,2.99-5.886,6.4v2.6v0.001
        h-5.068c-1.619,0-2.932-1.313-2.932-2.933V18.432c0-1.619,1.313-2.932,2.932-2.932h51.136c1.619,0,2.932,1.313,2.932,2.932h0.001
        V53.568z"/>
      <path d="M47.891,21.5H24.016c-2.058,0-4.229,0.775-6.279,2.241c-0.449,0.322-0.552,0.947-0.231,1.396
        c0.321,0.447,0.946,0.551,1.396,0.231c1.19-0.852,3.045-1.868,5.115-1.868h23.875c4.561,0,8.607,4.027,8.607,8.618v0.826
        c0,4.308-3.727,7.556-8.607,7.556H24.017c-4.802,0-8.563-3.475-8.563-7.908c0-0.553-0.448-1-1-1c-0.553,0-1,0.447-1,1
        c0,5.463,4.739,9.908,10.563,9.908h23.875c6.021,0,10.607-4.109,10.606-9.556v-0.826C58.499,26.462,53.518,21.5,47.891,21.5z"/>
      <path d="M14.602,30.234c0.108,0.037,0.219,0.055,0.327,0.055c0.414,0,0.801-0.26,0.946-0.673c0.119-0.345,0.263-0.684,0.428-1.008
        c0.251-0.492,0.054-1.095-0.437-1.345c-0.494-0.251-1.095-0.055-1.346,0.437c-0.206,0.407-0.387,0.831-0.536,1.262
        C13.803,29.484,14.081,30.053,14.602,30.234z"/>
      <path d="M31.58,32.717c0-3.343-2.72-6.063-6.063-6.063c-3.343,0-6.063,2.72-6.063,6.063c0,3.343,2.72,6.063,6.063,6.063
        C28.859,38.779,31.58,36.06,31.58,32.717z M21.454,32.717c0-2.241,1.823-4.063,4.063-4.063c2.24,0,4.063,1.823,4.063,4.063
        c0,2.24-1.822,4.063-4.063,4.063C23.276,36.779,21.454,34.958,21.454,32.717z"/>
      <path d="M53.58,32.717c0-3.343-2.721-6.063-6.063-6.063c-3.344,0-6.063,2.72-6.063,6.063c0,3.343,2.72,6.063,6.063,6.063
        C50.859,38.779,53.58,36.06,53.58,32.717z M43.454,32.717c0-2.241,1.823-4.063,4.063-4.063c2.239,0,4.063,1.823,4.063,4.063
        c0,2.24-1.822,4.063-4.063,4.063C45.275,36.779,43.454,34.958,43.454,32.717z"/>
    </g>
    </svg>,
  },
  {
    id: 4,
    name: 'chat',
    url: '/D_M/chatPage',
    svg: <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
    viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
 <g>
   <g>
     <path d="M27.869,68.25c-0.321,0-0.643-0.078-0.937-0.234c-0.671-0.355-1.083-1.061-1.063-1.818l0.195-7.447h-5.015
       c-3.822,0-6.551-3.15-6.551-7.021V25.593c0-3.773,2.729-6.843,6.551-6.843h40.137c3.822,0,7.313,3.069,7.313,6.843v26.136
       c0,3.871-3.49,7.021-7.313,7.021H41.762l-12.728,9.125C28.688,68.124,28.279,68.25,27.869,68.25z M21.051,22.75
       c-1.644,0-2.551,1.249-2.551,2.843v26.136c0,1.639,0.962,3.021,2.551,3.021h7.068c0.54,0,1.057,0.217,1.433,0.604
       c0.377,0.387,0.581,0.91,0.566,1.449l-0.144,5.477l9.979-7.154c0.34-0.244,0.747-0.375,1.165-0.375h20.068
       c1.589,0,3.313-1.383,3.313-3.021V25.593c0-1.594-1.669-2.843-3.313-2.843H21.051z"/>
   </g>
   <g>
     <path d="M6.68,42.151c-0.472,0-0.754-0.166-1.135-0.504C4.082,40.352,3.5,38.651,3.5,36.729V10.593
       c0-3.773,2.729-6.843,6.551-6.843h40.137c3.822,0,7.313,3.069,7.313,6.843v1.157c0,1.104-0.896,2-2,2s-2-0.896-2-2v-1.157
       c0-1.594-1.669-2.843-3.313-2.843H10.051C8.407,7.75,7.5,8.999,7.5,10.593v26.136c0,0.766,0.1,1.395,0.697,1.924
       c0.827,0.732,0.809,1.998,0.076,2.824C7.877,41.922,7.232,42.151,6.68,42.151z"/>
   </g>
   <g>
     <g>
       <path d="M34.119,31.75h-8c-0.553,0-1-0.447-1-1s0.447-1,1-1h8c0.553,0,1,0.447,1,1S34.672,31.75,34.119,31.75z"/>
     </g>
     <g>
       <path d="M48.119,31.75h-10c-0.553,0-1-0.447-1-1s0.447-1,1-1h10c0.553,0,1,0.447,1,1S48.672,31.75,48.119,31.75z"/>
     </g>
     <g>
       <path d="M56.119,31.75h-4c-0.553,0-1-0.447-1-1s0.447-1,1-1h4c0.553,0,1,0.447,1,1S56.672,31.75,56.119,31.75z"/>
     </g>
   </g>
   <g>
     <g>
       <path d="M30.119,36.75h-4c-0.553,0-1-0.448-1-1s0.447-1,1-1h4c0.553,0,1,0.447,1,1S30.672,36.75,30.119,36.75z"/>
     </g>
     <g>
       <path d="M42.119,36.75h-8c-0.553,0-1-0.448-1-1s0.447-1,1-1h8c0.553,0,1,0.447,1,1S42.672,36.75,42.119,36.75z"/>
     </g>
     <g>
       <path d="M56.119,36.75h-10c-0.553,0-1-0.448-1-1s0.447-1,1-1h10c0.553,0,1,0.447,1,1S56.672,36.75,56.119,36.75z"/>
     </g>
   </g>
   <g>
     <g>
       <path d="M36.119,42.75h-10c-0.553,0-1-0.447-1-1s0.447-1,1-1h10c0.553,0,1,0.447,1,1S36.672,42.75,36.119,42.75z"/>
     </g>
     <g>
       <path d="M50.119,42.75h-10c-0.553,0-1-0.447-1-1s0.447-1,1-1h10c0.553,0,1,0.447,1,1S50.672,42.75,50.119,42.75z"/>
     </g>
     <g>
       <path d="M56.119,42.75h-2c-0.553,0-1-0.447-1-1s0.447-1,1-1h2c0.553,0,1,0.447,1,1S56.672,42.75,56.119,42.75z"/>
     </g>
   </g>
   <g>
     <g>
       <path d="M30.119,47.75h-4c-0.553,0-1-0.447-1-1s0.447-1,1-1h4c0.553,0,1,0.447,1,1S30.672,47.75,30.119,47.75z"/>
     </g>
     <g>
       <path d="M41.119,47.75h-7c-0.553,0-1-0.447-1-1s0.447-1,1-1h7c0.553,0,1,0.447,1,1S41.672,47.75,41.119,47.75z"/>
     </g>
   </g>
 </g>
 </svg>
  },
  {
    id: 5,
    name: 'profile',
    url: '/D_M/myPage/',
    svg: 
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
      viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
    <g>
      <path d="M37.008,3.5h-1.796C21.561,3.5,10.5,14.228,10.5,27.512v33.716c0,3.696,3.273,7.271,6.785,7.271h0.333
        c3.79,0,5.882-3.785,5.882-7.271v-2.996c0-1.235,1.84-1.731,3.114-1.731h0.333c0.754,0,2.553,0.097,2.553,1.731v2.996
        c0,3.401,2.619,7.271,6.443,7.271h0.333c3.697,0,6.224-3.798,6.224-7.271v-2.996c0-1.433,1.797-1.731,2.771-1.731h0.334
        c1.399,0,1.895,0.36,1.895,1.731v2.996c0,3.629,3.495,7.271,7.102,7.271h0.334c3.73,0,6.564-3.877,6.564-7.271V27.512
        C61.5,14.228,50.486,3.5,37.008,3.5z M57.5,61.229c0,1.549-1.34,3.271-2.564,3.271h-0.334c-1.384,0-3.102-1.87-3.102-3.271V58.23
        c0-3.584-2.288-5.73-5.895-5.73h-0.334c-3.951,0-6.771,2.363-6.771,5.732v2.996c0,1.476-0.997,3.271-2.224,3.271h-0.333
        c-1.21,0-2.443-1.721-2.443-3.271v-2.996c0-3.422-2.722-5.731-6.553-5.731h-0.333c-3.471,0-7.114,1.957-7.114,5.731v2.996
        c0,1.338-0.685,3.271-1.882,3.271h-0.333c-1.297,0-2.785-1.809-2.785-3.271V27.512C14.5,16.433,23.766,7.5,35.212,7.5h1.796
        C48.473,7.5,57.5,16.245,57.5,27.512V61.229z"/>
      <path d="M35.777,11.454c0.215,0,0.429,0.046,0.642,0.046c0.012,0,0.023,0,0.035,0c0.536,0,0.979-0.457,0.999-0.997
        c0.018-0.552-0.413-1.048-0.965-1.067c-0.235-0.009-0.473-0.008-0.711-0.008c-0.553,0-1,0.456-1,1.009
        C34.777,10.99,35.224,11.454,35.777,11.454z"/>
      <path d="M40.813,10.057c-0.537-0.138-1.096,0.182-1.236,0.716c-0.139,0.534,0.193,1.08,0.729,1.22
        C47.585,13.889,52.5,20.061,52.5,27.35v12.07c0,0.553,0.447,1,1,1c0.552,0,1-0.447,1-1V27.35
        C54.5,19.136,48.988,12.187,40.813,10.057z"/>
      <path d="M23.794,23.574c-3.221,0-5.84,2.62-5.84,5.84s2.619,5.84,5.84,5.84c3.22,0,5.84-2.62,5.84-5.84
        S27.014,23.574,23.794,23.574z M23.794,33.254c-2.117,0-3.84-1.723-3.84-3.84c0-2.117,1.723-3.84,3.84-3.84s3.84,1.723,3.84,3.84
        C27.634,31.531,25.911,33.254,23.794,33.254z"/>
      <path d="M38.529,23.574c-3.221,0-5.84,2.62-5.84,5.84s2.619,5.84,5.84,5.84c3.22,0,5.84-2.62,5.84-5.84
        S41.749,23.574,38.529,23.574z M38.529,33.254c-2.117,0-3.84-1.723-3.84-3.84c0-2.117,1.723-3.84,3.84-3.84s3.84,1.723,3.84,3.84
        C42.369,31.531,40.646,33.254,38.529,33.254z"/>
    </g>
    </svg>,
  },
];


const Footer= () => {
  return (
    <footer className={styles.footer}>
    <div className={styles['footer__wrapper']}>

    <Link to="/D_M/add" className={styles['footer-add']}>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
 viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
<g fill="" stroke="">
	<path d="M30.489,66.511c-1.604-1.604-2.488-3.74-2.488-6.011V44L11.5,43.999C9.229,44,7.095,43.116,5.489,41.51
		c-1.605-1.605-2.488-3.739-2.488-6.01C3,33.23,3.884,31.095,5.489,29.489c1.606-1.605,3.74-2.489,6.012-2.488L28,27l0.001-15.5
		C28,9.23,28.884,7.095,30.489,5.489S34.23,3,36.5,3.001c2.27,0,4.404,0.883,6.011,2.489c1.605,1.605,2.489,3.74,2.488,6.011
		L45,27.001h15.5c2.271,0,4.404,0.883,6.011,2.489c1.606,1.605,2.49,3.741,2.488,6.01c0.001,2.27-0.883,4.405-2.488,6.011
		S62.77,44,60.5,43.999L45,44.001L44.999,60.5c0.001,2.271-0.883,4.404-2.488,6.011C40.905,68.116,38.77,69,36.5,68.999
		C34.231,69.001,32.096,68.117,30.489,66.511z M31.415,40.586C31.776,40.948,32,41.447,32,42l0.001,18.5
		c0,1.204,0.468,2.333,1.317,3.183C34.169,64.533,35.298,65,36.5,65c1.203,0,2.332-0.469,3.182-1.317
		c0.851-0.851,1.319-1.979,1.317-3.182l0.002-18.5c0-1.104,0.895-2,2-2L60.5,40c1.204,0,2.332-0.468,3.182-1.317
		C64.532,37.832,65,36.704,65,35.5c0-1.202-0.469-2.332-1.318-3.182c-0.849-0.85-1.979-1.318-3.18-1.316L43,31
		c-1.104,0-2-0.895-2-1.999L40.999,11.5c0.001-1.202-0.468-2.332-1.316-3.182c-0.851-0.85-1.98-1.318-3.182-1.317
		c-1.203,0-2.333,0.467-3.184,1.317c-0.85,0.85-1.316,1.979-1.317,3.182V29c0,1.104-0.896,2-2,2l-18.5,0.001
		c-1.202,0-2.332,0.467-3.183,1.317C7.469,33.167,7.001,34.298,7,35.5c0,1.203,0.469,2.332,1.317,3.182
		c0.851,0.851,1.98,1.318,3.183,1.317L30,40.001C30.553,40.001,31.053,40.225,31.415,40.586z"/>
</g>
</svg>
    </Link>

      <ul className={styles['footer-list']}>
        {BUTTONS.map(item => (
          <li className={styles['footer-item']} key={item.id}>
            <Link to={item.url}>
              {item.svg}
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </footer>
  );
};

export default Footer;
