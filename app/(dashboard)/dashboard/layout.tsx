import DashboardLayout from '@/components/dashboard/layout/Layout';
import { FormLanguageProvider } from '@/context/FormLanguageContext';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <FormLanguageProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </FormLanguageProvider>
  );
};

export default Layout;