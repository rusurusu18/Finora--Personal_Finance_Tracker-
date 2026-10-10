import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../components/ui/Toast'
import { changePasswordRequest } from '../../config/services'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { CURRENCIES } from '../../utils/constants'
import { useLanguage } from '../../contexts/useLanguage'

// Settings page for app preferences and financial configuration.

export default function Settings() {
  const { t } = useLanguage()
  const { user, updateProfile } = useAuth()
  const { theme, setTheme } = useTheme()
  const { settings, setSettings } = useFinance()
  const { push } = useToast()
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('Settings')}</h1>
        <p className="text-sm text-slate-500">{t('Preferences stay in localStorage. Passwords are never saved.')}</p>
      </div>

      <Card className="p-5">
        <h2 className="font-semibold">{t('Profile')}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            id="profile-name"
            label={t('Name')}
            value={profile.name}
            onChange={(event) => setProfile({ ...profile, name: event.target.value })}
          />
          <Input
            id="profile-email"
            label={t('Email')}
            type="email"
            value={profile.email}
            readOnly
          />
        </div>
        <Button
          className="mt-4"
          onClick={async () => {
            try {
              await updateProfile(profile)
              push(t('Profile updated.'), 'success')
            } catch (error) {
              push(error.message, 'error')
            }
          }}
        >
          {t('Save profile')}
        </Button>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold">{t('Appearance')}</h2>
        <div className="mt-4">
          <Select id="appearance" label={t('Theme')} value={theme} onChange={(event) => setTheme(event.target.value)}>
            <option value="light">{t('Light')}</option>
            <option value="dark">{t('Dark')}</option>
            <option value="system">{t('System')}</option>
          </Select>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold">{t('Currency')}</h2>
        <div className="mt-4">
          <Select
            id="currency"
            label={t('Display currency')}
            value={settings.currency}
            onChange={(event) => setSettings({ ...settings, currency: event.target.value })}
          >
            {CURRENCIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} — {t(item.label)}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold">{t('Calendar')}</h2>
        <div className="mt-4">
          <Select
            id="calendar"
            label={t('Calendar')}
            value={settings.calendar || 'AD'}
            onChange={(event) => setSettings({ ...settings, calendar: event.target.value })}
          >
            <option value="AD">{t('Gregorian (AD)')}</option>
            <option value="BS">{t('Bikram Sambat (BS)')}</option>
          </Select>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold">{t('Notifications')}</h2>
        <div className="mt-4 space-y-3">
          {[
            ['email', 'Email summaries'],
            ['push', 'Push alerts'],
            ['budgetAlerts', 'Budget alerts'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.notifications[key]}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, [key]: event.target.checked },
                  })
                }
              />
              {t(label)}
            </label>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold">{t('Security')}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {t('Change your password using your current credentials.')}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            id="current-password"
            label={t('Current password')}
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="off"
          />
          <Input
            id="new-password"
            label={t('New password')}
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
          />
        </div>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={async () => {
            setPasswordError('')
            try {
              await changePasswordRequest({ currentPassword, newPassword })
              setCurrentPassword('')
              setNewPassword('')
              push(t('Password updated.'), 'success')
            } catch (error) {
              setPasswordError(error.message)
            }
          }}
        >
          {t('Update password')}
        </Button>
        {passwordError ? <p className="mt-3 text-sm text-red-600">{passwordError}</p> : null}
      </Card>

    </div>
  )
}
