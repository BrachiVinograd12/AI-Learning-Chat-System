import { LearningMode } from '@ai-learning/shared';

export interface ModeUiConfig {
  value: LearningMode;
  label: string;
  icon: string;
  headerLabel: string;
  description: string;
  inputPlaceholder: string;
  sendLabel: string;
  typingLabel: string;
  badgeClass: string;
}

export const LEARNING_MODE_UI: ModeUiConfig[] = [
  {
    value: LearningMode.Explanation,
    label: 'Explanation',
    icon: '📖',
    headerLabel: 'Explanation Mode',
    description: 'Get clear, simple explanations of any topic',
    inputPlaceholder: 'Ask me to explain something...',
    sendLabel: 'Ask',
    typingLabel: 'Preparing explanation...',
    badgeClass: 'mode-badge--explanation',
  },
  {
    value: LearningMode.Practice,
    label: 'Practice',
    icon: '✏️',
    headerLabel: 'Practice Mode',
    description: 'Generate exercises and practice problems',
    inputPlaceholder: 'Request a practice exercise or describe a topic...',
    sendLabel: 'Practice',
    typingLabel: 'Creating exercises...',
    badgeClass: 'mode-badge--practice',
  },
  {
    value: LearningMode.Exam,
    label: 'Exam',
    icon: '📝',
    headerLabel: 'Exam Mode',
    description: 'Simulate a test with exam-style questions',
    inputPlaceholder: 'Type your answer or say "start exam"...',
    sendLabel: 'Submit',
    typingLabel: 'Evaluating answer...',
    badgeClass: 'mode-badge--exam',
  },
  {
    value: LearningMode.Hint,
    label: 'Hint',
    icon: '💡',
    headerLabel: 'Hint Mode',
    description: 'Receive progressive hints without full answers',
    inputPlaceholder: 'Describe what you are stuck on...',
    sendLabel: 'Get hint',
    typingLabel: 'Thinking of a hint...',
    badgeClass: 'mode-badge--hint',
  },
];

export function getModeUiConfig(mode: LearningMode): ModeUiConfig {
  return LEARNING_MODE_UI.find((m) => m.value === mode) ?? LEARNING_MODE_UI[0];
}
