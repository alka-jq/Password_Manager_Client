"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Select, SelectItem } from "../ui/select"
import { Separator } from "../ui/separator"
import { Switch } from "../ui/switch"

export default function AppearanceSettings() {
  const [settings, setSettings] = useState({
    theme: "light",
    density: "default",
    fontSize: "medium",
    fontFamily: "sans",
    conversationView: true,
    previewPane: true,
    starredFirst: true,
    importantMarkers: true,
    customThemeColor: "red",
  })

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    })
  }

  const handleSave = () => {
    console.log("Appearance Settings:", settings)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Appearance Settings</h2>
        <p className="text-gray-500">Customize how your email interface looks</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Theme</h3>

              <RadioGroup
                value={settings.theme}
                onValueChange={(value) => handleChange("theme", value)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex flex-col items-center space-y-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                  <div className="w-full h-20 bg-white border rounded-md"></div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">Light</Label>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                  <div className="w-full h-20 bg-gray-900 border rounded-md"></div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">Dark</Label>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                  <div className="w-full h-20 bg-gradient-to-b from-white to-gray-900 border rounded-md"></div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">System</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

             <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Display Options</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="density">Display Density</Label>
            <Select 
              value={settings.density} 
              onValueChange={(value) => handleChange("density", value)}
            >
              <SelectItem value="comfortable">Comfortable</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <Select 
              value={settings.fontSize} 
              onValueChange={(value) => handleChange("fontSize", value)}
            >
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <Select 
              value={settings.fontFamily} 
              onValueChange={(value) => handleChange("fontFamily", value)}
            >
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </Select>
          </div>
        </div>
      </div>



            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Layout Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="conversationView">Conversation View</Label>
                    <p className="text-sm text-gray-500">Group emails into conversations</p>
                  </div>
                  <Switch
                    id="conversationView"
                    checked={settings.conversationView}
                    onCheckedChange={(checked) => handleChange("conversationView", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="previewPane">Reading Pane</Label>
                    <p className="text-sm text-gray-500">Show email preview alongside list</p>
                  </div>
                  <Switch
                    id="previewPane"
                    checked={settings.previewPane}
                    onCheckedChange={(checked) => handleChange("previewPane", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="starredFirst">Starred First</Label>
                    <p className="text-sm text-gray-500">Show starred emails at the top</p>
                  </div>
                  <Switch
                    id="starredFirst"
                    checked={settings.starredFirst}
                    onCheckedChange={(checked) => handleChange("starredFirst", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="importantMarkers">Important Markers</Label>
                    <p className="text-sm text-gray-500">Show importance indicators</p>
                  </div>
                  <Switch
                    id="importantMarkers"
                    checked={settings.importantMarkers}
                    onCheckedChange={(checked) => handleChange("importantMarkers", checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Theme Color</h3>

              <RadioGroup
                value={settings.customThemeColor}
                onValueChange={(value) => handleChange("customThemeColor", value)}
                className="grid grid-cols-2 md:grid-cols-5 gap-4"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-red-600 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="red" id="color-red" />
                    <Label htmlFor="color-red">Red</Label>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="blue" id="color-blue" />
                    <Label htmlFor="color-blue">Blue</Label>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-green-600 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="green" id="color-green" />
                    <Label htmlFor="color-green">Green</Label>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-purple-600 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="purple" id="color-purple" />
                    <Label htmlFor="color-purple">Purple</Label>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-orange-600 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="orange" id="color-orange" />
                    <Label htmlFor="color-orange">Orange</Label>
                  </div>
                </div>
              </RadioGroup>
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
