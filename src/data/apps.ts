import type { Lang } from '../i18n/utils';

export type AppStatus = 'available' | 'comingSoon';

export interface AppLandingContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  flowTitle: string;
  flowSubtitle: string;
  flow: Array<{
    title: string;
    body: string;
  }>;
  featuresTitle: string;
  features: Array<{
    title: string;
    body: string;
  }>;
  privacyTitle: string;
  privacyBody: string;
  ctaTitle: string;
  ctaBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface AppEntry {
  slug: string;
  name: string;
  status: AppStatus;
  accent: string;
  category: Record<Lang, string>;
  description: Record<Lang, string>;
  highlight: Record<Lang, string>;
  tags: Record<Lang, string[]>;
  landing: Record<Lang, AppLandingContent>;
}

export const apps: AppEntry[] = [
  {
    slug: 'finance-os',
    name: 'Finance OS',
    status: 'available',
    accent: 'from-emerald-300/20 via-brand/10 to-sky-300/10',
    category: {
      en: 'Personal finance',
      es: 'Finanzas personales',
    },
    description: {
      en: 'A local app to review transactions, understand spending, and build budgets by period.',
      es: 'Una app local para revisar movimientos, entender gastos y construir presupuestos por periodo.',
    },
    highlight: {
      en: 'Upload, review, and understand your financial data without handing it to another cloud dashboard.',
      es: 'Carga, revisa y entiende tus datos financieros sin entregarlos a otro dashboard en la nube.',
    },
    tags: {
      en: ['Local data', 'AI-assisted review', 'Budgets'],
      es: ['Datos locales', 'Revisión con IA', 'Presupuestos'],
    },
    landing: {
      en: {
        eyebrow: 'Available app',
        title: 'Finance OS',
        subtitle: 'Your local system for understanding transactions, spending, and personal budgets.',
        body:
          'Finance OS runs as a local app inside Forger. Upload your movements, review categories, understand where your money goes, and build budgets by period with help from a contextual AI layer.',
        flowTitle: 'A guided trip through your finances',
        flowSubtitle:
          'Start with a structure that matches how you think, let the app help with the first pass, and keep final control over every movement and budget.',
        flow: [
          {
            title: 'Create your categories',
            body: 'Begin with a Simple or Organized setup, then adjust the structure to match your own way of tracking money.',
          },
          {
            title: 'Load movements',
            body: 'Upload files or add a movement manually. The AI reads what it can, suggests categories, and can help create missing ones.',
          },
          {
            title: 'Review the details',
            body: 'Confirm categories, fix dates, and recategorize anything that needs a human decision before it reaches the dashboard.',
          },
          {
            title: 'Set budgets',
            body: 'See spending by category and ask the assistant for a starting budget recommendation based on your real movements.',
          },
          {
            title: 'Adapt the app',
            body: 'If you want a different workflow, talk to the chat. You can restructure categories or request concrete UI changes conversationally.',
          },
        ],
        featuresTitle: 'Built for personal control',
        features: [
          {
            title: 'Smart categories',
            body: 'Use AI assistance to review and improve transaction categories without treating automation as perfect.',
          },
          {
            title: 'Budgets by period',
            body: 'Follow monthly or custom-period budgets and compare them against actual spending.',
          },
          {
            title: 'Adaptable dashboard',
            body: 'Ask Forger for concrete local changes, like adding an income vs. expenses chart.',
          },
        ],
        privacyTitle: 'Financial data stays local',
        privacyBody:
          'Finance OS is installed in your private Forger workspace. It works with the files and data you choose to bring into the app.',
        ctaTitle: 'Install Finance OS with Forger',
        ctaBody:
          'Start with Forger Desktop, then install Finance OS as one of the first open-source apps in the ecosystem.',
        ctaPrimary: 'Download Forger',
        ctaSecondary: 'Back to apps',
      },
      es: {
        eyebrow: 'App disponible',
        title: 'Finance OS',
        subtitle: 'Tu sistema local para entender movimientos, gastos y presupuestos personales.',
        body:
          'Finance OS corre como una app local dentro de Forger. Carga tus movimientos, revisa categorías, entiende en qué se va tu dinero y construye presupuestos por periodo con ayuda de una capa de IA contextual.',
        flowTitle: 'Un recorrido guiado por tus finanzas',
        flowSubtitle:
          'Parte con una estructura que calce con tu forma de pensar, deja que la app ayude en la primera pasada y mantén el control final sobre cada movimiento y presupuesto.',
        flow: [
          {
            title: 'Crea tus categorías',
            body: 'Empieza con una configuración Simple u Organizada, y luego ajusta la estructura a tu propia forma de ordenar la plata.',
          },
          {
            title: 'Carga movimientos',
            body: 'Sube archivos o agrega un movimiento manual. La IA lee lo que puede, propone categorías y puede ayudarte a crear las que falten.',
          },
          {
            title: 'Revisa los detalles',
            body: 'Confirma categorías, corrige fechas y recategoriza lo que necesite una decisión humana antes de llegar al dashboard.',
          },
          {
            title: 'Define presupuestos',
            body: 'Mira tus gastos por categoría y pídele al asistente una recomendación inicial de presupuesto basada en tus movimientos reales.',
          },
          {
            title: 'Adapta la app',
            body: 'Si quieres otro flujo, conversa con el chat. Puedes reestructurar categorías o pedir cambios concretos en la interfaz.',
          },
        ],
        featuresTitle: 'Diseñado para mantener control',
        features: [
          {
            title: 'Categorías inteligentes',
            body: 'Usa asistencia de IA para revisar y mejorar categorías sin tratar la automatización como perfecta.',
          },
          {
            title: 'Presupuestos por periodo',
            body: 'Sigue presupuestos mensuales o por periodos personalizados y compáralos con el gasto real.',
          },
          {
            title: 'Dashboard adaptable',
            body: 'Pide cambios locales concretos a Forger, como agregar un gráfico de ingresos vs. egresos.',
          },
        ],
        privacyTitle: 'Tus datos financieros se quedan locales',
        privacyBody:
          'Finance OS se instala en tu workspace privado de Forger. Trabaja con los archivos y datos que tú decides cargar en la app.',
        ctaTitle: 'Instala Finance OS con Forger',
        ctaBody:
          'Empieza con Forger Desktop y luego instala Finance OS como una de las primeras apps open-source del ecosistema.',
        ctaPrimary: 'Descargar Forger',
        ctaSecondary: 'Volver a apps',
      },
    },
  },
];

export function getApp(slug: string): AppEntry | undefined {
  return apps.find((app) => app.slug === slug);
}
