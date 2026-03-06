import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AutoResponderManager from '../components/tickets/AutoResponderManager';
import TicketRulesManager from '../components/tickets/TicketRulesManager';
import NotificationSettings from '../components/settings/NotificationSettings';
import WebhookManager from '../components/settings/WebhookManager';
import SlackIntegration from '../components/settings/SlackIntegration';
import DashboardBuilder from '../components/dashboard/DashboardBuilder';
import BulkExportImport from '../components/tickets/BulkExportImport';
import AdvancedMetricsPanel from '../components/analytics/AdvancedMetricsPanel';
import SLAPolicyManager from '../components/sla/SLAPolicyManager';
import AuditLogViewer from '../components/audit/AuditLogViewer';
import PerformanceMetrics from '../components/analytics/PerformanceMetrics';
import SavedFiltersManager from '../components/filters/SavedFiltersManager';
import ReportBuilder from '../components/reports/ReportBuilder';
import KnowledgeBaseViewer from '../components/knowledge/KnowledgeBaseViewer';
import KnowledgeBaseEditor from '../components/knowledge/KnowledgeBaseEditor';
import PortalConfigManager from '../components/portal/PortalConfigManager';
import EmailTemplateManager from '../components/email/EmailTemplateManager';
import EmailNotificationSetup from '../components/email/EmailNotificationSetup';
import ThemeManager from '../components/customization/ThemeManager';
import BrandingManager from '../components/customization/BrandingManager';
import APIDocumentation from '../components/api/APIDocumentation';
import APIKeyManager from '../components/api/APIKeyManager';
import WebhookBuilder from '../components/webhooks/WebhookBuilder';
import WebhookLogs from '../components/webhooks/WebhookLogs';
import LanguageManager from '../components/i18n/LanguageManager';
import SurveyManager from '../components/settings/SurveyManager';
import CustomFieldsManager from '../components/settings/CustomFieldsManager';
import AutomationBuilder from '../components/settings/AutomationBuilder';
import KnowledgeBaseManager from '../components/settings/KnowledgeBaseManager';
import AdvancedFieldBuilderIntegration from '../components/builders/AdvancedFieldBuilderIntegration';
import AdvancedRuleBuilderIntegration from '../components/builders/AdvancedRuleBuilderIntegration';
import AttachmentManagerIntegration from '../components/builders/AttachmentManagerIntegration';
import LaunchChecklist from '../components/documentation/LaunchChecklist';
import ReleaseNotesV1 from '../components/documentation/ReleaseNotesV1';
import SecurityAuditReport from '../components/documentation/SecurityAuditReport';
import PageLayout from '../components/common/PageLayout';
import Analytics from '../components/Analytics';

