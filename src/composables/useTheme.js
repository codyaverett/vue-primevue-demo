import { ref, watch, onMounted } from 'vue'

const THEME_KEY = 'app-theme'
const currentTheme = ref('light')
const themes = {
  light: 'saga-blue',
  dark: 'arya-blue'
}

export function useTheme() {
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    applyTheme()
  }

  const setTheme = (theme) => {
    currentTheme.value = theme
    applyTheme()
  }

  const applyTheme = () => {
    const theme = currentTheme.value
    const themeLink = document.getElementById('theme-link')
    
    if (themeLink) {
      const themeName = themes[theme]
      themeLink.href = themeLink.href.replace(/themes\/.*\/theme\.css/, `themes/${themeName}/theme.css`)
      
      // Add dark class to body for custom styles
      if (theme === 'dark') {
        document.body.classList.add('dark-theme')
      } else {
        document.body.classList.remove('dark-theme')
      }
      
      // Save preference
      localStorage.setItem(THEME_KEY, theme)
    }
  }

  const initTheme = () => {
    // Add no-transitions class initially to prevent flash
    document.body.classList.add('no-transitions')
    
    // Load saved theme or detect system preference
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      currentTheme.value = savedTheme
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme.value = 'dark'
    }
    
    applyTheme()
    
    // Enable transitions after initial theme is applied
    requestAnimationFrame(() => {
      document.body.classList.remove('no-transitions')
    })
  }

  // Watch for system theme changes
  onMounted(() => {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
          currentTheme.value = e.matches ? 'dark' : 'light'
          applyTheme()
        }
      })
    }
  })

  return {
    currentTheme,
    toggleTheme,
    setTheme,
    initTheme
  }
}