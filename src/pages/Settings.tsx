import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Clock, Globe, LockKeyhole, Mail, Shield, Users2 } from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "../contexts/SettingsContext";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ThemeToggle } from "../components/theme-toggle";

export default function Settings() {
  const { settings, loading, updateSetting, saveSettings, setAnimations, setCompactView } =
    useSettings();

  const handleSave = () => {
    saveSettings();
  };

  const handleThemeColorChange = (color: string) => {
    // In a real app, this would update theme colors
    document.documentElement.style.setProperty("--primary", color);
    toast.success("Theme color updated!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your hotel system preferences and settings
            </p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-fit">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your hotel management system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hotel-name">Hotel Name</Label>
                  <Input
                    id="hotel-name"
                    value={settings.hotelName}
                    onChange={(e) => updateSetting("hotelName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel-address">Hotel Address</Label>
                  <Textarea
                    id="hotel-address"
                    value={settings.hotelAddress}
                    onChange={(e) => updateSetting("hotelAddress", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSetting("contactEmail", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    value={settings.contactPhone}
                    onChange={(e) => updateSetting("contactPhone", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={settings.currency}
                      onChange={(e) => updateSetting("currency", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="timezone"
                        value={settings.timezone}
                        onChange={(e) => updateSetting("timezone", e.target.value)}
                      />
                      <Button variant="outline" size="icon">
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="language"
                      value={settings.language}
                      onChange={(e) => updateSetting("language", e.target.value)}
                    />
                    <Button variant="outline" size="icon">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Check-in Time</Label>
                    <p className="text-sm text-muted-foreground">Default time for guest check-in</p>
                  </div>
                  <Input
                    className="w-[180px]"
                    value={settings.checkInTime}
                    onChange={(e) => updateSetting("checkInTime", e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Check-out Time</Label>
                    <p className="text-sm text-muted-foreground">
                      Default time for guest check-out
                    </p>
                  </div>
                  <Input
                    className="w-[180px]"
                    value={settings.checkOutTime}
                    onChange={(e) => updateSetting("checkOutTime", e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Notifications</Label>
                    <p className="text-sm text-muted-foreground">In-app notification alerts</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Booking Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new bookings</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Inventory Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get alerts when supplies are low
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Reminders for scheduled maintenance
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive daily summary reports</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure your security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after inactivity
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      className="w-[100px]"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value))}
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password Requirements</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={settings.passwordRequirements.uppercase}
                        onCheckedChange={(checked) =>
                          updateSetting("passwordRequirements", {
                            ...settings.passwordRequirements,
                            uppercase: checked,
                          })
                        }
                      />
                      <Label>Require uppercase letters</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={settings.passwordRequirements.numbers}
                        onCheckedChange={(checked) =>
                          updateSetting("passwordRequirements", {
                            ...settings.passwordRequirements,
                            numbers: checked,
                          })
                        }
                      />
                      <Label>Require numbers</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={settings.passwordRequirements.specialChars}
                        onCheckedChange={(checked) =>
                          updateSetting("passwordRequirements", {
                            ...settings.passwordRequirements,
                            specialChars: checked,
                          })
                        }
                      />
                      <Label>Require special characters</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={settings.passwordRequirements.minLength >= 8}
                        onCheckedChange={(checked) =>
                          updateSetting("passwordRequirements", {
                            ...settings.passwordRequirements,
                            minLength: checked ? 8 : 6,
                          })
                        }
                      />
                      <Label>Minimum 8 characters</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <LockKeyhole className="h-4 w-4" />
                    Change Password
                  </Button>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security Audit Log
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Security Settings"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                    </div>
                    <ThemeToggle />
                  </div>

                  <div className="border-t pt-4">
                    <Label className="block mb-3">Color Theme</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { color: "#1a1f2c", label: "Dark Blue" },
                        { color: "#0f172a", label: "Navy" },
                        { color: "#172554", label: "Royal Blue" },
                        { color: "#083344", label: "Teal" },
                        { color: "#2d3748", label: "Slate" },
                      ].map((themeColor, i) => (
                        <button
                          key={i}
                          onClick={() => handleThemeColorChange(themeColor.color)}
                          className="h-8 rounded-md cursor-pointer border-2 border-transparent hover:border-primary transition-all"
                          style={{ backgroundColor: themeColor.color }}
                          title={themeColor.label}
                          aria-label={`Change theme color to ${themeColor.label}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">A</span>
                      <Input
                        type="range"
                        className="flex-1"
                        min="0"
                        max="100"
                        value={50}
                        onChange={(e) => {
                          // Update font size using CSS variables
                          document.documentElement.style.setProperty(
                            "--font-size-factor",
                            `${parseInt(e.target.value) / 50}`
                          );
                        }}
                      />
                      <span className="text-lg font-semibold text-muted-foreground">A</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact View</Label>
                      <p className="text-sm text-muted-foreground">
                        Show more content with less spacing
                      </p>
                    </div>
                    <Switch checked={settings.compactView} onCheckedChange={setCompactView} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable UI animations and transitions
                      </p>
                    </div>
                    <Switch checked={settings.animations} onCheckedChange={setAnimations} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Appearance"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage system users and permissions</CardDescription>
                  </div>
                  <Button>
                    <Users2 className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Admin User", email: "admin@luxurysuites.com", role: "Administrator" },
                    { name: "Front Desk", email: "frontdesk@luxurysuites.com", role: "Staff" },
                    { name: "Housekeeping", email: "housekeeping@luxurysuites.com", role: "Staff" },
                  ].map((user, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-3.5 w-3.5 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.role === "Administrator" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>Configure what different roles can access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md divide-y">
                    <div className="p-3 bg-muted/50">
                      <div className="grid grid-cols-5 gap-4">
                        <div className="col-span-2 font-medium">Feature</div>
                        <div className="text-center font-medium">Admin</div>
                        <div className="text-center font-medium">Manager</div>
                        <div className="text-center font-medium">Staff</div>
                      </div>
                    </div>

                    {[
                      "Dashboard Access",
                      "Room Management",
                      "Guest Management",
                      "Reservation System",
                      "Financial Reports",
                      "Staff Management",
                      "System Settings",
                    ].map((feature, i) => (
                      <div key={i} className="p-3">
                        <div className="grid grid-cols-5 gap-4">
                          <div className="col-span-2">{feature}</div>
                          <div className="flex justify-center">
                            <Switch defaultChecked />
                          </div>
                          <div className="flex justify-center">
                            <Switch defaultChecked={i < 5} />
                          </div>
                          <div className="flex justify-center">
                            <Switch defaultChecked={i < 3} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Permissions</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
