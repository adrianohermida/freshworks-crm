import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, HelpCircle, FileText } from 'lucide-react';

export default function UserDocumentation() {
  const [selectedTab, setSelectedTab] = useState('guides');

  const guides = [
    {
      title: 'Getting Started Guide',
      sections: [
        { heading: 'First Login', content: 'Use your email to log in. If you forgot your password, click "Forgot Password".' },
        { heading: 'Navigation', content: 'Main menu on the left contains: Dashboard, Processes, Deadlines, Publications, Contacts, Agenda.' },
        { heading: 'Your Profile', content: 'Click your avatar → "Meu Perfil" to view and edit your information.' }
      ]
    },
    {
      title: 'Processes Management',
      sections: [
        { heading: 'Adding a Process', content: 'Click "Add Process" → Enter CNJ number or search existing → Click "Add".' },
        { heading: 'Viewing Details', content: 'Click on any process to see movements, deadlines, and related contacts.' },
        { heading: 'Searching', content: 'Use the search bar to find processes by CNJ number or title.' },
        { heading: 'Filters', content: 'Filter by status, tribunal, or date range on the Processes page.' }
      ]
    },
    {
      title: 'Deadlines Management',
      sections: [
        { heading: 'Create Deadline', content: 'Select a process → Click "Add Deadline" → Set date, priority, and description.' },
        { heading: 'Alerts', content: 'You\'ll receive notifications 24 hours before a deadline.' },
        { heading: 'Mark Complete', content: 'Check the checkbox next to a deadline to mark it as completed.' }
      ]
    },
    {
      title: 'Contacts Management',
      sections: [
        { heading: 'Add Contact', content: 'Go to Contacts → Click "Add Contact" → Fill in details (name, email, phone).' },
        { heading: 'Associate to Processes', content: 'Edit a contact → Select associated processes → Save.' },
        { heading: 'Contact Types', content: 'Contact, Advogado (Lawyer), Parte (Party), Cliente (Client).' }
      ]
    }
  ];

  const faq = [
    { q: 'How do I reset my password?', a: 'Click "Forgot Password" on login page and follow the email instructions.' },
    { q: 'Can I share a process with a colleague?', a: 'Not in v1.0, but you can invite users to the platform with specific roles.' },
    { q: 'How often is data synced with DataJud?', a: 'Automatic sync every 30 minutes, or manual sync via "Sync Now" button.' },
    { q: 'What\'s the difference between "Draft" and "Active" status?', a: 'Draft processes are not synced. Active processes sync automatically.' },
    { q: 'Can I export my data?', a: 'Yes, use the Export button on the Processes page to download as CSV/PDF.' },
    { q: 'Is my data secure?', a: 'Yes, all data is encrypted (AES-256) and complies with LGPD (Brazilian data protection law).' }
  ];

  const tutorials = [
    { title: 'Adding Your First Process (5 min)', url: '#' },
    { title: 'Managing Deadlines (3 min)', url: '#' },
    { title: 'Setting Up Contacts (4 min)', url: '#' },
    { title: 'Using Advanced Filters (6 min)', url: '#' },
    { title: 'Exporting & Reporting (5 min)', url: '#' }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-cyan-600" />
        <div>
          <h1 className="text-3xl font-bold">User Documentation</h1>
          <p className="text-gray-600 dark:text-gray-400">Complete guides and tutorials for DataJud v1.0.0</p>
        </div>
      </div>

      {/* TABS */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>

        {/* GUIDES */}
        <TabsContent value="guides" className="space-y-6">
          {guides.map((guide, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-base">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {guide.sections.map((section, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sm mb-2">{section.heading}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      {section.content}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="space-y-3">
          {faq.map((item, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-600" />
                  {item.q}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  {item.a}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* VIDEOS */}
        <TabsContent value="videos" className="space-y-4">
          {tutorials.map((tutorial, idx) => (
            <Card key={idx} className="cursor-pointer hover:shadow-lg transition">
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-red-600" />
                  <p className="font-semibold">{tutorial.title}</p>
                </div>
                <Badge>YouTube</Badge>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="pt-6 text-sm text-blue-900 dark:text-blue-100">
              <p>📺 <strong>Video Channel:</strong> youtube.com/@DataJudLegal</p>
              <p className="mt-2">All tutorials are available in Portuguese with English subtitles.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DOWNLOADS */}
        <TabsContent value="downloads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentation Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-between">
                <p className="font-semibold text-sm">User Manual (PDF)</p>
                <Badge className="bg-blue-600 cursor-pointer">Download</Badge>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-between">
                <p className="font-semibold text-sm">Quick Start Guide (PDF)</p>
                <Badge className="bg-blue-600 cursor-pointer">Download</Badge>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-between">
                <p className="font-semibold text-sm">Keyboard Shortcuts (PDF)</p>
                <Badge className="bg-blue-600 cursor-pointer">Download</Badge>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-between">
                <p className="font-semibold text-sm">API Documentation (PDF)</p>
                <Badge className="bg-blue-600 cursor-pointer">Download</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardContent className="pt-6 text-sm text-green-900 dark:text-green-100">
              <p>✅ <strong>Available in:</strong> Portuguese (Português), English</p>
              <p className="mt-2">📦 <strong>File Formats:</strong> PDF, HTML, Markdown</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SUPPORT */}
      <Card className="bg-cyan-50 dark:bg-cyan-900/20">
        <CardHeader>
          <CardTitle className="text-base text-cyan-900 dark:text-cyan-100">
            💬 Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-cyan-900 dark:text-cyan-100 space-y-2">
          <p>📧 <strong>Email Support:</strong> support@datajud.com</p>
          <p>💬 <strong>Live Chat:</strong> Available 9am-6pm (Manaus time, Mon-Fri)</p>
          <p>📞 <strong>Phone:</strong> +55-92-XXXX-XXXX</p>
          <p>🎓 <strong>Training:</strong> Schedule a session with our team</p>
          <p className="mt-3">Average response time: 2 hours</p>
        </CardContent>
      </Card>
    </div>
  );
}