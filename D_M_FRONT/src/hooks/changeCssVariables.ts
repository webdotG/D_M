// root.style.setProperty('--theme-default-header', `var(--theme-${theme}-header)`)
// --ФОРМАТ CSS ПЕРЕМЕННОЙ
// --theme-light-УНИКАЛЬНОЕ_ИМЯ    
// --theme-dark-УНИКАЛЬНОЕ_ИМЯ  
// --theme-mordor-УНИКАЛЬНОЕ_ИМЯ       
// --theme-default-УНИКАЛЬНОЕ_ИМЯ   

export const changeCssVariables = (theme: string) => {
    const root = document.querySelector(':root') as HTMLElement;
  
      if(root) {
  
        const cssVariables = [
          'layout-background',
        ]
        
        cssVariables.forEach((element) => {
          root.style.setProperty(
            `--theme-default-${element}`,
            `var(--theme-${theme}-${element})`
          )
        })
      
      } else {
        console.error('Корневой элемент не найден.');
      }
  
  }
  
      
  