"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { Switch } from "../ui/switch"

export default function SecuritySettings() {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    recoveryPhone: "+1 (555) 123-4567",
    recoveryEmail: "recovery@example.com",
    sessionTimeout: "30",
    passwordLastChanged: "2023-10-15",
    loginHistory: [
      { device: "Chrome on Windows", location: "New York, USA", time: "Today, 10:45 AM", current: true },
      { device: "Firefox on MacOS", location: "San Francisco, USA", time: "Yesterday, 8:30 PM", current: false },
      { device: "Mobile App on iPhone", location: "Chicago, USA", time: "May 10, 2023", current: false },
    ],
    trustedDevices: true,
    loginNotifications: true,
    passwordStrength: "strong",
  })

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    })
  }

  const handleSave = () => {
    console.log("Security Settings:", settings)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
        <p className="text-gray-500">Manage your account security and authentication options</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleChange("twoFactorAuth", checked)}
                />
              </div>

              {settings.twoFactorAuth && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">Two-Factor Authentication Methods</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="radio" id="2fa-app" name="2fa-method" className="mr-2" />
                      <Label htmlFor="2fa-app">Authenticator App</Label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="2fa-sms" name="2fa-method" className="mr-2" />
                      <Label htmlFor="2fa-sms">SMS Verification</Label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="2fa-email" name="2fa-method" className="mr-2" />
                      <Label htmlFor="2fa-email">Email Verification</Label>
                    </div>
                  </div>
                  <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white" size="sm">
                    Set Up Two-Factor Authentication
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Recovery Options</h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="recoveryPhone">Recovery Phone</Label>
                  <Input
                    id="recoveryPhone"
                    type="tel"
                    value={settings.recoveryPhone}
                    onChange={(e) => handleChange("recoveryPhone", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="recoveryEmail">Recovery Email</Label>
                  <Input
                    id="recoveryEmail"
                    type="email"
                    value={settings.recoveryEmail}
                    onChange={(e) => handleChange("recoveryEmail", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Password & Login</h3>

              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-gray-500">Last changed: {settings.passwordLastChanged}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                    min="5"
                    max="1440"
                  />
                  <p className="text-xs text-gray-500">Set to 0 for no timeout</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="trustedDevices">Remember Trusted Devices</Label>
                    <p className="text-sm text-gray-500">Skip 2FA on devices you've previously verified</p>
                  </div>
                  <Switch
                    id="trustedDevices"
                    checked={settings.trustedDevices}
                    onCheckedChange={(checked) => handleChange("trustedDevices", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="loginNotifications">Login Notifications</Label>
                    <p className="text-sm text-gray-500">Get notified of new logins to your account</p>
                  </div>
                  <Switch
                    id="loginNotifications"
                    checked={settings.loginNotifications}
                    onCheckedChange={(checked) => handleChange("loginNotifications", checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Recent Login Activity</h3>

              <div className="space-y-4">
                {settings.loginHistory.map((login, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{login.device}</p>
                      <p className="text-sm text-gray-500">
                        {login.location} • {login.time}
                      </p>
                    </div>
                    {login.current && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Current Session
                      </span>
                    )}
                  </div>
                ))}

                <Button variant="outline" size="sm" className="w-full">
                  View All Login Activity
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700 text-white">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