export default function SettingsPage() {
  return (
    <>
      <Analytics eventName="settings_page_view" />
      <PageLayout title="Configurações" subtitle="Gerencie automações, respostas e notificações do seu sistema">
        <Tabs defaultValue="responders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 md:grid-cols-8 lg:grid-cols-12 text-xs overflow-x-auto">
            <TabsTrigger value="launch">🚀 Checklist</TabsTrigger>
            <TabsTrigger value="release-notes">📋 Release</TabsTrigger>
            <TabsTrigger value="security">🔒 Security</TabsTrigger>
            <TabsTrigger value="responders">Auto-Responders</TabsTrigger>
            <TabsTrigger value="rules">Regras</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="slack">Slack</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="sla">SLA</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="audit">Auditoria</TabsTrigger>
            <TabsTrigger value="filters">Filtros</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="surveys">📊 Surveys</TabsTrigger>
            <TabsTrigger value="custom-fields">⚙️ Campos Custom</TabsTrigger>
            <TabsTrigger value="automation">🤖 Automação</TabsTrigger>
            <TabsTrigger value="kb-manager">📚 KB Manager</TabsTrigger>
            <TabsTrigger value="kb-editor">📝 Criar KB</TabsTrigger>
            <TabsTrigger value="kb-viewer">📚 Base de Conhecimento</TabsTrigger>
            <TabsTrigger value="portal">🌐 Portal Cliente</TabsTrigger>
            <TabsTrigger value="email-templates">📧 Templates</TabsTrigger>
            <TabsTrigger value="email-setup">📬 Email</TabsTrigger>
            <TabsTrigger value="themes">🎨 Temas</TabsTrigger>
            <TabsTrigger value="branding">🏢 Branding</TabsTrigger>
            <TabsTrigger value="api-keys">🔑 Chaves API</TabsTrigger>
            <TabsTrigger value="api-docs">📖 API Docs</TabsTrigger>
            <TabsTrigger value="field-builder">🔧 Field Builder</TabsTrigger>
            <TabsTrigger value="rule-builder">📋 Rule Builder</TabsTrigger>
            <TabsTrigger value="attachment">📎 Attachments</TabsTrigger>
            <TabsTrigger value="languages">🌐 Idiomas</TabsTrigger>
            </TabsList>

          <TabsContent value="launch">
            <LaunchChecklist />
          </TabsContent>

          <TabsContent value="release-notes">
            <ReleaseNotesV1 />
          </TabsContent>

          <TabsContent value="security">
            <SecurityAuditReport />
          </TabsContent>

          <TabsContent value="responders">
            <AutoResponderManager />
          </TabsContent>

          <TabsContent value="rules">
            <TicketRulesManager />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="webhooks">
            <WebhookManager />
          </TabsContent>

          <TabsContent value="slack">
            <SlackIntegration />
          </TabsContent>

          <TabsContent value="dashboards">
            <DashboardBuilder />
          </TabsContent>

          <TabsContent value="export">
            <BulkExportImport />
          </TabsContent>

          <TabsContent value="sla">
            <SLAPolicyManager />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedMetricsPanel />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMetrics />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogViewer />
          </TabsContent>

          <TabsContent value="filters">
            <SavedFiltersManager />
          </TabsContent>

          <TabsContent value="reports">
            <ReportBuilder />
          </TabsContent>

          <TabsContent value="kb-editor">
            <KnowledgeBaseEditor />
          </TabsContent>

          <TabsContent value="kb-viewer">
            <KnowledgeBaseViewer />
          </TabsContent>

          <TabsContent value="portal">
            <PortalConfigManager />
          </TabsContent>

          <TabsContent value="email-templates">
            <EmailTemplateManager />
          </TabsContent>

          <TabsContent value="email-setup">
            <EmailNotificationSetup />
          </TabsContent>

          <TabsContent value="themes">
            <ThemeManager />
          </TabsContent>

          <TabsContent value="branding">
            <BrandingManager />
          </TabsContent>

          <TabsContent value="api-keys">
            <APIKeyManager />
          </TabsContent>

          <TabsContent value="api-docs">
            <APIDocumentation />
          </TabsContent>

          <TabsContent value="webhooks">
            <div className="space-y-6">
              <WebhookBuilder />
              <WebhookLogs />
            </div>
          </TabsContent>

          <TabsContent value="surveys">
            <SurveyManager />
          </TabsContent>

          <TabsContent value="custom-fields">
            <CustomFieldsManager />
          </TabsContent>

          <TabsContent value="automation">
            <AutomationBuilder />
          </TabsContent>

          <TabsContent value="kb-manager">
            <KnowledgeBaseManager />
          </TabsContent>

          <TabsContent value="field-builder">
            <AdvancedFieldBuilderIntegration />
          </TabsContent>

          <TabsContent value="rule-builder">
            <AdvancedRuleBuilderIntegration />
          </TabsContent>

          <TabsContent value="attachment">
            <AttachmentManagerIntegration />
          </TabsContent>

          <TabsContent value="languages">
            <LanguageManager />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </>
  );
}