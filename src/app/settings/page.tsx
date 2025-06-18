"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Settings,
  Save,
  RefreshCw,
  Database,
  Bell,
  Shield,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Settings className="h-8 w-8 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select id="language" defaultValue="en">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select id="timezone" defaultValue="UTC">
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">GMT</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_format">Date Format</Label>
                <Select id="date_format" defaultValue="MM/DD/YYYY">
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </Select>
              </div>

              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Email Notifications
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Camera Offline Alerts
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Analytics Reports
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification_email">Notification Email</Label>
                <Input
                  id="notification_email"
                  type="email"
                  placeholder="admin@example.com"
                />
              </div>

              <Button className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data_retention">Data Retention Period</Label>
                <Select id="data_retention" defaultValue="90">
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup_frequency">Backup Frequency</Label>
                <Select id="backup_frequency" defaultValue="daily">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Auto-cleanup old data
                </Label>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Database className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session_timeout">Session Timeout</Label>
                <Select id="session_timeout" defaultValue="30">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Require Two-Factor Authentication
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Audit Logging
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  IP Whitelist
                </Label>
              </div>

              <Button className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Version:</span> 1.0.0
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span className="text-green-600 ml-1">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
