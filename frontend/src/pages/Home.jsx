import { useNavigate } from 'react-router-dom'
import CtaSection from '../components/HomePageComponent/CtaSection'
import FeaturesSection from '../components/HomePageComponent/FeaturesSection'
import HeroSection from '../components/HomePageComponent/HeroSection'
import HowItWorksSection from '../components/HomePageComponent/HowItWorksSection'
import NepalFirstSection from '../components/HomePageComponent/NepalFirstSection'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      <HeroSection onGetStarted={() => navigate('/register')} onSignIn={() => navigate('/login')} />
      <FeaturesSection />
      <NepalFirstSection />
      <HowItWorksSection />
      <CtaSection onGetStarted={() => navigate('/register')} />
    </div>
  )
}
