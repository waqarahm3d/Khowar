import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider, theme } from 'antd';
import { ThemeProvider } from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/ur';
import 'dayjs/locale/en';

import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MusicManagementPage } from './pages/MusicManagementPage';
import { ArtistManagementPage } from './pages/ArtistManagementPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CulturalEventsPage } from './pages/CulturalEventsPage';
import { pakistaniTheme, globalStyles } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';

// Configure dayjs with Urdu locale
dayjs.locale('ur');

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={pakistaniTheme}>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              // Pakistani cultural colors
              colorPrimary: '#01411C',        // Pakistan Green
              colorSuccess: '#28A745',
              colorWarning: '#FFC107',
              colorError: '#DC3545',
              colorInfo: '#17A2B8',
              
              // Typography
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: 14,
              
              // Spacing
              borderRadius: 8,
              
              // Cultural accent colors
              colorBgContainer: '#FFFFFF',
              colorBgElevated: '#FFFFFF',
              colorBorder: '#D9D9D9',
              colorText: '#212529',
              colorTextSecondary: '#6C757D',
              
              // Pakistani cultural gradients
              colorBgSpotlight: '#F0F8F0',
            },
            components: {
              Layout: {
                headerBg: '#01411C',
                headerHeight: 64,
                siderBg: '#FFFFFF',
                bodyBg: '#F8F9FA',
              },
              Menu: {
                itemBg: 'transparent',
                itemSelectedBg: '#E8F5E8',
                itemSelectedColor: '#01411C',
                itemHoverBg: '#F0F8F0',
                itemHoverColor: '#01411C',
                iconSize: 16,
              },
              Button: {
                borderRadius: 8,
                controlHeight: 40,
                fontWeight: 500,
              },
              Card: {
                borderRadius: 12,
                headerBg: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              },
              Table: {
                headerBg: '#F8F9FA',
                headerColor: '#01411C',
                borderColor: '#E9ECEF',
              },
              Form: {
                labelColor: '#01411C',
                labelFontSize: 14,
                labelFontWeight: 500,
              },
              Input: {
                borderRadius: 8,
                controlHeight: 40,
              },
              Select: {
                borderRadius: 8,
                controlHeight: 40,
              },
              DatePicker: {
                borderRadius: 8,
                controlHeight: 40,
              },
              Upload: {
                borderRadius: 8,
              },
              Tabs: {
                itemColor: '#6C757D',
                itemSelectedColor: '#01411C',
                itemHoverColor: '#01411C',
                inkBarColor: '#FF9933',
              },
              Progress: {
                defaultColor: '#FF9933',
                remainingColor: '#E9ECEF',
              },
              Tag: {
                borderRadius: 16,
                fontWeight: 500,
              },
              Badge: {
                fontWeight: 600,
              },
              Statistic: {
                titleFontSize: 14,
                contentFontSize: 24,
                contentFontWeight: 600,
              },
              Typography: {
                titleMarginBottom: 16,
                titleMarginTop: 0,
              },
            },
          }}
        >
          <GlobalStyle />
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected Admin Routes */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <AdminLayout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="music" element={<MusicManagementPage />} />
                  <Route path="artists" element={<ArtistManagementPage />} />
                  <Route path="users" element={<UserManagementPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="cultural-events" element={<CulturalEventsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ConfigProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;