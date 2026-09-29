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

export default function Settings() {
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
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500">Preferences stay in localStorage. Passwords are never saved.</p>
      </div>

      <Card className="p-5">
        <h2 className="font-semibold">Profile</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            id="profile-name"
            label="Name"
            value={profile.name}
            onChange={(event) => setProfile({ ...profile, name: event.target.value })}
          />
          <Input
            id="profile-email"
            label="Email"
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
              push('Profile updated.', 'success')
            } catch (error) {
              push(error.message, 'error')
            }
          }}
        >
          Save profile
        </Button>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold">Appearance</h2>
        <div className="mt-4">
          <Select id="appearance" label="Theme" value={theme} onChange={(event) => setTheme(event.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </Select>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold">Currency</h2>
        <div className="mt-4">
          <Select
            id="currency"
            label="Display currency"
            value={settings.currency}
            onChange={(event) => setSettings({ ...settings, currency: event.target.value })}
          >
            {CURRENCIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} — {item.label}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold">Notifications</h2>
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
              {label}
            </label>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold">Security</h2>
        <p className="mt-1 text-sm text-slate-500">
          Change your password using your current credentials.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            id="current-password"
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="off"
          />
          <Input
            id="new-password"
            label="New password"
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
              push('Password updated.', 'success')
            } catch (error) {
              setPasswordError(error.message)
            }
          }}
        >
          Update password
        </Button>
        {passwordError ? <p className="mt-3 text-sm text-red-600">{passwordError}</p> : null}
      </Card>

    </div>
  )
}
