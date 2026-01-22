'use client';
import { useState } from 'react';
import { BookOpen, ChevronRight, ChevronLeft, Globe, Search, Brain, CheckCircle, Rocket, PlayCircle } from 'lucide-react';
import styles from './page.module.css';

const tutorialSteps = [
  {
    id: 1,
    title: "Bienvenue sur SEO Autonome",
    icon: Rocket,
    description: "Cette plateforme utilise l'IA pour optimiser automatiquement le SEO de vos sites web. Suivez ce guide pour découvrir les fonctionnalités principales.",
    tips: [
      "La plateforme fonctionne en boucle fermée : Observation → Analyse → Action",
      "Vos données restent privées et sécurisées sur Google Cloud",
      "L'IA apprend de vos validations pour s'améliorer"
    ]
  },
  {
    id: 2,
    title: "Étape 1 : Ajouter un Site",
    icon: Globe,
    description: "Commencez par enregistrer le site web que vous souhaitez optimiser. L'URL sera utilisée par notre Crawler pour analyser vos pages.",
    tips: [
      "Allez dans Paramètres > Sites",
      "Cliquez sur 'Ajouter un site'",
      "Entrez l'URL de votre site (ex: https://mon-site.com)",
      "Un premier audit sera lancé automatiquement"
    ],
    action: { label: "Aller aux Paramètres", href: "/settings" }
  },
  {
    id: 3,
    title: "Étape 2 : Observer les Données",
    icon: Search,
    description: "La couche Observation collecte en continu les métriques SEO : positions SERP, Core Web Vitals, et logs de bots.",
    tips: [
      "Le Dashboard affiche un résumé en temps réel",
      "La page 'Observation' montre les détails du Crawler",
      "Les audits sont planifiés automatiquement (configurable)"
    ],
    action: { label: "Voir l'Observation", href: "/observation" }
  },
  {
    id: 4,
    title: "Étape 3 : Comprendre les Agents IA",
    icon: Brain,
    description: "Nos agents IA spécialisés analysent vos données et génèrent des propositions d'optimisation. Chaque agent a un rôle précis.",
    tips: [
      "Agent Sémantique : Améliore les mots-clés et le contenu",
      "Agent Technique : Corrige les balises meta, schema.org",
      "Agent Performance : Optimise les images et le temps de chargement"
    ],
    action: { label: "Explorer les Agents", href: "/agents" }
  },
  {
    id: 5,
    title: "Étape 4 : Valider les Propositions",
    icon: CheckCircle,
    description: "Vous gardez le contrôle ! Chaque modification proposée par l'IA doit être validée par vous avant d'être appliquée (Human-in-the-loop).",
    tips: [
      "Consultez les propositions dans la page 'Reconstruction'",
      "Visualisez le diff (avant/après) pour chaque changement",
      "Approuvez ou Rejetez selon votre jugement",
      "L'IA apprend de vos retours pour s'améliorer"
    ],
    action: { label: "Voir les Propositions", href: "/reconstruction" }
  }
];

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tutorialSteps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BookOpen size={28} />
        <h1>Tutoriel</h1>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        <span className={styles.progressText}>{currentStep + 1} / {tutorialSteps.length}</span>
      </div>

      {/* Step Content */}
      <div className={styles.stepCard}>
        <div className={styles.stepIcon}>
          <Icon size={48} />
        </div>
        <h2 className={styles.stepTitle}>{step.title}</h2>
        <p className={styles.stepDescription}>{step.description}</p>

        <ul className={styles.tipsList}>
          {step.tips.map((tip, idx) => (
            <li key={idx}>
              <PlayCircle size={16} />
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        {step.action && (
          <a href={step.action.href} className={styles.actionButton}>
            {step.action.label}
            <ChevronRight size={18} />
          </a>
        )}
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button 
          onClick={prevStep} 
          disabled={currentStep === 0}
          className={styles.navButton}
        >
          <ChevronLeft size={20} />
          Précédent
        </button>

        {currentStep < tutorialSteps.length - 1 ? (
          <button onClick={nextStep} className={`${styles.navButton} ${styles.primary}`}>
            Suivant
            <ChevronRight size={20} />
          </button>
        ) : (
          <a href="/" className={`${styles.navButton} ${styles.primary}`}>
            Terminer
            <Rocket size={20} />
          </a>
        )}
      </div>

      {/* Step Dots */}
      <div className={styles.dots}>
        {tutorialSteps.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentStep(idx)}
            className={`${styles.dot} ${idx === currentStep ? styles.activeDot : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
