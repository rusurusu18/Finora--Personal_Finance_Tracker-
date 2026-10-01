import Badge from '../ui/Badge'
import { useLanguage } from '../../contexts/useLanguage'

export default function StatusPill({ progress }) {
  const { t } = useLanguage()
  if (progress >= 100) return <Badge tone="danger">{t('Over budget')}</Badge>
  if (progress >= 80) return <Badge tone="warning">{t('Watch')}</Badge>
  return <Badge tone="success">{t('On track')}</Badge>
}
