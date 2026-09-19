import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import CtaSection from '../components/HomePageComponent/CtaSection'
import FeaturesSection from '../components/HomePageComponent/FeaturesSection'
import FinancialPreviewSection from '../components/HomePageComponent/FinancialPreviewSection'
import HeroSection from '../components/HomePageComponent/HeroSection'
import HowItWorksSection from '../components/HomePageComponent/HowItWorksSection'
import NepalFirstSection from '../components/HomePageComponent/NepalFirstSection'
import TestimonialsSection from '../components/HomePageComponent/TestimonialsSection'

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
