'use client'

import { useEffect } from 'react'
// plain JS module, generated from case-study/effects.js and shared with the standalone file
import { startCaseStudyEffects } from './case-study-effects'

export function CaseStudyEffects() {
  useEffect(() => {
    document.documentElement.classList.add('rv-ready')
    return startCaseStudyEffects()
  }, [])
  return null
}
