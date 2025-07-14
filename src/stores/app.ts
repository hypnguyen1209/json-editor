import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
    // State
    const isDarkMode = ref(false)
    const currentFormat = ref<'json' | 'yaml' | 'csv' | 'xml' | 'toml'>('json')
    const inputData = ref('')
    const parsedData = ref<any>(null)
    const validationErrors = ref<string[]>([])

    // Computed
    const isValidData = computed(() => validationErrors.value.length === 0)

    // Actions
    const toggleTheme = () => {
        isDarkMode.value = !isDarkMode.value
        localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    }

    const toggleDarkMode = () => {
        isDarkMode.value = !isDarkMode.value
        localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    }

    const setInputData = (data: string) => {
        inputData.value = data
    }

    const setParsedData = (data: any) => {
        parsedData.value = data
    }

    const setValidationErrors = (errors: string[]) => {
        validationErrors.value = errors
    }

    const setCurrentFormat = (format: 'json' | 'yaml' | 'csv' | 'xml' | 'toml') => {
        currentFormat.value = format
    }

    // Initialize theme from localStorage
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            isDarkMode.value = savedTheme === 'dark'
        } else {
            // Check system preference
            isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
    }

    return {
        isDarkMode,
        currentFormat,
        inputData,
        parsedData,
        validationErrors,
        isValidData,
        toggleTheme,
        toggleDarkMode,
        setInputData,
        setParsedData,
        setValidationErrors,
        setCurrentFormat,
        initTheme
    }
})
