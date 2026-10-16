import { PreferencesProvider, usePreferences } from './PreferencesContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Tree: Exam4 (acts as App) > PreferencesProvider > Dashboard > Toolbar > PreferencesPanel
// ArticlePreview is a child of Dashboard. No preference props are passed anywhere.
// shadcn dark mode = a "dark" class on a parent, so Dashboard sets it from the theme.

function PreferencesPanel() {
  const { theme, fontSize, toggleTheme, setFontSize } = usePreferences();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={toggleTheme}>Theme: {theme}</Button>
      {[14, 16, 18].map((size) => (
        <Button key={size} variant={fontSize === size ? 'default' : 'outline'} onClick={() => setFontSize(size)}>
          {size}px
        </Button>
      ))}
    </div>
  );
}

function Toolbar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Toolbar</CardTitle>
      </CardHeader>
      <CardContent>
        <PreferencesPanel />
      </CardContent>
    </Card>
  );
}

function ArticlePreview() {
  const { fontSize } = usePreferences();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Preview</CardTitle>
        <CardDescription>Font size: {fontSize}px</CardDescription>
      </CardHeader>
      <CardContent style={{ fontSize: `${fontSize}px` }}>
        Hooks let function components use state and other React features without classes.
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { theme } = usePreferences();
  return (
    <section className={theme === 'dark' ? 'dark' : ''}>
      <div className="space-y-3 rounded-xl bg-background p-4 text-foreground ring-1 ring-border">
        <h3 className="font-semibold">Dashboard ({theme} theme)</h3>
        <Toolbar />
        <ArticlePreview />
      </div>
    </section>
  );
}

export default function Exam4() {
  return (
    <PreferencesProvider>
      <h2 className="mb-4 text-xl font-semibold">Application Preferences</h2>
      <Dashboard />
    </PreferencesProvider>
  );
}
