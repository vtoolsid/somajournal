export interface ChakraInfo {
  id: string;
  name: string;
  sanskrit: string;
  color: string;
  element: string;
  location: string;
  description: string;
  properties: string[];
  emotions: string[];
  physicalAspects: string[];
  mentalAspects: string[];
  affirmation: string;
}

export const chakraData: ChakraInfo[] = [
  {
    id: 'root',
    name: 'Root Chakra',
    sanskrit: 'Muladhara',
    color: '#E53935',
    element: 'Earth',
    location: 'Base of spine',
    description: 'The foundation of our energy system, governing survival, stability, and grounding.',
    properties: ['Grounding', 'Stability', 'Security', 'Survival'],
    emotions: ['Security', 'Trust', 'Groundedness', 'Stability'],
    physicalAspects: ['Legs', 'Feet', 'Lower back', 'Adrenal glands'],
    mentalAspects: ['Focus', 'Determination', 'Self-preservation', 'Material needs'],
    affirmation: 'I am safe, secure, and grounded in my being.'
  },
  {
    id: 'sacral',
    name: 'Sacral Chakra',
    sanskrit: 'Svadhisthana',
    color: '#FB8C00',
    element: 'Water',
    location: 'Below navel',
    description: 'The center of creativity, sexuality, and emotional expression.',
    properties: ['Creativity', 'Sexuality', 'Emotions', 'Relationships'],
    emotions: ['Joy', 'Passion', 'Pleasure', 'Creativity'],
    physicalAspects: ['Reproductive organs', 'Kidneys', 'Bladder', 'Lower abdomen'],
    mentalAspects: ['Emotional balance', 'Creative expression', 'Intimacy', 'Change'],
    affirmation: 'I embrace my creativity and allow my emotions to flow freely.'
  },
  {
    id: 'solar',
    name: 'Solar Plexus Chakra',
    sanskrit: 'Manipura',
    color: '#FDD835',
    element: 'Fire',
    location: 'Upper abdomen',
    description: 'The seat of personal power, confidence, and self-worth.',
    properties: ['Personal power', 'Confidence', 'Self-esteem', 'Control'],
    emotions: ['Confidence', 'Motivation', 'Personal power', 'Self-worth'],
    physicalAspects: ['Stomach', 'Liver', 'Pancreas', 'Digestive system'],
    mentalAspects: ['Willpower', 'Decision making', 'Personal identity', 'Autonomy'],
    affirmation: 'I am confident in my abilities and trust my inner wisdom.'
  },
  {
    id: 'heart',
    name: 'Heart Chakra',
    sanskrit: 'Anahata',
    color: '#43A047',
    element: 'Air',
    location: 'Center of chest',
    description: 'The bridge between physical and spiritual, governing love and compassion.',
    properties: ['Love', 'Compassion', 'Connection', 'Healing'],
    emotions: ['Love', 'Compassion', 'Forgiveness', 'Peace'],
    physicalAspects: ['Heart', 'Lungs', 'Arms', 'Hands'],
    mentalAspects: ['Empathy', 'Emotional healing', 'Relationships', 'Unity'],
    affirmation: 'I give and receive love freely and unconditionally.'
  },
  {
    id: 'throat',
    name: 'Throat Chakra',
    sanskrit: 'Vishuddha',
    color: '#1E88E5',
    element: 'Sound',
    location: 'Throat',
    description: 'The center of communication, truth, and authentic self-expression.',
    properties: ['Communication', 'Truth', 'Expression', 'Authenticity'],
    emotions: ['Truth', 'Communication', 'Expression', 'Authenticity'],
    physicalAspects: ['Throat', 'Neck', 'Thyroid', 'Mouth'],
    mentalAspects: ['Clear communication', 'Self-expression', 'Truth speaking', 'Listening'],
    affirmation: 'I speak my truth with clarity and confidence.'
  },
  {
    id: 'third-eye',
    name: 'Third Eye Chakra',
    sanskrit: 'Ajna',
    color: '#3949AB',
    element: 'Light',
    location: 'Between eyebrows',
    description: 'The center of intuition, wisdom, and spiritual insight.',
    properties: ['Intuition', 'Wisdom', 'Insight', 'Perception'],
    emotions: ['Wisdom', 'Intuition', 'Clarity', 'Understanding'],
    physicalAspects: ['Eyes', 'Brain', 'Pituitary gland', 'Nervous system'],
    mentalAspects: ['Intuition', 'Imagination', 'Concentration', 'Self-awareness'],
    affirmation: 'I trust my intuition and see clearly with wisdom.'
  },
  {
    id: 'crown',
    name: 'Crown Chakra',
    sanskrit: 'Sahasrara',
    color: '#8E24AA',
    element: 'Thought',
    location: 'Top of head',
    description: 'The connection to divine consciousness and spiritual enlightenment.',
    properties: ['Spirituality', 'Enlightenment', 'Connection', 'Unity'],
    emotions: ['Spiritual', 'Connected', 'Enlightened', 'Unified'],
    physicalAspects: ['Brain', 'Pineal gland', 'Nervous system', 'Head'],
    mentalAspects: ['Spiritual connection', 'Higher consciousness', 'Universal understanding', 'Transcendence'],
    affirmation: 'I am connected to the divine wisdom of the universe.'
  }
];

export const getChakraById = (id: string): ChakraInfo | undefined => {
  return chakraData.find(chakra => chakra.id === id);
};

export const getChakraByEmotion = (emotion: string): ChakraInfo | undefined => {
  return chakraData.find(chakra => 
    chakra.emotions.some(e => e.toLowerCase().includes(emotion.toLowerCase()))
  );
};