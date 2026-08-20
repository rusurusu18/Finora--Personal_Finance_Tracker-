import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import CtaSection from '../HomePageComponent/CtaSection'
import FeaturesSection from '../HomePageComponent/FeaturesSection'
import FinancialPreviewSection from '../HomePageComponent/FinancialPreviewSection'
import HeroSection from '../HomePageComponent/HeroSection'
import HowItWorksSection from '../HomePageComponent/HowItWorksSection'
import NepalFirstSection from '../HomePageComponent/NepalFirstSection'
import TestimonialsSection from '../HomePageComponent/TestimonialsSection'

export default function Home() {
  const navigate = useNavigate()
  const { loginDemo } = useAuth()

  async function explore() {
    await loginDemo()
    navigate('/dashboard')
  }

  return (
    <div>
      <HeroSection onGetStarted={() => navigate('/register')} onExplore={explore} />
      <FinancialPreviewSection />
      <FeaturesSection />
      <NepalFirstSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection onGetStarted={() => navigate('/register')} />
    </div>
  )
}
